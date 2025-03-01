from fastapi import FastAPI, File, UploadFile, HTTPException
import easyocr
import requests
import os

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])  # Specify languages (e.g., 'en' for English)

# Function to extract text from an image
def extract_text_from_image(image_path):
    print("Extracting text from the image...")
    result = reader.readtext(image_path)
    extracted_text = " ".join([detection[1] for detection in result])  # Combine all detected text
    print("Extracted Text:\n", extracted_text)
    return extracted_text

# Function to call OpenRouter API and get medicine information
def get_medicine_info_using_openrouter(text):
    api_url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": "Bearer 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",  # Replace with your OpenRouter API key
        "Content-Type": "application/json"
    }
    payload = {
        "model": "google/gemini-2.0-flash-lite-preview-02-05:free",#"google/gemini-2.0-flash-lite-001",  # Use Google Gemini via OpenRouter
        "messages": [
            {"role": "user", "content": f"Extract medicine information from the following text: {text}. Provide details like name, dosage, uses, and side effects."}
        ],
        "max_tokens": 300  # Increased from 150 to 300
    }
    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response.json()["choices"][0]["message"]["content"]
    except requests.exceptions.HTTPError as err:
        return f"HTTP Error: {err}"
    except Exception as e:
        return f"Error: {e}"

# Main function
def main():
    # Path to the image file
    image_path = "medicine.jpg"  # Replace with the path to your image

    # Step 1: Extract text from the image
    extracted_text = extract_text_from_image(image_path)

    # Step 2: Get medicine information using OpenRouter API
    print("\nFetching medicine information from OpenRouter API...")
    medicine_info = get_medicine_info_using_openrouter(extracted_text)
    print("Medicine Information:\n", medicine_info)

if __name__ == "__main__":
    main()