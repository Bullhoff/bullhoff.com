//export class MovableElement
export default class {
	constructor({ el, head, body, active = true, } = {}) {
		this.lastMove = 0;
		this.x = 0
		this.y = 0
		this.active = active

		this.el = (el) ? el : (head) ? head : body;
		this.head = (head) ? head : this.el
		this.body = (body) ? body : this.el
		this.head.addEventListener('pointerdown', this.pointerdown);
	}
	delay() {
		const currentTime = Date.now();
		if (currentTime - this.lastMove < 10) return false;
		this.lastMove = currentTime;
		return true;
	}
	coords(e, shortestDistance = 10, { x, y } = {}) {
		if (e.touches?.[0]) e = e.touches[0]
		if (this.body) {
			x = this.body.offsetLeft - (this.x - e.clientX) + 'px';
			y = this.body.offsetTop - (this.y - e.clientY) + 'px';
		}
		this.x = e.clientX;
		this.y = e.clientY;
		return { x, y, ok: shortestDistance };
	}
	pointerdown = (e) => {
		if (!this.active) return
		this.coords(e)
		//log('pointerdown', e.type, e.touches, e.clientX, e.clientY, e);
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
		//log('pointermove', e)
		if (!this.delay()) return;
		let { x, y } = this.coords(e);
		this.body.style.left = x;
		this.body.style.top = y;
	};
	pointerenter = (e) => { };
	pointerleave = (e) => { };


	add(e, key, obj = {}) {
		if (e[key]) obj[key] = e[key];
		return obj;
	}
}