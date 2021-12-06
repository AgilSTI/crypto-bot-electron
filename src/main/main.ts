/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs-extra';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const { spawn, exec } = require('child_process');
const Store = require('electron-store');

Store.initRenderer();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('multiple-logins', (event: any, arg: boolean) => {
  if (arg === true) {
    event.reply('multiple-logins', arg);
  }
});

ipcMain.on('login', (event: any, arg: any) => {
  if (arg === 'connect') {
    event.reply('login', true);
  }

  if (arg === 'disconnect') {
    event.reply('login', false);
  }
});

ipcMain.on('start-bot', async (event: any, arg: string) => {
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

  const config: ConfigProps = fs.readJsonSync('./config.json');
  const args: Array<string> = [
    config.start_delay.toString(),
    config.heroes_page_first_action_delay.toString(),
    config.treasure_hunt_first_action_delay.toString(),
    config.after_sent_to_work_delay.toString(),
    config.after_close_heroes_page_delay.toString(),
    config.check_for_heroes_able_to_work_delay.toString(),
    config.after_click_metamask_sign_blue_btn_delay.toString(),
    config.after_click_metamask_connect_delay.toString(),
    config.after_click_connect_orange_btn_delay.toString(),
    config.wait_for_page_refresh_delay.toString(),
    arg,
  ];
  try {
    const thread = spawn(
      'C:\\Users\\duduc\\Desktop\\crypto-bot\\target\\release\\template.exe',
      args
    );
    event.reply('start-bot', { pid: thread.pid });
    thread.stdout.on('data', function (data: any) {
      setTimeout(() => {
        if (typeof data !== 'undefined') {
          console.log(data.toString());
          event.reply('bot-messages', data.toString());
          console.log(data.toString());
        }
      }, 2000);
    });
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on('stop-bot', (event: any, arg: any) => {
  try {
    exec(`taskkill /pid ${arg} /f`, (err: any, stdout: any, stderr: any) => {
      if (err) {
        throw err;
      }

      event.reply('bot-messages', 'bot stopped, click play to start');
      console.log('stdout', stdout);
      console.log('stderr', stderr);
    });
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on('bot-messages', (event, arg) => {
  event.reply({ message: arg });
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 1024,
    frame: true,
    transparent: true,
    autoHideMenuBar: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: true,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
