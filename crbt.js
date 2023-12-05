const {ipcRenderer} = require('electron')

const crbtBtn = document.getElementById("crbtBtn")
crbtBtn.onclick = () => {
    ipcRenderer.send('crbt:getTime')
}

const crbt = document.getElementById("crbt")
ipcRenderer.on('crbt', (e, time) =>
    crbt.innerText = time
);