const {ipcRenderer} = require('electron')
const {$} = require('./helper')
const path = require('path')
$('chooseMusic').addEventListener('click', () => {
		ipcRenderer.send('openMusicFile')
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

})
