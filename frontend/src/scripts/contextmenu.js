export default class {
	constructor(el, list, parent = document.body, { } = {}) {
		this.uuid = crypto.randomUUID().toString();
		this.uuid = Math.random().toString(36).replace('0.', 'contextmenu-'); //Math.random().toString(36).replace('0.',prefix || '');
		this.parent = parent;
		this.el = el;
		this.list = list;
		this.menu;
		this.open = false;
		this.init();
	}
	init() {
		var newStyle = document.createElement('style');
		newStyle.appendChild(document.createTextNode(`
		.contextmenu-item{
			background-color:gray;
		}
		.contextmenu-item:hover{
			background-color:chocolate;
		}
		`));
		document.head.appendChild(newStyle);


		this.el.addEventListener('contextmenu', (e) => {
			if (e.ctrlKey) return
			e.preventDefault();
			this.open = !this.open;
			if (this.open) this.menu.style.display = 'flex';
			else this.menu.style.display = 'none';
			if (this.open) this.openMenu(e);
		});
		this.createMenu();
	}
	openMenu(e) {
		let rect = this.menu.getBoundingClientRect();
		let x = e.clientX;
		let y = e.clientY;
		if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width;
		if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height;

		this.menu.style.left = `${x}px`;
		this.menu.style.top = `${y}px`;

		const onClick = (e) => {
			let isChild = e.target.closest(`#${this.uuid}`);
			if (!isChild) this.close();
		};
		window.addEventListener('click', onClick);
	}
	close() {
		this.open = false;
		this.menu.style.display = 'none';
	}
	createMenu() {
		this.menu = document.createElement('div');
		this.menu.id = this.uuid;
		this.menu.style.zIndex = 99999;
		this.menu.style.position = 'fixed'; //this.menu.style.position = 'absolute'
		this.menu.style.display = 'none';
		this.menu.style.flexDirection = 'column';
		this.parent.appendChild(this.menu);
		for (let i = 0; i < this.list.length; i++) {
			let row = this.list[i]
			if (row.element == 'input') this.addInput(this.list[i], this.menu)
			else if (row.element == 'select') this.addSelect(this.list[i], this.menu)
			else this.addButton(this.list[i], this.menu)
		}
	}
	addSelect(item, parent) {
		let el = document.createElement('select');
		el.classList.add('contextmenu-item')
		el.addEventListener('change', (e) => {
			if (item.func) item.func(e);
			if (!item.closeOnClick) this.close();
		});

		for (let i = 0; i < item.options.length; i++) {
			let option = document.createElement('option');
			option.classList.add('contextmenu-item')
			option.value = item.options[i]
			option.innerText = item.options[i]
			el.appendChild(option)
		}
		if (item.value) el.value = item.value
		if (parent) parent.appendChild(el)
		return el
	}
	addButton(item, parent) {

		let el = document.createElement('p');
		el.classList.add('contextmenu-item')

		let isToggleButton = (item?.value != undefined && typeof item?.value == 'boolean') ? true : false
		if (isToggleButton) el.style.backgroundColor = (item.value) ? 'green' : 'red'

		el.innerText = item.text;
		el.style.padding = '0 10px';
		el.style.border = '1px solid gray';
		el.style.cursor = 'pointer';
		el.addEventListener('click', (e) => {
			if (item.func) item.func();

			if (isToggleButton) {
				item.value = !item.value
				el.style.backgroundColor = (item.value) ? 'green' : 'red'
			}
			if (!item.closeOnClick) this.close();
		});
		if (parent) parent.appendChild(el)
		return el
	}
	addInput(item, parent) {
		let el = document.createElement('input');
		el.classList.add('contextmenu-item')
		el.value = item.value
		if (item.type) el.type = item.type
		if (item.title) el.title = item.title
		el.addEventListener('change', async (e) => {
			if (item.func) {
				let ok = await item.func(e);
				console.log('ok',)
				if (ok) item.value = e.target.value
				else el.value = item.value
			}
			if (!item.closeOnClick) this.close();
		});
		if (parent) parent.appendChild(el)
		return el
	}
	onContextMenu(e) { }
}
