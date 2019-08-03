const {ipcRenderer} = require('electron')
const {$,  formateDuration} = require('./helper')
let musicAudio = new Audio()
let allTracks
let currentTracks
$('addMusicBtn').addEventListener('click', () => {
		ipcRenderer.send('addMusic')
})
const rendererListHTML = (tracks) => {
		const trackList = $('tracksList')
		console.log(tracks)
		const tracksListHTML = tracks.reduce((html, track) => {
				html += `<li  class="row music-track list-group-item d-flex justify-content-between align-items-center">
										<div class="col-10">
										<i class="fas fa-music mr-2 text-secondary"></i>
										<b>${track.fileName}</b>
										</div>
										<div class="col-2">
										<i class="fas fa-play mr-3" data-id="${track.id}"></i>
										<i class="fas fa-trash-alt" data-id="${track.id}"></i>
										</div>
									</li>`
									return html
		}, '')
		const emptyTrrackHTML = `<div class="alert alert-primary">暂无音乐</div>`
		trackList.innerHTML = tracks.length?`<ul class="list-group">${tracksListHTML}</ul>`:emptyTrrackHTML
}
const rederPlayerHTML = (name, duration) =>{
	const player = $('player-status')
	const html = `<div class="col font-weight-bold">
									正在播放${name}
								</div>
								<div class="col">
									<span id="currentSeeker">00:00</span> / ${formateDuration(duration)}
								</div>
								`
		player.innerHTML = html
}
const updateProgressHTML = (currentTime, duration) => {
//计算进度条
	const progress = Math.floor(currentTime/ duration * 100)
	const bar = $('playerProgress')
		bar.innerText = progress + '%'
		bar.style.width = progress + '%'
	const seeker = $('currentSeeker')
		seeker.innerHTML = formateDuration(currentTime)
}
ipcRenderer.on('getTracks', (e, tracks) => {
		console.log(tracks, 'tracks')
		allTracks = tracks
		rendererListHTML(tracks)
})
musicAudio.addEventListener('loadedmetadata', ()=>{
	//开始渲染播放器状态
		rederPlayerHTML(currentTracks.fileName, musicAudio.duration)
})
musicAudio.addEventListener('timeupdate', ()=>{
	//更新播放器
		updateProgressHTML(musicAudio.currentTime, musicAudio.duration)
})
$('tracksList').addEventListener('click', (e)=>{
	e.preventDefault()
	const {dataset, classList} = e.target
	const id = dataset && dataset.id
	if (id && classList.contains('fa-play')){
		//播放音乐
			if(currentTracks && currentTracks.id === id){
				//继续播放
				musicAudio.play()
			}else {
				// 播放新歌曲，还原图标
					currentTracks = allTracks.find(track => track.id === id)
					musicAudio.src = currentTracks.path
					musicAudio.play()
					const resetIconEL = document.querySelector('.fa-pause')
					resetIconEL && (resetIconEL.classList.replace('fa-pause', 'fa-play'))
			}
			classList.replace('fa-play', 'fa-pause')
	}else if (id && classList.contains('fa-pause')){
		//暂停
		musicAudio.pause()
		classList.replace('fa-pause', 'fa-play')

	}else if (id && classList.contains('fa-trash-alt')){
		// 删除
		ipcRenderer.send('deleteTrack', id)
	}
})
