const {ipcRenderer} = require('electron')

window.addEventListener('DOMContentLoaded',()=>{
	ipcRenderer.send('msg', '皮卡丘')
	ipcRenderer.on('reply', (e, args)=> {
			document.getElementById('msg').innerHTML = args
	})
})
