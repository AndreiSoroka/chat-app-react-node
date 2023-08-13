import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import messageStore from "./entities/Message/model/messageStore.ts";

const App: React.FC = observer(() => {
  const [displayName, setDisplayName] = useState("");
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    messageStore.fetchMessages()
      .then(() => {
        messageStore.initWebSocket();
      });
    return () => {
      // todo Code above is "promise", so it is possible to execute before it is created. It is a potential bug.
      messageStore.ws?.close();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await messageStore.sendMessage(displayName, textContent);
    if (response?.success) {
      setTextContent("");
    }
  };

  return (
    <div>
      <div>
        {messageStore.messages.map((message, index) => (
          <div key={index}>
            <strong>{message.displayName}</strong>: {message.textContent}
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {messageStore.fetchError && (
          <div style={{color: 'red'}}>
            Error {messageStore.fetchError.errorCode}: {messageStore.fetchError.errorMessage}
          </div>
        )}
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          readOnly={messageStore.status === "pending"}
        />
        <input
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Message"
          readOnly={messageStore.status === "pending"}
        />
        <button type="submit" disabled={messageStore.status === "pending"}>Send</button>
      </form>
    </div>
  );
});

export default App;
