import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

def train_classifier():
    print("Loading Job Description Dataset...")
    
    # Path to the dataset
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset', 'Job Description Dataset', 'job_title_des.csv')
    
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return
        
    df = pd.read_csv(dataset_path)
    
    # Clean dataframe, ensuring we have text and labels
    df = df.dropna(subset=['Job Title', 'Job Description'])
    
    X = df['Job Description']
    y = df['Job Title']
    
    print(f"Loaded {len(df)} records. Training on {len(y.unique())} different roles...")
    
    # Split data - using a small subset if it's huge, or train on everything
    # The dataset has 60k+ rows, so it might take a moment.
    
    # Use a TF-IDF vectorizer and a Random Forest Classifier
    pipeline = make_pipeline(
        TfidfVectorizer(stop_words='english', max_features=5000),
        RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
    )
    
    print("Training model... (this may take a few minutes depending on your CPU)")
    
    # Split for validation
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    pipeline.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    print(classification_report(y_test, y_pred))
    
    model_path = os.path.join(os.path.dirname(__file__), 'resume_classifier.pkl')
    joblib.dump(pipeline, model_path)
    
    print(f"Success! Model trained and saved to {model_path}")

if __name__ == "__main__":
    train_classifier()
