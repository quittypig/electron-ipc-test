const {ipcRenderer} = require('electron')

const getUsers = document.getElementById("getUsers")
getUsers.onclick = () => {
    ipcRenderer.send('getUsers')
}

const addUser = document.getElementById("addUser")
addUser.onclick = () => {
    const user = {
        id: document.getElementById("userId").value,
        name: document.getElementById("userName").value
    }

    ipcRenderer.send('addUser', user)
}

const save = document.getElementById("save")
save.onclick = () => {
    ipcRenderer.send('save')
}

const sync = document.getElementById("sync")
sync.onclick = () => {
    ipcRenderer.send('sync')
}

const usersElement = document.getElementById("users")

ipcRenderer.on('users', (e, users) =>
    usersElement.innerText = JSON.stringify(users)
);

