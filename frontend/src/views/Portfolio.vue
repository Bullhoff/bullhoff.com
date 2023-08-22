<script setup>
import { computed, reactive, onMounted } from 'vue';
import { useAssets, useStore } from '@stores/store.js';
import { RouterLink, RouterView } from 'vue-router';
//import full from '@assets/portfolio1/full.json'

const langIcons = {
	wails: `wails.png`,
	mariadb: `mariadb.svg`,
	rollup: `rollup-svgrepo-com.svg`,
	vite: `vite.svg`,	
	jsx: `jsx-svgrepo-com.svg`,      // https://www.svgrepo.com/svg/221331/jsx	https://www.svgrepo.com/svg/221324/jsx
	'nextcloud api': 'logo_nextcloud_blue.svg',		// https://nextcloud.com/press/#logo-resources
	'neutralino.js': 'neutralinojs.png',	
	'esphome': 'esphome-svgrepo-com.svg', // https://www.svgrepo.com/svg/330383/esphome
	'postman': 'postman-icon-svgrepo-com.svg',   // https://www.svgrepo.com/svg/354202/postman-icon
}
const icons = {
	...langIcons,
	website: 'www.svg',
	github: 'github-mark-white.png',
};
const defaultState = {
	defaultCol: 'minmax(1ch, 10%)',
	colsObj: {
		Github: 'fit-content(4em)',
		Website: 'fit-content(4em)',
		Project: 'fit-content(20em)',
		Purpose: 'minmax(30%, 50%)',
		Comment: 'minmax(30%, 50%)',
		'Framework/Language/Tools': 'minmax(10em, 50%)',
	},
}
const state = {
	ready: false,
	expanded: {},
	data: {},
	defaultCol: defaultState.defaultCol,
	colsObj: {},
};
const data = ref([]);

const gridObj = {
	rows: [],
	cols: {
		'+': { gridWidth: `2em`, },
	},
}


function log() {
	if (window.Console) Console.log({ file: 'Portfolio.vue' }, ...arguments)
}

onMounted(() => {
	useStore().isReady('portfolio', init)
	//init()
})

function init() {
	//if(state.data.length > 0) return
	state.data = useStore().portfolio	//structuredClone([...useStore().portfolio])
	let grid = document.getElementById('projects-table')
	loadTable(grid)
	state.ready = true
}

function getCols(jsondata) {
	let maxCol = 0;
	for (let i = 0; i < jsondata.length; i++) {
		if (!jsondata[i].icons) jsondata[i].icons = [];
		for (const [key, value] of Object.entries(jsondata[i])) {
			//if(key != 'icons' || key[0]=='$') continue
			if (key != 'icons' && key[0] != '$') {
				if (!state.colsObj[key] && defaultState.colsObj[key]) state.colsObj[key] = defaultState.colsObj[key]
				else if (!state.colsObj[key]) state.colsObj[key] = defaultState.defaultCol
			}
			if (key == 'Framework' || key == 'Language' || key == 'Tools' || key == 'Other' || key == 'Comment') {
				if (value.length > maxCol) maxCol = value.length;
				for (let x = 0; x < value.length; x++) {
					let val = value[x].toLowerCase();
					let icon = icons[val];
					if (icon) jsondata[i].icons.push({ name: value[x], url: icon.path });
				}
			}
		}
	}
	return Object.values(state.colsObj).join(' ');
}


async function loadTable(tableRef) {
	tableRef.style.gridTemplateColumns = Object.values(gridObj.cols).reduce((a,c)=>a+=`${c.gridWidth} `,``) + await getCols(state.data)
	log('refs.grid.style.gridTemplateColumns', tableRef.style.gridTemplateColumns)

	let thead = tableRef.querySelector('thead')
	thead.innerHTML = ``
	gridObj.rows = []
	await loadHeadRow(state.data[0], thead)
	let tbody = tableRef.querySelector('tbody')
	tbody.innerHTML = ``
	for (let i = 0; i < state.data.length; i++) {
		console.log('state.data', i, state.data[i].Project, state.data[i])
		await loadBodyRow(state.data[i], tbody, i)
	}
	setExpandGroupButtons(tbody)
}
function setExpandGroupButtons(tbody) {
	let expandBtns = tbody.querySelectorAll('.expand-button')
	expandBtns.forEach((btn) => {
		let [rownr, projectname, grp] = (btn?.name || btn?.previousSibling?.innerText || btn?.parent?.name).split('__')
		let row = state.data[rownr]
		let group = row['$']?.group?.replaceAll('.', '-')
		let grouprows = tbody.querySelectorAll(`.grp-${group}`)
		const changeBtnHeight = () => {
			let btnParentRect = btn.parentElement.getBoundingClientRect()
			let height = btnParentRect.height
			if (state.expanded[projectname]) {
				let rectLastGroupRow = Array.from(grouprows).at(-1).children[0].getBoundingClientRect()
				height = rectLastGroupRow.bottom - btnParentRect.top
			}
			let bordersize = getComputedStyle(btn).getPropertyValue('border-width')
			if (bordersize) bordersize = parseInt(bordersize)
			else bordersize = 0
			btn.style.top = `${height / 2 - bordersize}px`
			btn.style.height = `${height}px`
		}
		const resizeObserver = new ResizeObserver((entries) => changeBtnHeight())
		resizeObserver.observe(btn.parentElement);  // document.body

		btn.addEventListener('click', (e) => {
			e.target.querySelector('svg').querySelectorAll('marker').forEach((arrow) => {
				if (arrow.getAttribute('orient') == `90deg`) arrow.setAttribute('orient', `-90deg`)
				else arrow.setAttribute('orient', `90deg`)
			})

			if (!state.expanded[projectname]) state.expanded[projectname] = true
			else state.expanded[projectname] = false
			grouprows.forEach((el) => {
				if (el.classList.contains(`thisis-part`)) {
					if (!state.expanded[projectname]) el.classList.add('hide-row')
					else el.classList.remove('hide-row')

					var child = el.closest('tr')
					var parent = child.parentNode;
					var index = Array.prototype.indexOf.call(parent.children, child) + 1;
					gridObj.rows[index].hidden = !state.expanded[projectname]
				}
			})
			changeBtnHeight()
			adjustRowHeights()
		})
	})
}


function loadHeadRow(row, thead) {
	let tr = document.createElement('tr')
	gridObj.rows.push({ rowHeight: `auto`, })
	for (const [colObj, colKey] of Object.entries(gridObj.cols)) {
		tr.appendChild(document.createElement('th'))
	}
	for (const col of Object.keys(row)) {
		if (col == '$' || col == 'icons') continue
		let th = document.createElement('th')
		if (col != 'Website' && col != 'Github' && col != 'icons') th.innerText = col
		else th.innerHTML = ''
		tr.appendChild(th)
	}
	thead.appendChild(tr)
}
function adjustRowHeights() {
	document.getElementById('projects-table').style.gridTemplateRows = gridObj.rows.reduce((a, c) => {
		if (!c.hidden) a = a + ` ` + c.rowHeight
		return a
	}, ``)
}
function addExpandRowButton(tr, i) {
	let rowNr = i + 1//gridObj.rows.length
	gridObj.rows.push({ rowHeight: `auto`, hidden: tr.classList.contains('hide-row') })
	let btn = document.createElement('button')
	let td = document.createElement('td')
	td.appendChild(btn)
	tr.appendChild(td)
	btn.style.cssText = `width:2em; height:100%; background-color:rgba(0,0,0,0.5); border:none;`
	btn.textContent = `-`
	btn.addEventListener('click', (e) => {
		if (e.target.textContent == '+') {
			e.target.textContent = '-'
			tr.classList.remove('collapsed')
			gridObj.rows[rowNr].rowHeight = `auto`

		}
		else {
			e.target.textContent = '+'
			tr.classList.add('collapsed')
			gridObj.rows[rowNr].rowHeight = `2.5em`
		}
		adjustRowHeights()
	})
}
async function loadBodyRow(row, tbody, i) {
	let tr = document.createElement('tr')

	tr.id = `row-${row['Project']}"`
	if (row['$']?.group) {
		tr.classList.add(`grp-${row['$'].group.replaceAll('.', '-')}`)
		tr.classList.add(`thisis-${row['$'].thisis}`)
		if (row['$'].thisis == 'part') tr.classList.add('hide-row')
	}
	addExpandRowButton(tr, i)

	for (const col of Object.keys(row)) {
		let controls = ``
		if (col == '$' || col == 'icons') continue
		//log('loadBody', col, row[col])
		let td = document.createElement('td')
		if (col == 'Website' && row[col]) {
			if (!row[col].includes(`<a `)) row[col] = `<a href="${row[col]}" class="a-link"> <img src="${await useAssets().getAsset(icons['website'])}" alt="${row[col]}" /> ${'<'}/a>` // useAssets().assets.icons['www.svg'])
			log('Website', row[col])
		}
		else if (col == 'Github' && row[col]) {
			let href = `https://Github.com/Bullhoff/${row[col]}`
			if (!row[col].includes(`<a `)) row[col] = `<a  href="${href}" class="a-link"> <img src="${await useAssets().getAsset(icons['github'])}" alt="${row[col]}" /> ${'<'}/a>`	// useAssets().assets.icons['github-mark.png']  target="_self"
			log('GITHUB', row[col])
		}
		else if (col == 'Project' && row[col]) {
			let project = row[col]
			row[col] = `<b>${project}</b>`

			if (row['$'].expandable) {
				// fill="red" stroke="#00b400" stroke-width="1"
				// <line x1="0.5em" y1="10%" x2="0.5em" y2="90%" stroke="black" stroke-width="2" marker-end="url(#arrow)" marker-start="url(#arrow2)" />
				controls += `<button style="height:100%; " class="expand-button" name="${i}__${project}__${row['$'].group}">
                                <svg width="1em" height="100%" style="pointer-events:none; object-fit:contain;">
                                    <defs>
                                        <marker id="arrow-marker-down" markerWidth="10" markerHeight="6" refX="7" refY="3"   orient="90deg" markerUnits="strokeWidth" >
                                            <path d="M0,0 L0,6 L9,3 z"  />
										${'<'}/marker>
									${'<'}/defs>
                                    <defs >
                                        <marker id="arrow-marker-up" markerWidth="10" markerHeight="6" refX="7" refY="3"  orient="-90deg" markerUnits="strokeWidth"  >
                                            <path  d="M0,0 L0,6 L9,3 z" />
										${'<'}/marker>
									${'<'}/defs>
                                    <line x1="0.5em" y1="10%" x2="0.5em" y2="90%"  stroke-width="2" marker-end="url(#arrow-marker-down)" marker-start="url(#arrow-marker-up)" />
								${'<'}/svg>
							${'<'}/button>`
			}
		}

		if (col == 'Website' || col == 'Github') td.innerHTML = row[col]
		else if (col != 'icons') {
			if (Array.isArray(row[col])) {
				for (let i = 0; i < row[col].length; i++) {
					let item = row[col][i]
					if (!item) continue
					if (!item.includes('</')) {
						let src
						let it = item.toLowerCase()
						if (icons[it]) src = icons[it]
						if (src) row[col][i] = `<b style="white-space:nowrap;"><img style="height:1em;" src="${await useAssets().getAsset(src)}" title="${await useAssets().getAsset(src)}" alt="?" />${item}</b>`
						else row[col][i] = `<span>${item}</span>`
						// word-break: break-all; overflow-wrap: break-word; 
					}
				}
				//row[col] = row[col].join(String.fromCodePoint(0x200D)+'<b>,'+String.fromCodePoint(0x200D)+String.fromCodePoint(0x2008)+'</b>')
				//row[col] = row[col].join(String.fromCodePoint(0x200D) + ',' + String.fromCodePoint(0x200D) + String.fromCodePoint(0x2008) + '')
				const joinWithWrappedCommaToPreventLinebreak = (count = 0) => row[col].reduce((a, c) => {
					count++;
					if (count != row[col].length) c += ', ';
					return a += `<span style="white-space: break-spaces;">${c}</span>`;
				}, '')
				row[col] = joinWithWrappedCommaToPreventLinebreak()
			}
			if (col == 'Purpose' || col == 'Comment' || col == 'Description') td.classList.add('td-text')
			// extra wrap to get the text in the less populated columns collected and centered. 
			td.innerHTML = `<span >${row[col]}</span>${controls}`

		}
		else td.innerHTML = String.fromCodePoint(0x200D) + String.fromCodePoint(0x2008)

		if (col == 'Comment' || col == 'Purpose') {
			for (const key in langIcons) {
				function replaceWithIcon(match) {
					const icon = icons[match.toLowerCase()];
					const original = match.charAt(0) + match.slice(1).toLowerCase();
					return `<b><img style="height:1em;" src="${useAssets().assets.icons[icon]}" />${original}</b>`;
				}
				function replaceAllWithIcon(text, key) {
					const pattern = new RegExp(key, "gi");
					return text.replace(pattern, replaceWithIcon);
				}
				td.innerHTML = await replaceAllWithIcon(td.innerHTML, key);
			}

		}

		tr.appendChild(td)
	}
	tbody.appendChild(tr)
}

function valueString(value) {
	return value && Array.isArray(value) ? value.join(', ') : value != undefined ? value : String.fromCodePoint(0x2009);
}
</script>

<template>
	<table class="projects-table" id="projects-table">
		<thead></thead>
		<tbody></tbody>
	</table>
</template>

<style lang="scss">
* {
	box-sizing: border-box;
	margin: 0;
}

.projects-table {
	margin: 0;
	box-sizing: border-box;
	position: relative;
	display: grid;
	font-family: 'Times New Roman';
	width: fit-content;
	height: fit-content;
	max-width: 100%;
	max-height: 100%;
	max-height: calc(var(--vh, 1vh) * 100);
	border-collapse: collapse;


	thead,
	tbody,
	tr {
		display: contents;

		td,
		th {
			text-align: start;
			border: 1px dotted gray;
			padding: 0 4px;
		}

		th {
			border-bottom: 1px solid red;
			font-weight: 900;
			overflow: hidden;
		}

		td {
			font-family: Arial;
			//line-height: 1.15;
			position: relative;
			display: flex;
			flex-wrap: wrap;
			align-self: stretch;
			align-items: center;
			padding: 0.2ch;

			* {
				max-width: 100%;
			}

			span {
				padding: 0.2ch;
				overflow: auto;
				max-height: 100%;
				width: 100%;

				* {
					max-width: 100%;
					max-height: 100%;
				}

				ul {
					// list-style: none;
					list-style-position: inside;
					padding-left: 0;

				}

				ul[title]::before {
					content: attr(title);
					display: block;
					font-weight: bold;
					padding: 0.2ch 0;
				}
			}

			u,
			i {
				white-space: nowrap;
			}

			b,
			i,
			span {
				align-self: center;
				height: fit-content;
			}
		}

		.td-text {
			white-space: pre-wrap;
		}

		.collapsed {
			height: 2.5em;
			align-items: start;
		}

	}

	.hide-row {
		display: none;
	}

	.title {
		display: block;
		padding: 1ch 0 0 0;
		align-self: start;
		text-align: left;
		width: fit-content;
		height: fit-content;
	}

	.expand-button {
		cursor: pointer;
		display: inline-block;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		background-color: rgba(28, 28, 28, 0.6);
		border: 1px dotted rgb(101, 101, 101);

		svg {
			pointer-events: none;

			line,
			path {
				fill: rgb(77, 77, 77);
				stroke: rgb(77, 77, 77);
			}
		}

		&:hover line {
			-webkit-filter: invert(1);
			filter: invert(1);
		}
	}

	.a-link {
		display: block;
		color: white;
		align-items: center;
	}

	.icon-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	img {
		height: 2em;
	}
}
</style>