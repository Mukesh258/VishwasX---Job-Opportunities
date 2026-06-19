# Phishing Service

This folder now contains a trainable phishing ML pipeline designed for a hybrid detection flow.

## Files

- `dataset/malicious_phish.csv`: URL + class labels dataset
- `dataset/phishing_url_dataset.csv`: engineered feature dataset
- `train_phishing_model.py`: model training script
- `predict_phishing.py`: inference script
- `requirements.txt`: Python dependencies

## What the trainer supports

1. Text URL dataset mode (url + type/label columns)
2. Engineered features dataset mode (target column)
3. Combined dataset mode: merges both datasets into one binary phishing model

By default, training runs as binary phishing detection.

## Setup (PowerShell)

```powershell
cd C:\Users\Mukesh\Desktop\career-comeback-ai-main\ml-services\phishing
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Train commands

### 1) Train on URL text dataset only (binary)

```powershell
python .\train_phishing_model.py --dataset .\dataset\malicious_phish.csv --output-dir .\artifacts
```

### 2) Train on combined datasets (recommended)

```powershell
python .\train_phishing_model.py --combine-datasets --text-dataset .\dataset\malicious_phish.csv --feature-dataset .\dataset\phishing_url_dataset.csv --output-dir .\artifacts_combined
```

### 3) Train on engineered feature dataset only

```powershell
python .\train_phishing_model.py --dataset .\dataset\phishing_url_dataset.csv --output-dir .\artifacts_features
```

## Inference commands

### Score one URL

```powershell
python .\predict_phishing.py --model-path .\artifacts_combined\phishing_model.joblib --url "http://secure-update-now.example/login"
```

### Batch score CSV

```powershell
python .\predict_phishing.py --model-path .\artifacts_combined\phishing_model.joblib --input-csv .\dataset\malicious_phish.csv --output-csv .\predictions.csv
```

## Training outputs

- artifacts_xxx/phishing_model.joblib: serialized model + metadata
- artifacts_xxx/metrics.json: evaluation metrics

## Integration note

Use phishing probability from predict_proba as one signal in your company trust pipeline, then combine with:

- domain age
- SSL validation
- blacklist checks
- email-domain match

Recommended SecureApply decision:

- phishing_probability < 0.15 => Genuine candidate
- trust_score = (1 - phishing_probability) * 100
- approve only when trust_score >= 85

This aligns model output with the platform trust gate and avoids flipped logic.
