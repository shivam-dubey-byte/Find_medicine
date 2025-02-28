import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import axios from "axios";
import fs from "fs";

export default function Chatbot() {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image first.");

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);
    setResponse("");
    try {
      // Save image locally
      const reader = new FileReader();
      reader.readAsArrayBuffer(image);
      reader.onloadend = () => {
        fs.writeFileSync(`./uploads/${image.name}`, Buffer.from(reader.result));
      };
      
      const res = await axios.post("http://127.0.0.1:8000/medicine-info", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data.message);
    } catch (error) {
      setResponse("Error fetching response. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 shadow-xl bg-white rounded-2xl">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Upload an image</h2>
          <Input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
          <Button onClick={handleSubmit} disabled={loading} className="w-full flex items-center gap-2">
            {loading ? "Processing..." : "Send"} <Send size={18} />
          </Button>
          {response && (
            <div className="mt-4 p-3 bg-gray-200 rounded-lg">
              <p className="text-gray-800">{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
