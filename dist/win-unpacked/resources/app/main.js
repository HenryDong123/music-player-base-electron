const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const DataStore = require('./musicStore')
const myStore = new DataStore({
		'name': 'MusicData'
})
console.log(app.getPath('userData'))
app.on('ready', () => {
		const mainWindow = new appWindow({}, './renderer/index.html')
		mainWindow.webContents.on('did-finish-load', ()=>{
			console.log('finish')
			mainWindow.send('getTracks', myStore.getTracks())
		})
		ipcMain.on('addMusic', () => {
				const addWindow = new appWindow({
						width: 500,
						height: 500,
						parent: mainWindow
				}, './renderer/add.html')
		})
		ipcMain.on('openMusicFile', (e) => {
				dialog.showOpenDialog({
						properties: ['openFile', 'multiSelections'],
						filters: [{name: 'music', extensions: ['mp3','flac'],}]
				}, (files) => {
						files && (e.sender.send('upFile', files))
				})
		})
		ipcMain.on('export-music', (e, files) => {
				const updateTracks = myStore.addTracks(files).getTracks()
				mainWindow.send('getTracks', updateTracks)
		})
		ipcMain.on('deleteTrack', (e, id)=>{
				const updateTracks = myStore.deleteTrack(id).getTracks()
				mainWindow.send('getTracks', updateTracks)
		})
})

class appWindow extends BrowserWindow {
		constructor(config, fileLocation) {
				const basicConfig = {
						width: 800,
						height: 600,
						backgroundColor: '#fff',
						webPreferences: {
								nodeIntegration: true
						},
						show: false
				}
				const finalConfig = {...basicConfig, ...config}
				super(finalConfig)
				this.loadFile(fileLocation)
				this.once('ready-to-show', () => {
						this.show()
				})

		}
}
