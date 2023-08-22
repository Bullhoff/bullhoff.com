export class PizzaSparkle {
	constructor(pizza, enabled = true, parent = document.body,) {
		this.enabled = enabled;
		this.parent = parent;
		this.pizza = pizza;
		this.lastSparkleTime = 0;

		console.log('parent', parent)
		console.log('this.parent', this.parent)
		console.log('document.body', document.body)
		this.init();
	}
	init() {
		this.loadPizza();
		this.loadStyle();
		if (this.enabled) this.enable()
	}
	enable() {
		this.enabled = true
		this.parent.addEventListener('mousemove', this.sparkleFunction);
	}
	disable() {
		this.enabled = false
		this.parent.removeEventListener('mousemove', this.sparkleFunction);
	}
	sparkleFunction = (e) => {
		const currentTime = Date.now();
		if (currentTime - this.lastSparkleTime < 100) return;
		this.lastSparkleTime = currentTime;
		const x = e.clientX - this.parent.getBoundingClientRect().left;
		const y = e.clientY - this.parent.getBoundingClientRect().top;
		const sparkle = document.createElement('img');
		sparkle.className = 'sparkle';
		sparkle.src = this.pizza;
		sparkle.alt = 'Pizza';
		sparkle.style.zIndex = '1';
		sparkle.style.pointerEvents = 'none';
		sparkle.style.left = x + 'px';
		sparkle.style.top = y + 'px';
		sparkle.style.boxSizing = 'border-box';
		this.parent.appendChild(sparkle);
		setTimeout(() => this.parent.removeChild(sparkle), 1000);
	}
	async loadPizza() {
		if (!this.pizza)
			this.pizza = await fetch('public/pizza/icon512.png')	// './../assets/pizza/icon512.png'
				.then((response) => response.blob())
				.then((blob) => URL.createObjectURL(blob))
				.catch((error) => console.error('Error loading image:', error));
	}
	loadStyle() {
		let style = document.getElementById('pizza-sparkle');
		if (style) return;
		style = document.createElement('style');
		style.id = 'pizza-sparkle';
		style.textContent = `
		.sparkle {
			position: absolute;
			width: 30px;
			height: 30px;
			background-color: #ffd700;
			border-radius: 50%;
			opacity: 0.8;
			animation: sparkleAnimation 1s ease-in-out infinite;
		}
		@keyframes sparkleAnimation {
			0% {
			transform: scale(1);
			}
			50% {
			transform: scale(1.5);
			opacity: 0.5;
			}
			100% {
			transform: scale(1);
			}
		}`;
		document.head.appendChild(style);
	}
}
