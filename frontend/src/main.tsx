import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {messageStore} from "@/entities/Message";

messageStore.fetchMessages().then(()=>{
  messageStore.initWebSocket();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
