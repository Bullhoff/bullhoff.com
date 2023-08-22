export default class {
	constructor(obj = {}, defaultObj = null, config = {}) {
		this.defaultObj = structuredClone((defaultObj) ? defaultObj : obj)
		this.obj = obj

		this.config = Object.assign({ deleteDefault: true, log: true, logColor: '#' + (Math.floor(Math.random() * 16777214) + 1).toString(16).padStart(6, '0'), }, config)
		this.state = { logCount: 0 }
	}
	log() {
		if (!this.config.log) return
		this.state.logCount++;
		console.log(`%cURL - ${this.state.logCount}`, `color:${this.config.logColor}`, ...arguments);
	}
	parse = (str) => { try { return JSON.parse(str); } catch (err) { return str; } }
	getParams(obj = null) {
		const url = new URL(location);
		for (var [key, value] of url.searchParams.entries()) {
			console.log(`getParams`, key, value);
			if (value != null) value = decodeURIComponent(value)
			if (value != null) value = this.parse(value)
			if (value != null) this.obj[key] = value
		}
		if (obj != null) Object.assign(obj, this.obj)
		return this.obj
	}
	setParam(key, value = null) {
		const url = new URL(location);
		if (value != null) {
			this.obj[key] = value
		}
		if (key == null) {
			url.searchParams.set("", encodeURIComponent(JSON.stringify(this.obj)));
			return
		}
		if (this.defaultObj[key] == this.obj[key] && this.config.deleteDefault) url.searchParams.delete(key)
		else url.searchParams.set(key, encodeURIComponent(this.obj[key]));
		history.replaceState({}, "", url);	// replaceState, pushState
	}

}