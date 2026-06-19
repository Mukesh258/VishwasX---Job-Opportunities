import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse

import joblib
import pandas as pd

SUSPICIOUS_WORDS = ["login", "verify", "secure", "update", "account", "signin", "bank", "wallet"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Predict phishing risk for URLs or feature rows.")
    parser.add_argument(
        "--model-path",
        type=str,
        default="artifacts/phishing_model.joblib",
        help="Path to trained model artifact.",
    )
    parser.add_argument(
        "--url",
        type=str,
        default="",
        help="Single URL string to score (for text models).",
    )
    parser.add_argument(
        "--input-csv",
        type=str,
        default="",
        help="CSV file for batch prediction.",
    )
    parser.add_argument(
        "--output-csv",
        type=str,
        default="predictions.csv",
        help="Output CSV file path for batch predictions.",
    )
    return parser.parse_args()


def normalize_url(url: str) -> str:
    url = str(url).strip()
    if not url.startswith(("http://", "https://")):
        url = f"http://{url}"
    return url


def url_to_features(raw_url: str) -> dict:
    url = normalize_url(raw_url)
    try:
        parsed = urlparse(url)
    except ValueError:
        parsed = urlparse("http://invalid.local")
    host = parsed.netloc.lower()
    path = parsed.path or ""
    query = parsed.query or ""
    full = url.lower()

    return {
        "url_length": len(url),
        "valid_url": int(bool(parsed.netloc and "." in parsed.netloc)),
        "at_symbol": int("@" in url),
        "sensitive_words_count": sum(1 for word in SUSPICIOUS_WORDS if word in full),
        "path_length": len(path) + len(query),
        "isHttps": int(parsed.scheme == "https"),
        "nb_dots": url.count("."),
        "nb_hyphens": url.count("-"),
        "nb_and": url.count("&"),
        "nb_or": url.lower().count("|") + len(re.findall(r"\bor\b", url.lower())),
        "nb_www": url.lower().count("www"),
        "nb_com": url.lower().count(".com"),
        "nb_underscore": url.count("_"),
        "has_ip_host": int(bool(re.match(r"^\d{1,3}(?:\.\d{1,3}){3}$", host))),
        "double_slash_path": int("//" in parsed.path),
        "host_length": len(host),
    }


def align_to_model_columns(df: pd.DataFrame, feature_columns: list[str]) -> pd.DataFrame:
    numeric_df = df.apply(pd.to_numeric, errors="coerce").fillna(0)
    return numeric_df.reindex(columns=feature_columns, fill_value=0)


def main() -> None:
    args = parse_args()

    model_path = Path(args.model_path)
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")

    artifact = joblib.load(model_path)
    model = artifact["model"]
    meta = artifact.get("metadata", {})
    dataset_mode = meta.get("dataset_mode", "text_to_features")
    feature_columns = artifact.get("feature_columns", [])

    if args.url:
        if dataset_mode in {"features", "combined_features", "text_to_features"}:
            input_df = pd.DataFrame([url_to_features(args.url)])
            if feature_columns:
                input_df = align_to_model_columns(input_df, feature_columns)
            preds = model.predict(input_df)
            prob = model.predict_proba(input_df)[0][1] if hasattr(model, "predict_proba") else None
        else:
            preds = model.predict([args.url])
            prob = model.predict_proba([args.url])[0][1] if hasattr(model, "predict_proba") else None

        result = {
            "url": args.url,
            "prediction": int(preds[0]) if str(preds[0]).isdigit() else str(preds[0]),
        }

        if prob is not None:
            result["phishing_probability"] = float(prob)
            result["trust_score"] = float((1 - prob) * 100)

        print(json.dumps(result, indent=2))
        return

    if args.input_csv:
        batch_df = pd.read_csv(args.input_csv)

        if dataset_mode in {"text_to_features", "combined_features"}:
            if "url" not in batch_df.columns:
                raise ValueError("For URL-based batch inference, input CSV must include a 'url' column.")
            feature_df = pd.DataFrame([url_to_features(url) for url in batch_df["url"].astype(str)])
            X = align_to_model_columns(feature_df, feature_columns) if feature_columns else feature_df
        elif dataset_mode == "features":
            X = align_to_model_columns(batch_df, feature_columns) if feature_columns else batch_df
        else:
            X = batch_df.copy()

        batch_df["prediction"] = model.predict(X)
        if hasattr(model, "predict_proba"):
            batch_df["phishing_probability"] = model.predict_proba(X)[:, 1]
            batch_df["trust_score"] = (1 - batch_df["phishing_probability"]) * 100

        batch_df.to_csv(args.output_csv, index=False)
        print(f"Saved predictions to: {args.output_csv}")
        return

    raise ValueError("Provide either --url or --input-csv.")


if __name__ == "__main__":
    main()
