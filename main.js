const { app, BrowserWindow, dialog, Menu } = require("electron/main");
const path = require("node:path");
const fs = require("node:fs");
const prompt = require("electron-prompt");

const ipServer = JSON.parse(
  fs.readFileSync(path.join(__dirname, "db.json"), "utf8")
);

const template = [
  {
    label: "View",
    submenu: [
      {
        label: "back",
        accelerator: "CmdOrCtrl+Left",
        click: async () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.goBack();
        },
      },
      {
        role: "reload",
      },
      {
        type: "separator",
      },
      {
        role: "resetzoom",
      },
      {
        role: "zoomin",
      },
      {
        role: "zoomout",
      },
      {
        type: "separator",
      },
      {
        role: "togglefullscreen",
      },
    ],
  },
  {
    label: "Setting",
    submenu: [
      {
        label: "IP Server",
        click: async () => {
          prompt({
            title: "IP Server",
            label: "IP Server:",
            value: ipServer.ip,
            inputAttrs: {
              type: "text",
            },
            type: "input",
          })
            .then((r) => {
              if (r === null) {
              } else {
                fs.writeFileSync(
                  path.join(__dirname, "db.json"),
                  JSON.stringify({ ip: r })
                );
                app.relaunch();
                app.exit();
              }
            })
            .catch(console.error);
        },
      },
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Exit",
        click: async () => {
          app.quit();
        },
      },
    ],
  },
];

function createWindow() {
  const win = new BrowserWindow({
    width: 1620,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL(`http://${ipServer.ip}/e-reciept/public/`);

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  if (ipServer.ip) {
    createWindow();
  } else {
    prompt({
      title: "IP Server",
      label: "IP Server:",
      value: "",
      inputAttrs: {
        type: "text",
        required: true,
      },
      type: "input",
    })
      .then((r) => {
        if (r === null) {
          dialog.showErrorBox("Error", "IP Server is required");
        } else {
          fs.writeFileSync(
            path.join(__dirname, "db.json"),
            JSON.stringify({ ip: r })
          );
          createWindow();
        }
      })
      .catch(console.error);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
