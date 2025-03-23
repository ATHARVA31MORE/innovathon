import pandas as pd
import random

# Define column names (excluding isFraud and isFlaggedFraud)
columns = [
    "step", "type", "amount", "nameOrig", "oldbalanceOrg", "newbalanceOrig",
    "nameDest", "oldbalanceDest", "newbalanceDest"
]

# Define possible transaction types
transaction_types = ["PAYMENT", "TRANSFER", "CASH_OUT", "DEBIT"]

# Number of rows in the dataset
num_rows = 50  # Change as needed for larger datasets

# Generate synthetic data
data = []
for i in range(num_rows):
    step = random.randint(1, 30)  # Simulate transactions over multiple days
    trans_type = random.choice(transaction_types)
    amount = round(random.uniform(10, 500000), 2)

    nameOrig = "C" + str(random.randint(1000000000, 9999999999))  # Customer ID
    oldbalanceOrg = round(random.uniform(0, 1000000), 2)  # Higher range for realistic transactions
    newbalanceOrig = max(0, oldbalanceOrg - amount)

    nameDest = "M" + str(random.randint(100000000, 9999999999))  # Merchant ID
    oldbalanceDest = random.choice([0, round(random.uniform(0, 1000000), 2)])
    newbalanceDest = oldbalanceDest + amount if trans_type in ["TRANSFER", "CASH_OUT"] else oldbalanceDest

    # Append the transaction data (excluding isFraud and isFlaggedFraud)
    data.append([step, trans_type, amount, nameOrig, oldbalanceOrg, newbalanceOrig,
                 nameDest, oldbalanceDest, newbalanceDest])

# Create DataFrame
df = pd.DataFrame(data, columns=columns)

# Save to CSV
df.to_csv("synthetic_fraud_data.csv", index=False)

print("Synthetic fraud dataset generated for prediction: synthetic_fraud_data.csv")