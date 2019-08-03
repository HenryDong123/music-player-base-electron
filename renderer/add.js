const {ipcRenderer} = require('electron')
const {$} = require('./helper')
const Store = require('electron-store')
const store = new Store()
const path = require('path')
let musicFiles = []
$('chooseMusic').addEventListener('click', () => {
		ipcRenderer.send('openMusicFile')
})
$('exportMusic').addEventListener('click',()=>{
	ipcRenderer.send('export-music', musicFiles)
})
const rendererListHTML = (pathes) => {
		const musicList = $('musicList')
		const musicItemHTML = pathes.reduce((html, music) => {
				html += `<li class="list-group-item">${path.basename(music)}</li>`
				return html
		}, '')
		musicList.innerHTML = `<ul class="mt-4 list-group">${musicItemHTML}</ul>`
}
ipcRenderer.on('upFile', (e, path) => {
		Array.isArray(path) && (rendererListHTML(path))
		musicFiles = path
})
