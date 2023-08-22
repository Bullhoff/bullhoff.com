import chucknorris from './../assets/icons/Chuck Norris.ico';
import ContextMenu from './contextmenu.js'
export class ChuckNorris {
	constructor(parent = document.body, moveActive = false, alternativeChuckNorrisImage) {
		this.parent = parent;
		this.moveActive = moveActive;
		//this.state = {clicked: {x: 0, y: 0, id: '', value: ''}};
		this.movableobject = new MovableObject();

		this.btnChuck = alternativeChuckNorrisImage ? alternativeChuckNorrisImage : this.createButton();
		this.parent.appendChild(this.btnChuck);
		this.btnChuck.addEventListener('pointerdown', (e) => {
			this.moveActive = !this.moveActive;
			if (this.moveActive) e.target.style.backgroundColor = 'green';
			else e.target.style.backgroundColor = 'transparent';
			this.movableobject.toggleActivate(this.moveActive);
		});
		new ContextMenu(this.btnChuck, [{ text: 'Reset', func: () => this.movableobject.reset() }]);
	}
	createButton() {
		let btnChuck = document.createElement('img');
		btnChuck.src = chucknorris;
		btnChuck.alt = 'Chuck';
		btnChuck.title = 'Enables you to move elements with the middle mouse button';
		btnChuck.style.cssText += `cursor:pointer;height:100%;object-fit:contain;border-radius:0.5ch;`;
		return btnChuck;
	}
	init() { }
}

class MovableObject {
	constructor({ active = false, placeholderElement = true } = {}) {
		this.elements = {};
		this.holding = false;
		this.current = { x1: 0, x2: 0, y1: 0, y2: 0 };
		this.currentId = null;
		this.timelagArr = [];
		this.onKey = 2;
		this.placeholderElement = placeholderElement;

		if (active) this.activate();
	}
	updateCoords(e, id) {
		if (e.touches?.[0]) e = e.touches[0]
		let { clientX, clientY } = e;
		let nrtwo = () => {
			this.current.x2 = clientX;
			this.current.y2 = clientY;
		};
		this.current.x1 = this.current.x2 - clientX;
		this.current.y1 = this.current.y2 - clientY;
		nrtwo();
		let x = this.current.x1;
		let y = this.current.y1;
		return { x: x, y: y };
	}
	pointerdown = (e) => {
		if (e.pointerType != 'touch' && e.which != this.onKey) return;
		this.addObject(e);
		//windows[id].holding = false;
		let id = e.target.id;
		this.currentId = id;
		this.holding = true;
		this.updateCoords(e, id);
		console.log('mousedown', e, this.holding, id, e.target);
		if (e.pointerType == 'touch' || e.type == 'touchend' || e.type == 'touchcancel') {
			window.addEventListener('touchend', this.pointerup);
			window.addEventListener('touchcancel', this.pointerup);
			window.addEventListener('touchmove', this.pointermove);
		} else {
			window.addEventListener('pointerup', this.pointerup);
			window.addEventListener('pointermove', this.pointermove);
		}
	};
	pointerup = (e) => {
		let id = e.target.id;
		this.holding = false;
		this.currentId = null;
		console.log('mouseup', e, this.holding, id, e.target);
		if (e.pointerType == 'touch' || e.type == 'touchend' || e.type == 'touchcancel') {
			window.removeEventListener('touchend', this.pointerup);
			window.removeEventListener('touchcancel', this.pointerup);
			window.removeEventListener('touchmove', this.pointermove);
		} else {
			window.removeEventListener('pointerup', this.pointerup);
			window.removeEventListener('pointermove', this.pointermove);
		}
	};

	pointermove = (e) => {
		const msDelay = 10;
		const timelag = () => {
			this.timelagArr[1] = Date.now();
			if (this.timelagArr[0] && this.timelagArr[1] < this.timelagArr[0] + msDelay) return false;
			this.timelagArr[0] = Date.now();
			return true;
		};
		if (!timelag()) return;
		let id = e.target.id;
		if (!this.holding || !this.currentId) return;

		let el = this.elements[this.currentId].el;
		let { x, y } = this.updateCoords(e, id);

		let { left, top } = el.getBoundingClientRect();
		let currentStyle = el.currentStyle || window.getComputedStyle(el);
		left -= parseInt(currentStyle.marginLeft);
		top -= parseInt(currentStyle.marginTop);
		el.style.left = `${left - x}px`;
		el.style.top = `${top - y}px`;
	};
	reset(e) {
		for (const [key, value] of Object.entries(this.elements)) {
			let orgStyle = window.getComputedStyle(value.elTemp);
			value.elTemp.remove();
			this.elements[key].el.style.position = orgStyle.position;
			this.elements[key].el.style.left = orgStyle.left;
			this.elements[key].el.style.top = orgStyle.top;
			this.elements[key].el.removeEventListener('mousedown', this.mousedown);
			delete this.elements[key];
		}
	}
	activate() {
		window.addEventListener('pointerdown', this.pointerdown);
	}
	deactivate() {
		window.removeEventListener('pointerdown', this.pointerdown);
	}
	toggleActivate(activate) {
		if (activate) this.activate();
		else this.deactivate();
		//window.addEventListener('mousedown', this.mousedown);
	}
	addObject(e) {
		let el = e.target;
		if (!el || el == window) return;
		let id = el.id;
		if (!id) {
			id = crypto.randomUUID();
			el.id = id;
		}
		if (this.elements[id]) return;
		this.elements[id] = {};

		let rect = el.getBoundingClientRect();
		let newEl = el;

		let elTemp = el.cloneNode();
		elTemp.style.visibility = 'hidden';
		elTemp.id = id + '__temp';
		newEl.addEventListener('pointerdown', this.pointerdown);
		this.pointerdown(e);
		let { left, top } = el.getBoundingClientRect();
		let currentStyle = el.currentStyle || window.getComputedStyle(el);
		left -= parseInt(currentStyle.marginLeft);
		top -= parseInt(currentStyle.marginTop);
		newEl.style.left = left + 'px';
		newEl.style.top = top + 'px';
		newEl.style.position = 'fixed';
		newEl.style.width = rect.width + 'px';
		newEl.style.height = rect.height + 'px';

		if (this.placeholderElement) el.parentNode.insertBefore(elTemp, el);
		this.elements[id].elTemp = elTemp;
		this.elements[id].id = id;
		this.elements[id].el = el;
	}
}
