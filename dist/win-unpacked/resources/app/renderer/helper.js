exports.$ = (id) => {
	return document.getElementById(id)
}
exports.formateDuration = (time) =>{
	//分钟
	const min ="0" + Math.floor(time/60)
	const sec ="0" + (time-min*60)
	return min.substring(min.length - 2) + ":" +sec.substring(sec.length - 2)
}
