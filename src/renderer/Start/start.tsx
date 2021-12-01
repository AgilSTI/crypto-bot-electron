/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import Container from '../Container';
import factoryConfig from '../../factory/config.json'


import botImg from '../../../assets/bot.svg';


const fs = window.require('fs-extra');
const { ipcRenderer } = window.require('electron');

// const {shell} = window.require('electron');



type ConfigProps = {
  start_delay: number;
  heroes_page_first_action_delay: number;
  treasure_hunt_first_action_delay: number;
  after_sent_to_work_delay: number;
  after_close_heroes_page_delay: number;
  check_for_heroes_able_to_work_delay: number;
  after_click_metamask_sign_blue_btn_delay: number;
  after_click_metamask_connect_delay: number;
  after_click_connect_orange_btn_delay: number;
  wait_for_page_refresh_delay: number;
};

export default function Start() {

  const packageObj: ConfigProps = fs.readJsonSync('./config.json');
  const [config, setConfig] = useState(packageObj);
  const [actualPage, setActualPage] = useState("settings")
  const [isRunning, setIsRunning] = useState(false);
  const [pid, setPid] = useState("");
  const [actualAction, setActualAction] = useState("");
  useEffect(() => {
    console.log(pid);
  }, [pid])


 async function saveConfig()  {
   try {
    await fs.writeFile("config.json", JSON.stringify(config));
   } catch(err) {
    console.log(err);
   }
  }

  function restoreFactory() {
    setConfig(factoryConfig);
  }

  function parseNumber(value: string, original: number): number {
      if (!Number.isNaN(Number(value))) {
        return Number(value)
      } 
        return original
  }

  useEffect(() => {
    const newConfig: ConfigProps = fs.readJsonSync('./config.json');
    setConfig(newConfig);
  }, []);

  ipcRenderer.on('bot-messages', (_, arg) => {
    console.log(arg.message);
    setActualAction(arg);
  })

  return (
    <>
    <div id="toast" className="notification-off">
      <p> Hello</p>
    </div>
    
    <Container>
      <div className="start-container">
        <div className="start-header-options">
          <div className="start-header-option-wrapper">
            <button id="play-btn" type="button" onClick={() => {
              setActualPage("start");
              const settingsElement = window.document.getElementById("settings-btn");
              const playElement = window.document.getElementById("play-btn");
              playElement?.classList.add("btn-active")
              settingsElement?.classList.remove("btn-active");
              }}>Start</button>
          </div>
          <div className="start-header-option-wrapper">
          <button id="settings-btn" type="button" onClick={() => {
            setActualPage("settings")
            const settingsElement = window.document.getElementById("settings-btn");
            const playElement = window.document.getElementById("play-btn");
            playElement?.classList.remove("btn-active")
            settingsElement?.classList.add("btn-active");
             }}>
              Settings
            </button>
          </div>
        </div>

        {actualPage === "settings" ? (
      <>
        <div className="config-options-wrapper">
        <div className="config-item-wrapper">

          <div className="config-slider-wrapper">
          <p className="config-item-title">BOT START COUNTDOWN (secs)</p>
            <input 
            value={config.start_delay} 
            onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, start_delay: parseNumber(value, config.start_delay) })
            }}
            />
          </div>
         
          <div className="config-slider-wrapper">
          <p className="config-item-title">
            AFTER CLICK CONNECT BUTTON DELAY(secs)
          </p>
            <input 
            value={config.after_click_connect_orange_btn_delay} 
            onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, after_click_connect_orange_btn_delay: parseNumber(value, config.after_click_connect_orange_btn_delay) })
            }}
            />
          </div>
          <div className="config-slider-wrapper">
          <p className="config-item-title">
            wait for metamask extension load(secs)
          </p>
            <input 
            value={config.after_click_metamask_connect_delay} 
            onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, after_click_metamask_connect_delay: parseNumber(value, config.after_click_metamask_connect_delay) })
            }}
            />
          </div>
          <div className="config-slider-wrapper">
          <p className="config-item-title">
            wait for game load after login(secs)
          </p>
            <input value={config.after_click_metamask_sign_blue_btn_delay} 
             onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, after_click_metamask_sign_blue_btn_delay: parseNumber(value, config.after_click_metamask_sign_blue_btn_delay) })
            }}
            />
          </div>
          <div className="config-slider-wrapper">
          <p className="config-item-title"> 
            wait for first action in heroes page(secs)
          </p>
            <input 
            value={config.heroes_page_first_action_delay} 
            onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, heroes_page_first_action_delay: parseNumber(value, config.heroes_page_first_action_delay) })
            }}
            />
          </div>
          <div className="config-slider-wrapper">
          <p className="config-item-title">
            wait after sent hero to work(secs)
          </p>
            <input
             value={config.after_sent_to_work_delay} 
             onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, after_sent_to_work_delay: parseNumber(value, config.after_sent_to_work_delay) })
            }}
             />
          </div>
          <div className="config-slider-wrapper">
          <p className="config-item-title">
            after close heroes page delay(secs)
          </p>
            <input 
            value={config.after_close_heroes_page_delay} 
            onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, after_close_heroes_page_delay: parseNumber(value, config.after_close_heroes_page_delay) })
            }}
            />
          </div>
          <div className="config-slider-wrapper">
          <p className="config-item-title">
            after open treasure hunt page delay(secs)
          </p>
            <input 
            value={config.treasure_hunt_first_action_delay} 
            onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, treasure_hunt_first_action_delay: parseNumber(value, config.treasure_hunt_first_action_delay) })
            }}
            />
          </div>
          <div className="config-slider-wrapper">
          <p className="config-item-title">check for fresh heroes(secs)</p>
            <input 
            value={config.check_for_heroes_able_to_work_delay} 
            onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, check_for_heroes_able_to_work_delay: parseNumber(value, config.check_for_heroes_able_to_work_delay) })
            }}
            />
          </div>
          <div className="config-slider-wrapper">
          <p className="config-item-title">
            in case of error wait for page reload(secs)
          </p>
            <input 
            value={config.wait_for_page_refresh_delay} 
            onChange={(event) => {
              const { value } = event.target;
              setConfig({...config, wait_for_page_refresh_delay: parseNumber(value, config.wait_for_page_refresh_delay) })
            }}
            />
          </div>
        </div>
      </div>
      <div className="config-footer-btn-wrapper"> 
         <button className="restore-btn" type="button" onClick={() => restoreFactory()}>Reset</button>
         <button className="save-btn" type="button" onClick={() => {
           const d = document.getElementById("toast")
           d?.classList.remove("notification-off");
           d?.classList.add("notification");
           saveConfig();
           setTimeout(() => {
            d?.classList.remove("notification");
            d?.classList.add("notification-off");
            
           }, 2000)
         }}>Save</button>
      </div>
      </>
        ) : (


          <div className="play-container">
            <div className="play-content">
              <div className="play-img-wrapper">
               <img src={botImg} alt="" />
              </div>
              <div className="play-content-box">
                <p>{actualAction}</p>
              </div>
            </div>
            <div className="play-footer">
              {
                isRunning ? (
                  <button 
                  type="button"
                  onClick={async () => {
                    ipcRenderer.send("stop-bot", pid);
                    setIsRunning(false);
                   
                  }}
                  >Stop</button>
                ) : (
                  <button 
                  type="button"
                  onClick={() => {
                    ipcRenderer.on("start-bot", (_, args) => {
                      setPid(args.pid);
                    });
                    ipcRenderer.send("start-bot", "");
                    setIsRunning(true);
                  }}
                  >Play</button>
                )
              }

            </div>
          </div>
        )}
      </div>
    </Container>
    </>
  );
};