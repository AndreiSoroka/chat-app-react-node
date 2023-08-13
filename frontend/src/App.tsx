import React, {useState, useEffect, useRef} from 'react';


type Message = {
  displayName: string;
  textContent: string;
  timestamp: number;
}

type ResponseMessageList = {
  success: boolean;
  count: number;
  data: Message[]
}

function App() {
  const [messages, setMessages] = useState<{
    displayName: string;
    textContent: string;
    timestamp: number
  }[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [textContent, setTextContent] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch('/api/message/list')
      .then<ResponseMessageList>(response => response.json())
      .then(data => {
        setMessages(data.data)
      });

    ws.current = new WebSocket(`ws://${window.location.host}/api/socket`);
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName,
        textContent
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
        } else {
          setTextContent('');
        }
      })
      .catch(error => {
        console.error('Failed to send message:', error);
      });
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.displayName}</strong>: {message.textContent}
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Display Name"
        />
        <input
          value={textContent}
          onChange={e => setTextContent(e.target.value)}
          placeholder="Message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
