/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import Start from './Start';
import Container from './Container';
import api from '../components/axios';
import '../styles/styles.css';
import bcBotImg from '../../assets/bcbot.png';

const { ipcRenderer } = window.require('electron');

const Hello = () => {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState(
    'dd14fd60-6fcc-4e33-a86b-8ebec7bb0dca'
  );
  const [password, setPassword] = useState('aY2^5=');
  const [userId, setUserId] = useState();
  const [userToken, setUserToken] = useState('');
  const [connectedOnAnotherInstance, setConnectedOnAnotherInstance] =
    useState(false);

  async function logon() {
    try {
      const response = await api.post('/auth', {
        username: username.trim(),
        password: password.trim(),
      });

      const { active, userid, token } = response.data;
      if (typeof active !== 'undefined') {
        if (active === true) {
          setUserId(userid);
          setUserToken(token);
          setConnected(true);
        }
      } else {
        console.log('not active');
      }

      console.log(response);
    } catch (err) {
      console.log('invalid credentials', err);
    }
  }

  ipcRenderer.on('login', (_, arg: boolean) => {
    if (arg === false) {
      setConnected(false);
    } else if (arg === true) {
      setConnected(true);
    }
  });

  ipcRenderer.on('multiple-logins', (_, arg: boolean) => {
    if (arg) {
      setConnectedOnAnotherInstance(true);
    }
  });
  if (!connected) {
    return (
      <>
        <Container>
          <div className="home">
            <img className="img-bot" src={bcBotImg} alt="" />
            <div className="input-group">
              <div className="input">
                <label htmlFor="user-input">user</label>
                <input
                  id="user-input"
                  placeholder="your email"
                  value={username}
                  onChange={(evt) => setUsername(evt.target.value.trim())}
                />
              </div>
              <div className="input">
                <label htmlFor="password">password</label>
                <input
                  id="password"
                  placeholder="your password"
                  type="password"
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value.trim())}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  // setConnected(true);
                  logon();
                  // ipcRenderer.send('start-stop-bot', 'start');
                }}
              >
                Login
              </button>
            </div>
            {connectedOnAnotherInstance && (
              <p>
                you got disconnected due to concurrent logins. If you prefer to
                use this window, log in here again.
              </p>
            )}
          </div>
        </Container>
      </>
    );
  } else {
    if (typeof userId !== 'undefined' && typeof userToken !== 'undefined') {
      return <Start id={userId} token={userToken} />;
    } else {
      return null;
    }
  }
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} exact />
      </Switch>
    </Router>
  );
}
