export class Stopwatch {
	constructor({ id, order, title = '', startTime = 0, endTime = 0, running = true, ms = 0, runningPeriods = [], setAsWindowTitle = false, hide = false, saveToUrl = false, saveToLocalStorage = false, createdAt = new Date().getTime() } = {}) {
		this.id = id
		this.order = order
		this.title = title;
		this.startTime = startTime;
		if (startTime == 0 && running) this.startTime = new Date().getTime()
		this.running = running;
		this.ms = ms;
		this.createdAt = createdAt
		this.hide = hide
		this.setAsWindowTitle = setAsWindowTitle;
		this.fullTime = null
	}
	getSaveData() {
		return {

		}
	}
	toggle() {
		if (!this.running) this.start()
		else if (this.running) this.stop()
	}
	start(startTime = null) {
		if (this.running) {
			return;
		}
		if (startTime) this.startTime = startTime
		else if (this.startTime != 0) { }
		else this.startTime = new Date().getTime();
		this.running = true;
	}

	stop() {
		if (!this.running) {
			return;
		}
		this.running = false;
		let time = new Date().getTime()
		if (this.runningPeriods) this.runningPeriods.push([this.startTime, time])

		this.ms += time - this.startTime;
		this.startTime = 0;
	}

	reset() {
		this.ms = 0;
		this.startTime = 0;
		//this.endTime = 0;
		this.running = false;
		//console.log('Stopwatch reset.');
	}
	getElapsedTimeFormatted(outputformat = 'string') {
		let ms = 0;
		if (this.running) ms = new Date().getTime() - this.startTime + this.ms;
		else ms = this.ms //this.endTime - this.startTime;

		const totalSeconds = Math.floor(ms / 1000);
		const days = Math.floor(totalSeconds / 86400).toString();
		const hours = Math.floor((totalSeconds % 86400) / 3600).toString().padStart(2, '0');
		const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
		const seconds = Math.floor((totalSeconds % 60)).toString().padStart(2, '0');
		const milliseconds = (ms % 1000).toString().padStart(3, '0');;
		var output

		let timeStr = ``
		if ((hours > 0)) timeStr += `${hours}:`
		if ((minutes > 0 || timeStr != ``)) timeStr += `${minutes}:`
		if ((seconds >= 0 || timeStr != ``)) timeStr += `${seconds}`
		//if(columns.ms.show && (obj.ms > 0 || timeStr != ``)) timeStr += ` ${obj.ms}`

		if (days > 0) timeStr = `${days}\u1D48\u2002${timeStr}` 	// u2002	u2003
		this.fullTime = timeStr

		if (outputformat == 'string') {
			let str = `${hours}:${minutes}:${seconds}`;
			if (days != '0') str = `${days} ` + str;
			output = str
		}
		if (outputformat == 'obj' || outputformat == 'object') {
			output = { days, hours, minutes, seconds, ms: milliseconds }
		}
		return output;
	}
	getElapsedTime() {
		if (this.running) {
			return new Date().getTime() - this.startTime + + this.ms;
		} else {
			return this.ms//this.endTime - this.startTime;
		}
	}
}

