const {app, BrowserWindow, ipcMain, dialog} = require('electron')
app.on('ready', () => {
		const mainWindow = new appWindow({},'./renderer/index.html' )
		ipcMain.on('addMusic', () => {
				const addWindow = new appWindow({
						width: 500,
						height: 500,
						parent: mainWindow
				},'./renderer/add.html')
		})
		ipcMain.on('openMusicFile', (e)=>{
				dialog.showOpenDialog({
					properties: ['openFile', 'multiSelections'],
					filters:[{name: 'music', extensions: ['mp3'],}]
				},(files) => {
						files && (e.sender.send('upFile', files))
				})
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
						}
				}
				const finalConfig = {...basicConfig, ...config}
				super(finalConfig)
				this.loadFile(fileLocation)
				this.once('ready-to-show', ()=>{
					this.show()
				})

		}
}
