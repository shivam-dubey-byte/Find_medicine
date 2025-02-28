from fastapi import FastAPI, File, UploadFile, HTTPException
import easyocr
import requests
import os

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])  # Specify languages (e.g., 'en' for English)

# Initialize FastAPI app
app = FastAPI(title="Medicine Information API")  # Ensure this line is present

# Function to extract text from an image
def extract_text_from_image(image_path):
    result = reader.readtext(image_path)
    extracted_text = " ".join([detection[1] for detection in result])  # Combine all detected text
    return extracted_text

# Function to call OpenRouter API and get medicine information
def get_medicine_info_using_openrouter(text):
    api_url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": "Bearer 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",  # Replace with your OpenRouter API key
        "Content-Type": "application/json"
    }
    payload = {
        "model": "openai/gpt-3.5-turbo",  # Use GPT-3.5 via OpenRouter
        "messages": [
            {"role": "user", "content": f"Extract medicine information from the following text: {text}. Provide details like name, dosage, uses, and side effects."}
        ],
        "max_tokens": 150
    }
    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.HTTPError as err:
        return f"HTTP Error: {err}"
    except Exception as e:
        return f"Error: {e}"

# API endpoint to upload an image and get medicine information
@app.post("/medicine-info")
async def medicine_info(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        # Step 1: Extract text from the image
        extracted_text = extract_text_from_image(file_path)

        # Step 2: Get medicine information using OpenRouter API
        medicine_info = get_medicine_info_using_openrouter(extracted_text)

        # Clean up: Delete the temporary file
        os.remove(file_path)

        # Return the medicine information
        return {"medicine_info": medicine_info}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
