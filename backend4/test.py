import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix

def Predict_Data(filename):
    #Load the synthetic dataset
    synthetic_df = pd.read_csv(filename)  # Ensure the file exists

    #Drop Unnecessary Columns
    synthetic_df.drop(columns=['step', 'nameOrig', 'nameDest'], errors='ignore', inplace=True)

    #Encode Categorical Columns (Transaction Type)
    synthetic_df['type'] = LabelEncoder().fit_transform(synthetic_df['type'])

    #Feature Engineering (Balance Changes)
    synthetic_df['balancechange'] = synthetic_df['oldbalanceOrg'] - synthetic_df['newbalanceOrg']
    synthetic_df['destbalancechange'] = synthetic_df['oldbalanceDest'] - synthetic_df['newbalanceDest']

    # 🔹 Define Features
    X_synthetic = synthetic_df  # Features for prediction

    # 🔹 Load the Saved Model
    xgb_model = joblib.load("fraud_detection_model.pkl")  # Ensure the model file exists

    # 🔹 Make Predictions (No Scaling)
    y_pred_fraud = xgb_model.predict(X_synthetic)  # Predict isFraud
    y_pred_flagged = xgb_model.predict(X_synthetic)  # Predict isFlaggedFraud (if applicable)

    # 🔹 Add Predictions to Original DataFrame
    synthetic_df['predicted_isFraud'] = y_pred_fraud
    synthetic_df['predicted_isFlaggedFraud'] = y_pred_flagged

    # 🔹 Evaluate Model (if ground truth is available)
    results = {}
    if 'isFraud' in synthetic_df.columns:
        # Confusion Matrix and Classification Report for isFraud
        results["confusion_matrix_isFraud"] = confusion_matrix(synthetic_df['isFraud'], y_pred_fraud).tolist()
        results["classification_report_isFraud"] = classification_report(synthetic_df['isFraud'], y_pred_fraud, output_dict=True)

        # Print Evaluation Metrics
        print("🔹 Confusion Matrix (isFraud):\n", confusion_matrix(synthetic_df['isFraud'], y_pred_fraud))
        print("\n🔹 Classification Report (isFraud):\n", classification_report(synthetic_df['isFraud'], y_pred_fraud))

    if 'isFlaggedFraud' in synthetic_df.columns:
        # Confusion Matrix and Classification Report for isFlaggedFraud
        results["confusion_matrix_isFlaggedFraud"] = confusion_matrix(synthetic_df['isFlaggedFraud'], y_pred_flagged).tolist()
        results["classification_report_isFlaggedFraud"] = classification_report(synthetic_df['isFlaggedFraud'], y_pred_flagged, output_dict=True)

        # Print Evaluation Metrics
        print("\n🔹 Confusion Matrix (isFlaggedFraud):\n", confusion_matrix(synthetic_df['isFlaggedFraud'], y_pred_flagged))
        print("\n🔹 Classification Report (isFlaggedFraud):\n", classification_report(synthetic_df['isFlaggedFraud'], y_pred_flagged))

    # 🔹 Include Predictions in Results
    results["predictions"] = synthetic_df.to_dict(orient='records')

    return results


# Example Usage
# results = Predict_Data("synthetic_fraud_data.csv")
# print(results)