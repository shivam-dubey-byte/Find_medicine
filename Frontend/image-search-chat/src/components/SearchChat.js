import React, { useState, useContext } from 'react';
import { FaImage, FaPaperPlane } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const SearchChat = () => {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [medicineInfo, setMedicineInfo] = useState(null); // State to store parsed medicine info
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessages([...messages, { text: `Uploaded: ${selectedFile.name}`, isUser: true }]);
    }
  };

  const handleSend = async () => {
    if (!file) {
      alert('Please select an image first.');
      return;
    }

    // Add a loading message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: 'Processing image...', isUser: false },
    ]);

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send API request
      const response = await fetch('http://127.0.0.1:8000/medicine-info', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch medicine info');
      }

      const data = await response.json();

      // Parse the medicine_info field
      const parsedInfo = data.medicine_info.split('\n').map((line, index) => ({
        id: index,
        text: line,
      }));

      // Update state with parsed medicine info
      setMedicineInfo(parsedInfo);

      // Add API response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Medicine information:', isUser: false },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Error: ${error.message}`, isUser: false },
      ]);
    } finally {
      setFile(null); // Clear the file input
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: darkMode ? '#333' : 'linear-gradient(135deg, #6a11cb, #2575fc)',
        color: darkMode ? '#fff' : '#ffffff',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ marginBottom: '10px' }}>Medicine Image Search</h1>
          <p>Upload an image to get information about the medicine.</p>
          <button
            onClick={toggleDarkMode}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: darkMode ? '#555' : '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Toggle Dark Mode
          </button>
        </div>

        <div
          style={{
            background: darkMode ? '#444' : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#ff6f61',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              <FaImage />
              Choose Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </label>
            <button
              onClick={handleSend}
              style={{
                background: '#4caf50',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              <FaPaperPlane /> Send
            </button>
          </div>

          <div
            style={{
              height: '300px',
              overflowY: 'auto',
              padding: '10px',
              background: darkMode ? '#555' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  background: darkMode ? '#666' : 'rgba(255, 255, 255, 0.2)',
                  color: darkMode ? '#fff' : '#ffffff',
                  padding: '10px',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  maxWidth: '70%',
                  alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {message.text}
              </div>
            ))}

            {/* Display parsed medicine info */}
            {medicineInfo && (
              <div
                style={{
                  background: darkMode ? '#666' : 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '10px',
                }}
              >
                {medicineInfo.map((item) => (
                  <p key={item.id} style={{ margin: '5px 0' }}>
                    {item.text}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchChat;