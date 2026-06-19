import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

RANDOM_STATE = 42
SUSPICIOUS_WORDS = ["login", "verify", "secure", "update", "account", "signin", "bank", "wallet"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train phishing detection model (hybrid-ready).")
    parser.add_argument(
        "--dataset",
        type=str,
        default="dataset/malicious_phish.csv",
        help="Path to single CSV dataset (legacy mode).",
    )
    parser.add_argument(
        "--combine-datasets",
        action="store_true",
        help="Combine malicious_phish.csv and phishing_url_dataset.csv into one binary dataset.",
    )
    parser.add_argument(
        "--text-dataset",
        type=str,
        default="dataset/malicious_phish.csv",
        help="URL text dataset path used in combine mode.",
    )
    parser.add_argument(
        "--feature-dataset",
        type=str,
        default="dataset/phishing_url_dataset.csv",
        help="Engineered feature dataset path used in combine mode.",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="artifacts",
        help="Directory to save trained model and metrics.",
    )
    parser.add_argument(
        "--test-size",
        type=float,
        default=0.2,
        help="Test split ratio.",
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


def malicious_to_binary_features(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    if "url" not in df.columns:
        raise ValueError("malicious_phish dataset must include 'url' column.")
    if "type" not in df.columns and "label" not in df.columns:
        raise ValueError("malicious_phish dataset must include 'type' or 'label' column.")

    raw_label = df["type"] if "type" in df.columns else df["label"]
    y = (raw_label.astype(str).str.lower().str.strip() == "phishing").astype(int)
    X = pd.DataFrame([url_to_features(u) for u in df["url"].fillna("")])
    return X, y


def feature_dataset_binary(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    if "target" not in df.columns:
        raise ValueError("Feature dataset must include 'target' column.")
    y = pd.to_numeric(df["target"], errors="coerce").fillna(0).astype(int)
    X = df.drop(columns=["target"]).apply(pd.to_numeric, errors="coerce").fillna(0)
    return X, y


def align_columns(base: pd.DataFrame, other: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    all_columns = sorted(set(base.columns).union(other.columns))
    base_aligned = base.reindex(columns=all_columns, fill_value=0)
    other_aligned = other.reindex(columns=all_columns, fill_value=0)
    return base_aligned, other_aligned


def build_models() -> dict:
    logistic = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "classifier",
                LogisticRegression(
                    max_iter=3000,
                    random_state=RANDOM_STATE,
                    class_weight="balanced",
                ),
            ),
        ]
    )

    rf = RandomForestClassifier(
        n_estimators=500,
        random_state=RANDOM_STATE,
        class_weight="balanced_subsample",
        n_jobs=-1,
    )

    return {
        "logistic_regression": logistic,
        "random_forest": rf,
    }


def evaluate_binary(y_true: pd.Series, y_pred: pd.Series, y_prob: pd.Series) -> dict:
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "f1": float(f1_score(y_true, y_pred, average="binary")),
        "roc_auc": float(roc_auc_score(y_true, y_prob)),
        "classification_report": classification_report(y_true, y_pred, output_dict=True),
    }


def load_data(args: argparse.Namespace) -> tuple[pd.DataFrame, pd.Series, dict]:
    if args.combine_datasets:
        text_path = Path(args.text_dataset)
        feature_path = Path(args.feature_dataset)
        if not text_path.exists():
            raise FileNotFoundError(f"Text dataset not found: {text_path}")
        if not feature_path.exists():
            raise FileNotFoundError(f"Feature dataset not found: {feature_path}")

        text_df = pd.read_csv(text_path)
        feature_df = pd.read_csv(feature_path)

        X_text, y_text = malicious_to_binary_features(text_df)
        X_feature, y_feature = feature_dataset_binary(feature_df)

        X_text, X_feature = align_columns(X_text, X_feature)

        X = pd.concat([X_text, X_feature], ignore_index=True)
        y = pd.concat([y_text, y_feature], ignore_index=True)

        meta = {
            "dataset_mode": "combined_features",
            "label_mode": "binary",
            "sources": [str(text_path), str(feature_path)],
        }
        return X, y, meta

    dataset_path = Path(args.dataset)
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found: {dataset_path}")

    df = pd.read_csv(dataset_path)
    if "url" in df.columns and ("type" in df.columns or "label" in df.columns):
        X, y = malicious_to_binary_features(df)
        meta = {
            "dataset_mode": "text_to_features",
            "label_mode": "binary",
            "sources": [str(dataset_path)],
        }
        return X, y, meta

    if "target" in df.columns:
        X, y = feature_dataset_binary(df)
        meta = {
            "dataset_mode": "features",
            "label_mode": "binary",
            "sources": [str(dataset_path)],
        }
        return X, y, meta

    raise ValueError("Unsupported dataset schema. Expected URL labels or target column.")


def main() -> None:
    args = parse_args()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    X, y, data_meta = load_data(args)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=args.test_size,
        random_state=RANDOM_STATE,
        stratify=y,
    )

    models = build_models()
    all_metrics = {}
    best_name = None
    best_score = -1.0
    best_model = None

    for model_name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]
        metrics = evaluate_binary(y_test, y_pred, y_prob)
        all_metrics[model_name] = metrics

        ranking_score = metrics["roc_auc"] * 0.6 + metrics["f1"] * 0.4
        if ranking_score > best_score:
            best_score = ranking_score
            best_name = model_name
            best_model = model

    assert best_model is not None

    artifact = {
        "model": best_model,
        "feature_columns": list(X.columns),
        "metadata": {
            **data_meta,
            "selected_model": best_name,
            "selection_score": best_score,
        },
    }

    model_path = output_dir / "phishing_model.joblib"
    metrics_path = output_dir / "metrics.json"

    joblib.dump(artifact, model_path)
    metrics_path.write_text(
        json.dumps(
            {
                "selected_model": best_name,
                "selection_score": best_score,
                "models": all_metrics,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    selected_metrics = all_metrics[best_name]
    print("Training complete")
    print(f"Mode: {data_meta['dataset_mode']}")
    print(f"Model saved: {model_path}")
    print(f"Metrics saved: {metrics_path}")
    print(f"Selected model: {best_name}")
    print(f"Accuracy: {selected_metrics['accuracy']:.4f}")
    print(f"F1: {selected_metrics['f1']:.4f}")
    print(f"ROC-AUC: {selected_metrics['roc_auc']:.4f}")


if __name__ == "__main__":
    main()
