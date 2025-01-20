import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (sender && receiver) {
      // Fetch messages when sender and receiver are set
      axios.get(`http://localhost:5000/messages?sender=${sender}&receiver=${receiver}`)
        .then(response => {
          setMessages(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the messages:", error);
        });
    }
  }, [sender, receiver]);

  const handleSendMessage = () => {
    if (sender && receiver && message) {
      axios.post('http://localhost:5000/messages', {
        sender,
        receiver,
        message
      })
      .then(() => {
        setMessage('');
        // Optionally fetch messages again to update the chat
        axios.get(`http://localhost:5000/messages?sender=${sender}&receiver=${receiver}`)
          .then(response => setMessages(response.data));
      })
      .catch(error => {
        console.error("Error sending message:", error);
      });
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <input 
          type="text" 
          placeholder="Sender" 
          value={sender} 
          onChange={(e) => setSender(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Receiver" 
          value={receiver} 
          onChange={(e) => setReceiver(e.target.value)} 
        />
      </div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={msg.sender === sender ? "sent" : "received"}>
            <p>{msg.message}</p>
            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input 
          type="text" 
          placeholder="Type a message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;