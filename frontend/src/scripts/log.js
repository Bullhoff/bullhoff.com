
(function (context) {
	var Console = {
		settings: {
			logTo: null,
		},
		groups: {
			'nextcloud.js': { ignore: false },
		},
	};
	import('@stores/store.js').then((res) => {
		console.log('import @stores/store.js', res)
		if (res?.useStore()?.logObject) Console.settings.logTo = res.useStore().logObject
	}).catch((err) => {
		console.error('import @stores/store.js', err)
	})
	var last = null

	///// To ensure that console.log() and console.error() doesnt get nested
	const originalError = window.console.error;
	console.error = function () {
		if (last) {
			last = null
			endGroups()
		}
		originalError.apply(console, arguments);
	}

	const originalLog = window.console.log;
	console.log = function () {
		if (last) {
			last = null
			endGroups()
		}
		//originalLog(...arguments)
		originalLog.apply(console, arguments);
	}
	Console.disableNormalConsole = () => {
		last = null
		endGroups()
		window.console.log = () => { }
	}

	function endGroups() {
		console.groupEnd()
		console.groupEnd()
		console.groupEnd()
		console.groupEnd()
		console.groupEnd()
		console.groupEnd()
	}

	///// Console.log() start
	Console.log = () => { console.log(...arguments) }
	Console.enable = function () {
		Console.log = log
	}
	Console.disable = function () {
		Console.log = () => { }
		endGroups()
	}



	function debuglog() {
		//console.info('debuglog', ...arguments)
	}
	function addGroup(obj, name) {
		if (!obj[name]) obj[name] = {}
		if (!obj[name].idColor) obj[name].idColor = '#' + (Math.floor(Math.random() * 16777214) + 1).toString(16).padStart(6, '0')
		if (!obj[name].functions) obj[name].functions = {}
		if (obj[name].count == undefined) obj[name].count = 0
	}
	function log() {
		debuglog('Console.log0', last, arguments)
		let stackOneRow = ``

		let params = Array.prototype.slice.call(arguments);
		let { file, func } = params[0]
		if (file || func) params.shift()
		let grp = file
		if (!grp) grp = func
		if (!grp) grp = '*'
		let sub = func
		if (!sub && params[0]) sub = params[0]
		if (!sub) sub = '*'
		debuglog('Console.log1', grp, sub, params)
		if (Console.groups[file] && Console.groups[file].ignore) return

		addGroup(Console.groups, grp)
		Console.groups[grp].count++
		addGroup(Console.groups[grp].functions, sub)
		Console.groups[grp].functions[sub].count++;

		let tooLong = params.reduce((a, c) => {
			if (a) return true
			if (typeof c == 'object' && Object.keys(c).length > 5) return true
			if (typeof c == 'string' && c.length > 20) return true
			return false
		}, false)
		if (grp != last) {
			console.groupEnd()
			console.groupCollapsed("%c" + grp + ' - ' + sub, `color: ${Console.groups[grp].idColor}; background-color:black; font-style: italic;`, ((tooLong) ? ' ... ' : [...params]))
		}
		debuglog('Console.log2', grp, sub, params)
		last = grp

		let e = new Error();
		let arr = []
		let stack = e.stack.split('\n')
		let longest = 0
		for (let i = 0; i < stack.length; i++) {
			if (stack[i]?.length == 0) continue
			let splitted = stack[i].split('@')
			let func = splitted.shift()
			let path = splitted.join('')

			if (func.length > longest) longest = func.length
			stackOneRow += `${func} ${path}`
			arr.push([func, path])
		}
		var stackList = arr.reduce((a, [func, path]) => a += `${func.padEnd(longest, ' ')} ${path}\n`, ``)
		let msg = [
			"%c" + Console.groups[grp].count + "-" + "%c" + Console.groups[grp].functions[sub].count + "-" + sub,
			`color: ${Console.groups[grp].idColor};`, `color: ${Console.groups[grp].functions[sub].idColor};`
		]
		console.groupCollapsed(...msg, ...params)
		console.trace()
		//console.info(stackList);
		debuglog('Console.log3', grp, sub, params)
		console.groupEnd()
		debuglog('Console.log4', grp, sub, params)

		if (Console.settings?.logTo && typeof Console.settings.logTo == 'object') {
			if (!Console.settings.logTo[grp]) Console.settings.logTo[grp] = []
			Console.settings.logTo[grp].push(...params)
		}
	}

	context.Console = Console;
})(window);
