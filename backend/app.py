import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts
model = joblib.load("backend/model.pkl")
columns = joblib.load("backend/columns.pkl")

# Remove Timestamp if present
columns = [col for col in columns if col != "Timestamp"]

class UserInput(BaseModel):
    features: list


@app.get("/")
def home():
    return {"message": "Work Life Balance API Running 🚀"}

@app.get("/columns")
def get_columns():
    return {"columns": columns}

@app.post("/predict")
def predict(data: UserInput):

    import pandas as pd

    input_df = pd.DataFrame([data.features], columns=columns)

    prediction = model.predict(input_df)[0]

    labels = {
        0: "Bad",
        1: "Average",
        2: "Good"
    }

    return {
        "prediction": int(prediction),
        "label": labels[prediction]
    }