/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import WebSocketWrapper from '../../components/websocketWrapper';
import Start from './start';

const { ipcRenderer } = window.require('electron');
// import api from '../../components/axios';


export default function StartWrapper() {
  const [allowed, setAllowed] = useState(false);

  // async function checkToken() {
  //   try {
  //     const token = localStorage.getItem("token");

  //      await api.get("/token", {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });


  //   } catch (err) {

  //   }
  // }

  function connectToWebSocket() {
    const ws = new WebSocket("ws://localhost:5555/ws");
   

    ws.onopen = () => {
      console.log('connected successfully');
      const key = {
        key: "E11MN6G5T13TY7M5Q9RD97K5HKHH4UPSMX",
      }
      ws.send(JSON.stringify(key))
    };

    ws.onmessage = (evt) => {
      console.log(evt.data);
      if (evt.data === "access granted") {
        const subscription = {
          ID: 5,
          Token: "abcde"
        }
        ws.send(JSON.stringify(subscription))
      } else if (evt.data === "connected with no restrictions") {
        setAllowed(true);
      } else if (evt.data === "found simultaneous connections for this id") {
        ipcRenderer.send('login', 'disconnect');
      }

    }

    ws.onclose = () => {
      console.log("connection closed")
    }

    ws.onerror = (evt) => {
      console.log("error: ", evt)
    }

  }

  useEffect(() => {
    connectToWebSocket();
  }, []);

  if (allowed) {
    return (
      <WebSocketWrapper>
        <Start />
      </WebSocketWrapper>
    );
  }

  return (
    <div>
      <h1>Connecting...</h1>
    </div>
  );
}
