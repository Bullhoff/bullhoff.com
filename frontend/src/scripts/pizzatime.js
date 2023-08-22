


import pizza from '@assets/pizza/icon512.png'


let defaultScale = { h: 0.95, m: 0.85, s: 0.85, ms: 0.5 }
let defaultVisibility = { h: true, m: true, s: true, ms: true }

export class PizzaTime {
	constructor({ image, parent = document.body, updateFrequency = 70, scale = {}, visibility = {}, onChange = () => { } } = {}) {

		this.parent = parent
		this.image = image
		this.container = document.createElement('div');
		this.h
		this.m
		this.s
		this.ms
		this.interval

		this.onChange = onChange
		this.updateFrequency = updateFrequency
		this.scale = Object.assign(structuredClone(defaultScale), scale) //{h:hScale, m: mScale, s:sScale, ms:msScale}
		this.visibility = Object.assign(structuredClone(defaultVisibility), visibility) //{h:true, m: true, s:true, ms:true}

		this.startClock()
	}
	requestFullscreen() {
		this.container.requestFullscreen()
		this.container.addEventListener('click', () => {
			document.exitFullscreen()
		})
	}
	getSaveData() {
		return { updateFrequency: this.updateFrequency, scale: this.scale, visibility: this.visibility }
	}
	changeVisibility(el, val) {
		this.visibility[el] = val
		if (val) this[el].style.visibility = 'visible'
		else this[el].style.visibility = 'hidden'
		this.onChange(this.getSaveData())
	}
	changeSize(el, val) {
		this.scale[el] = val
		this.setSize()
		this.onChange(this.getSaveData())
	}
	changeFrequency(val = this.updateFrequency) {
		this.updateFrequency = val
		this.interval = clearInterval(this.interval)
		this.interval = setInterval(() => this.updateTime(), this.updateFrequency)
		this.onChange(this.getSaveData())
	}
	resetValue(el, whichval) {
		if (whichval == 'scale') {
			this.changeSize(el, defaultScale[el])
		} else if (whichval == 'frequency') {
			this.changeFrequency(70)
		}
	}
	resizeObserver = new ResizeObserver((entries) => this.setSize())
	setSize() {
		let rect = this.parent.getBoundingClientRect()
		let containerSize = rect.height
		const changeSize = (el, prevSize = containerSize) => {
			let size = this.scale[el] * prevSize //this[el+'Scale'] * prevSize
			if (this[el]) this[el].style.width = size + 'px'
			else this[el] = img(this.container, pizza, { width: `${size}px`, left: `50%`, top: `50%`, transform: 'translateX(-50%) translateY(-50%)', position: 'absolute', zIndex: 1 });
			return size
		}
		let prevSize = changeSize('h', containerSize)
		prevSize = changeSize('m', prevSize)
		prevSize = changeSize('s', prevSize)
		prevSize = changeSize('ms', prevSize)
	}
	async startClock() {
		if (!this.image) this.image = await fetch(pizza)	// './../assets/icon512.png'
			.then((response) => response.blob())
			.then((blob) => URL.createObjectURL(blob))
			.catch((error) => console.error('Error loading image:', error));

		this.container.style.cssText += `display:inline-block; position:relative; left:50%; transform: translateX(-50%); height:100%; align-self:stretch; justify-self:center;`

		await this.setSize()
		for (const key in this.visibility) {
			this.changeVisibility(key, this.visibility[key])
		}


		this.parent.appendChild(this.container);
		this.resizeObserver.observe(this.container);
		this.interval = setInterval(() => this.updateTime(), this.updateFrequency);
	}
	async updateTime() {
		let date = new Date();
		let s = date.getSeconds();
		let m = date.getMinutes();
		let h = date.getHours();
		let ms = date.getMilliseconds();
		this.ms.children[0].style.rotate = `${ms * 6}deg`;
		this.s.children[0].style.rotate = `${s * 6}deg`;
		this.m.children[0].style.rotate = `${m * 6}deg`;
		this.h.children[0].style.rotate = `${h * 6}deg`;
	}

}

function img(parent, src, style = {}) {
	const el = document.createElement('div');
	//el.style.cssText += `border:1px solid red;`
	Object.assign(el.style, style);

	const img = document.createElement('img');
	img.style.cssText += 'object-fit:contain; width:100%; height:100%;'
	img.alt = '';
	img.src = src;
	el.appendChild(img);
	if (parent) parent.appendChild(el);
	return el;
}
