/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import WebSocketWrapper from '../../components/websocketWrapper';
import Start from './start';
import api from '../../components/axios';

const { ipcRenderer } = window.require('electron');
const Store = window.require('electron-store');

const store = new Store();
store.set('pid', { pid: 0 });

interface StartWrapperProps {
  id: number,
  token: string
}


export default function StartWrapper({ id, token }: StartWrapperProps) {
  const [allowed, setAllowed] = useState(false);

  async function checkToken(): Promise<boolean> {
    try {
       await api.get("/auth/check-token", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return true;
    } catch (err) {
      return false;
    }
  }

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
          ID: id,
          Token: token
        }
        ws.send(JSON.stringify(subscription))
      } else if (evt.data === "connected with no restrictions") {
        setAllowed(true);
      } else if (evt.data === "found simultaneous connections for this id") {
        (async () => {
         const authorized = await checkToken();
         if (authorized) {
           setAllowed(true);
         } else {
          ws.close()
         }
        })()
      }

    }

    ws.onclose = () => {
      const { pid } = store.get('pid');
      if (pid !== 0) {
        console.log('o pid é ', pid);
        ipcRenderer.send("stop-bot", pid);
      }
    ipcRenderer.send('multiple-logins', true);
    ipcRenderer.send('login', 'disconnect');
    }

  }

  useEffect(() => {
    connectToWebSocket();
  }, []);


  if (allowed) {
    return (
      <WebSocketWrapper>
        <Start store={store} token={token} />
      </WebSocketWrapper>
    );
  }

  return (
    <div>
      <h1>Connecting...</h1>
    </div>
  );
}
