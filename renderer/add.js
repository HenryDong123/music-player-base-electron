const {ipcRenderer} = require('electron')
const {$} = require('./helper')
$('chooseMusic').addEventListener('click', ()=>{
	ipcRenderer.send('openMusicFile')
})
