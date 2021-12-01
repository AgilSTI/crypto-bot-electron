/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import Start from './Start';
import Container from './Container';
import '../styles/styles.css';
import bcBotImg from '../../assets/bcbot.png';

const { ipcRenderer } = window.require('electron');

const Hello = () => {
  const [connected, setConnected] = useState(false);
  ipcRenderer.on('login', (_, arg: boolean) => {
    if (arg === false) {
      setConnected(false);
    } else if (arg === true) {
      setConnected(true);
    }
  });
  if (!connected) {
    return (
      <Container>
        <div className="home">
          <img className="img-bot" src={bcBotImg} alt="" />
          <div className="input-group">
            <div className="input">
              <label htmlFor="user-input">user</label>
              <input id="user-input" placeholder="your email" />
            </div>
            <div className="input">
              <label htmlFor="password">password</label>
              <input
                id="password"
                placeholder="your password"
                type="password"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setConnected(true);
                // ipcRenderer.send('start-stop-bot', 'start');
              }}
            >
              Login
            </button>
          </div>
        </div>
      </Container>
    );
  }
  return <Start />;
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
