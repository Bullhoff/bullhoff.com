import pizzapng from './../assets/pizza/icon512.png';

class CustomElement extends HTMLElement {
	constructor() {
		super();
	}
	toggle(img) {
		if (this.pizzaActive) {
			img.style.backgroundColor = 'green';
			window.addEventListener('click', this.clickListener)
		} else {
			img.style.backgroundColor = 'transparent';
			window.removeEventListener('click', this.clickListener)
		}
	}
	clickListener = (e) => {
		e.target.style.backgroundImage = `url('${pizzapng}')`;
		e.target.style.backgroundSize = '100% 100%';
	};
	connectedCallback() {
		let img = document.createElement('img');
		img.src = pizzapng;
		img.alt = 'Pizza';
		img.title = 'Enables pizza powers';
		img.style.cssText += `cursor:pointer;height:100%;object-fit:contain;border-radius:0.5ch;object-position: 50% 50%;`;
		img.addEventListener('click', (e) => {
			this.pizzaActive = !this.pizzaActive;
			this.toggle(img);
		});
		this.appendChild(img)
	}
}

customElements.define('pizza-power', CustomElement);