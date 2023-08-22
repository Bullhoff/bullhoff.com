<script lang="jsx">
import _ from 'lodash';


const defaultProps = Object.freeze({
	fill: 'none', // none	#1E1E1E
	stroke: '#F5F5F5', // #000000	#F5F5F5	#4ECDC4
	accent: '#000000',
	preserveAspectRatio: 'xMidYMid meet', // xMinYMin xMidYMid xMinYMid xMidYMin  		meet	slice
	width: '100%',
	height: '100%',
	wrapper: 'square',
	wrapStyle: {},
});

const wrapperElement = (svgElement, mode = 'square', wrapStyle = {}) => {
	const onClick = (e) => {
		if (mode == 'square') e.stopPropagation(); 
		if (mode == 'bicycle') {
			e.target.classList.add('translate-bicycle');
			console.log('bicycle', e.target.classList, e.target.id);
		}
	};
	if (!svgElement) return;
	let style = [wrapStyle, wrapperStyle];
	if (wrappers[mode]) style.push(wrappers[mode]);
	else if (typeof mode == 'object') style.push(mode);

	let classList = ['icon-clickable'];
	if (mode == 'bicycle') classList.push('bicycle');
	return (
		<div id="wrapper" onclick={onClick} class={classList} style={style}>
			{svgElement}
		</div>
	);
};
const wrapperStyle = {
	display:'inline-block',
	position:'relative',
	alignContent:'center',
	alignItems:'center',
	alignSelf:'center',
	boxSizing: 'border-box',
	objectFit: 'contain',
	cursor: 'pointer',
};
const wrappers = {
	'': {},
	singlerow: {
		height: '2ch',
	},
	square: {
		width: '1em',
		height: '1em',
		border: '1px dotted gray',
		borderRadius: '3px',
	},
	bicycle: {
		width: '2.4ch',
		height: '2.4ch',
	},
};

export const SvgNextCloudWhite = defineComponent({
	// https://nextcloud.com/press/#logo-resources
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			/* width="141.485" height="99.603" */
			<svg class="svg-default" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" id="Layer_1" width="100%" height="100%" x="0" y="0" enable-background="new 0 0 196.6 72" version="1.1" viewBox="0 0 132.642 93.377" xml:space="preserve">
				<metadata id="metadata20" />
				<defs id="defs18">
					<clipPath id="clipPath8812" clipPathUnits="userSpaceOnUse">
						<circle id="circle8814" cx="95.669" cy="95.669" r="79.724" style="fill:#00080d;fill-opacity:1;stroke-width:1" />
					</clipPath>
				</defs>
				<path
					id="path1052"
					d="m 66.407896,9.375 c -11.805271,0 -21.811217,8.003196 -24.912392,18.846621 -2.695245,-5.751517 -8.535934,-9.780938 -15.263394,-9.780938 -9.25185,0 -16.85711,7.605263 -16.85711,16.857108 0,9.251833 7.60526,16.860567 16.85711,16.860567 6.72746,0 12.568149,-4.031885 15.263395,-9.784412 3.101175,10.84425 13.10712,18.850106 24.912391,18.850106 11.717964,0 21.67289,-7.885111 24.853382,-18.607048 2.745036,5.621934 8.513436,9.541354 15.145342,9.541354 9.25185,0 16.86057,-7.608734 16.86057,-16.860567 0,-9.251845 -7.60872,-16.857108 -16.86057,-16.857108 -6.631906,0 -12.400306,3.916965 -15.145342,9.537891 C 88.080786,17.257475 78.12586,9.375 66.407896,9.375 Z m 0,9.895518 c 8.911648,0 16.030748,7.115653 16.030748,16.027273 0,8.911605 -7.1191,16.030737 -16.030748,16.030737 -8.911593,0 -16.027247,-7.119132 -16.027247,-16.030737 0,-8.91162 7.115653,-16.027271 16.027247,-16.027273 z M 26.23211,28.336202 c 3.90438,0 6.96505,3.057188 6.96505,6.961589 0,3.904386 -3.06067,6.965049 -6.96505,6.965049 -3.90439,0 -6.96161,-3.060663 -6.96161,-6.965049 0,-3.904401 3.05722,-6.961589 6.96161,-6.961589 z m 80.17451,0 c 3.90442,0 6.96506,3.057188 6.96506,6.961589 0,3.904386 -3.06066,6.965049 -6.96506,6.965049 -3.90436,0 -6.961576,-3.060663 -6.961576,-6.965049 0,-3.904401 3.057226,-6.961589 6.961576,-6.961589 z"
					style="color:#000;font-style:normal;font-variant:normal;font-weight:400;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;baseline-shift:baseline;text-anchor:start;white-space:normal;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000;solid-opacity:1;fill:#fff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.56590033;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate"
				/>
				<path
					style="fill:#fff;fill-opacity:1;stroke-width:.47038522"
					id="path1174"
					d="m 21.235693,69.043756 c -0.32926,0 -0.47147,0.187936 -0.47147,0.517242 V 83.20368 c 0,0.32927 0.14221,0.51495 0.47147,0.51495 h 0.37763 c 0.32927,0 0.51494,-0.18568 0.51494,-0.51495 V 71.874833 l 7.4473,11.557727 c 0.0324,0.0505 0.0677,0.0842 0.10299,0.12123 0.0106,0.0125 0.0179,0.0256 0.0298,0.0366 0.0317,0.0289 0.0665,0.044 0.10065,0.0618 0.019,0.01 0.0338,0.0247 0.055,0.032 0.0148,0.005 0.0304,0.002 0.0458,0.006 0.0525,0.0135 0.10618,0.0275 0.16936,0.0275 h 0.37534 c 0.32926,0 0.47146,-0.18567 0.47146,-0.51495 V 69.560768 c 0,-0.329305 -0.1422,-0.517241 -0.47146,-0.517241 h -0.37534 c -0.32929,0 -0.51724,0.187936 -0.51724,0.517241 V 80.89011 l -7.4473,-11.557716 c -0.0254,-0.03939 -0.0561,-0.06339 -0.0847,-0.0939 -0.086,-0.121611 -0.2222,-0.194545 -0.41654,-0.194545 z m 89.420157,0.187676 c -0.32926,0 -0.18767,0.187956 -0.18767,0.517241 v 4.657417 c 0,0.47037 0.0456,0.79872 0.0456,0.79872 h -0.0456 c 0,0 -0.89419,-2.06893 -3.38722,-2.06893 -2.72821,0 -4.65771,2.16372 -4.56357,5.36231 0,3.19862 1.74024,5.41041 4.51551,5.41041 2.68118,0 3.5749,-2.16508 3.5749,-2.16508 h 0.048 c 0,0 -0.0939,0.28283 -0.0939,0.65913 v 0.79874 c 0,0.32926 0.18796,0.47148 0.51726,0.47148 h 0.32955 c 0.32927,0 0.46917,-0.18798 0.46917,-0.51724 V 69.748673 c 0,-0.329285 -0.51754,-0.517241 -0.84681,-0.517241 z m -36.549859,0.0481 c -0.329276,0 -0.13961,0.187976 -0.13961,0.517241 V 81.32017 c 0,2.25783 1.503766,2.54039 2.350463,2.54039 0.376301,0 0.517217,-0.18796 0.517217,-0.51721 v -0.32958 c 0,-0.32926 -0.188212,-0.46918 -0.423394,-0.46918 -0.470405,-0.047 -1.080249,-0.18887 -1.080249,-1.50594 V 69.79677 c 0,-0.329266 -0.517531,-0.517241 -0.846807,-0.517241 z M 57.220266,70.50169 c -0.32927,0 -0.517238,0.187975 -0.517238,0.51724 v 2.44659 1.17638 5.31423 c 0,2.44599 1.365105,3.81064 3.622946,3.81064 0.42334,0 0.563011,-0.13993 0.563011,-0.46918 v -0.2838 c 0,-0.37629 -0.139671,-0.47024 -0.563011,-0.51724 -0.799652,-0.047 -2.258905,-0.32912 -2.258905,-2.72809 v -5.17464 h 2.117009 c 0.329268,0 0.517238,-0.1399 0.517238,-0.46918 v -0.1419 c 0,-0.32926 -0.18797,-0.51722 -0.517238,-0.51722 h -2.117009 v -2.44659 c 0,-0.329265 -0.139909,-0.51724 -0.469177,-0.51724 z m -18.734963,2.63427 c -2.82229,0 -5.08192,2.02359 -5.12888,5.41037 0,3.19859 2.35289,5.40809 5.41039,5.40809 1.646328,0 2.86852,-0.70495 3.432986,-1.12831 0.23526,-0.18814 0.283014,-0.42392 0.141896,-0.65912 l -0.141896,-0.23346 c -0.141115,-0.28223 -0.374612,-0.33005 -0.656846,-0.14188 -0.470383,0.37629 -1.413295,0.94064 -2.730371,0.94064 -2.116709,0 -3.951319,-1.50604 -3.998279,-4.14019 h 7.479331 c 0.282247,0 0.517238,-0.23501 0.517238,-0.51725 0,-2.9634 -1.550291,-4.93889 -4.325569,-4.93889 z m 29.223883,0 c -3.057482,0 -5.409203,2.25755 -5.456161,5.45614 0,3.1986 2.352896,5.41039 5.410387,5.41039 1.881541,0 3.151307,-0.89493 3.668718,-1.31828 0.235262,-0.2352 0.280729,-0.42265 0.139619,-0.7049 L 71.33213,81.79165 c -0.188136,-0.28225 -0.376902,-0.33005 -0.659131,-0.14191 -0.470383,0.42334 -1.457552,1.08255 -2.915751,1.08255 -2.257826,0 -4.046348,-1.69419 -4.046348,-4.14019 0,-2.49302 1.788522,-4.18596 4.046348,-4.18596 1.223008,0 2.115816,0.61137 2.58618,0.94065 0.282241,0.18807 0.516748,0.18838 0.704913,-0.0938 l 0.1419,-0.23572 c 0.235271,-0.28224 0.187125,-0.51677 -0.0481,-0.7049 -0.517422,-0.42337 -1.645515,-1.17638 -3.432986,-1.17638 z m 15.899301,0 c -3.010451,0 -5.456156,2.30482 -5.456156,5.36231 0,3.10451 2.445705,5.45615 5.456156,5.45615 3.010478,0 5.456168,-2.35164 5.456168,-5.45615 0,-3.05749 -2.44569,-5.36231 -5.456168,-5.36231 z m -30.429991,0.15793 c -0.11518,0.0184 -0.226037,0.0959 -0.331857,0.22197 l -1.904164,2.26805 -1.423546,1.69818 -2.158205,-2.57015 -1.169505,-1.39608 c -0.105876,-0.12611 -0.225795,-0.19525 -0.350163,-0.20597 -0.124354,-0.01 -0.253796,0.0361 -0.379919,0.14189 l -0.288371,0.24258 c -0.252223,0.21167 -0.23901,0.44583 -0.02745,0.69807 l 1.904166,2.26803 1.579172,1.88357 -2.311543,2.75326 c -0.0024,0.002 -0.0035,0.005 -0.0046,0.006 l -1.167215,1.38923 c -0.211653,0.25223 -0.188132,0.51842 0.06408,0.73009 l 0.288368,0.2403 c 0.252239,0.21164 0.481813,0.15841 0.693465,-0.0939 l 1.901876,-2.26806 1.425834,-1.69818 2.158204,2.57244 c 10e-4,0.002 0.0035,0.004 0.0046,0.005 l 1.164928,1.3915 c 0.211652,0.25223 0.477834,0.27337 0.730081,0.0617 l 0.288371,-0.2403 c 0.252237,-0.21165 0.239134,-0.44581 0.02746,-0.69805 l -1.904161,-2.27034 -1.579177,-1.88129 2.311546,-2.75554 c 0.0024,-0.002 0.0035,-0.004 0.0046,-0.006 l 1.167214,-1.38921 c 0.211651,-0.25224 0.188132,-0.51844 -0.06408,-0.73009 l -0.288371,-0.2403 c -0.126112,-0.10587 -0.246408,-0.14655 -0.361607,-0.12815 z m 38.662308,0.0779 c -0.32928,0 -0.47148,0.18796 -0.47148,0.51723 v 6.06722 c 0,2.6812 1.9757,3.99829 4.42169,3.99829 2.446,0 4.421696,-1.31709 4.421696,-3.99829 v -6.06723 c 0.047,-0.32926 -0.13991,-0.51723 -0.469176,-0.51723 h -0.37763 c -0.32927,0 -0.51724,0.18797 -0.51724,0.51723 v 5.69189 c 0,1.59931 -1.035,3.05766 -3.05765,3.05766 -1.9756,0 -3.05763,-1.45835 -3.05763,-3.05766 v -5.69189 c 0,-0.32926 -0.18797,-0.51723 -0.51726,-0.51723 z m -53.403561,0.94063 c 1.505226,0 2.82161,1.08155 2.915753,3.24531 h -6.490633 c 0.32927,-2.11674 1.83447,-3.24531 3.57488,-3.24531 z m 45.171244,0.0939 c 2.210809,0 3.998303,1.74023 3.998303,4.09214 0,2.44598 -1.787494,4.23401 -3.998303,4.23401 -2.210781,0 -3.999385,-1.83505 -4.046332,-4.23401 0,-2.30488 1.835551,-4.09214 4.046332,-4.09214 z m 23.566303,0 c 2.21082,0 3.29339,2.02346 3.29339,4.1402 0,2.9634 -1.60102,4.18595 -3.34144,4.18595 -1.92856,0 -3.24413,-1.6459 -3.29108,-4.18595 0,-2.63415 1.50465,-4.1402 3.33913,-4.1402 z"
				/>
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});
export const SvgNextCloudBlue = defineComponent({
	// https://nextcloud.com/press/#logo-resources
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			/* width="141.485" height="99.603" */
			<svg class="svg-default" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" id="Layer_1" width="100%" height="100%" x="0" y="0" enable-background="new 0 0 196.6 72" version="1.1" viewBox="0 0 132.642 93.377" xml:space="preserve">
				<metadata id="metadata20" />
				<defs id="defs18">
					<clipPath id="clipPath8812" clipPathUnits="userSpaceOnUse">
						<circle id="circle8814" cx="95.669" cy="95.669" r="79.724" style="fill:#00080d;fill-opacity:1;stroke-width:1" />
					</clipPath>
				</defs>
				<path
					id="path1052"
					d="m 66.407896,9.375 c -11.805271,0 -21.811217,8.003196 -24.912392,18.846621 -2.695245,-5.751517 -8.535934,-9.780938 -15.263394,-9.780938 -9.25185,0 -16.85711,7.605263 -16.85711,16.857108 0,9.251833 7.60526,16.860567 16.85711,16.860567 6.72746,0 12.568149,-4.031885 15.263395,-9.784412 3.101175,10.84425 13.10712,18.850106 24.912391,18.850106 11.717964,0 21.67289,-7.885111 24.853382,-18.607048 2.745036,5.621934 8.513436,9.541354 15.145342,9.541354 9.25185,0 16.86057,-7.608734 16.86057,-16.860567 0,-9.251845 -7.60872,-16.857108 -16.86057,-16.857108 -6.631906,0 -12.400306,3.916965 -15.145342,9.537891 C 88.080786,17.257475 78.12586,9.375 66.407896,9.375 Z m 0,9.895518 c 8.911648,0 16.030748,7.115653 16.030748,16.027273 0,8.911605 -7.1191,16.030737 -16.030748,16.030737 -8.911593,0 -16.027247,-7.119132 -16.027247,-16.030737 0,-8.91162 7.115653,-16.027271 16.027247,-16.027273 z M 26.23211,28.336202 c 3.90438,0 6.96505,3.057188 6.96505,6.961589 0,3.904386 -3.06067,6.965049 -6.96505,6.965049 -3.90439,0 -6.96161,-3.060663 -6.96161,-6.965049 0,-3.904401 3.05722,-6.961589 6.96161,-6.961589 z m 80.17451,0 c 3.90442,0 6.96506,3.057188 6.96506,6.961589 0,3.904386 -3.06066,6.965049 -6.96506,6.965049 -3.90436,0 -6.961576,-3.060663 -6.961576,-6.965049 0,-3.904401 3.057226,-6.961589 6.961576,-6.961589 z"
					style="color:#000;font-style:normal;font-variant:normal;font-weight:400;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;baseline-shift:baseline;text-anchor:start;white-space:normal;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000;solid-opacity:1;fill:#0082c9;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:5.56590033;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate"
				/>
				<path
					style="fill:#0082c9;fill-opacity:1;stroke-width:.47038522"
					id="path1174"
					d="m 21.235693,69.043756 c -0.32926,0 -0.47147,0.187936 -0.47147,0.517242 V 83.20368 c 0,0.32927 0.14221,0.51495 0.47147,0.51495 h 0.37763 c 0.32927,0 0.51494,-0.18568 0.51494,-0.51495 V 71.874833 l 7.4473,11.557727 c 0.0324,0.0505 0.0677,0.0842 0.10299,0.12123 0.0106,0.0125 0.0179,0.0256 0.0298,0.0366 0.0317,0.0289 0.0665,0.044 0.10065,0.0618 0.019,0.01 0.0338,0.0247 0.055,0.032 0.0148,0.005 0.0304,0.002 0.0458,0.006 0.0525,0.0135 0.10618,0.0275 0.16936,0.0275 h 0.37534 c 0.32926,0 0.47146,-0.18567 0.47146,-0.51495 V 69.560768 c 0,-0.329305 -0.1422,-0.517241 -0.47146,-0.517241 h -0.37534 c -0.32929,0 -0.51724,0.187936 -0.51724,0.517241 V 80.89011 l -7.4473,-11.557716 c -0.0254,-0.03939 -0.0561,-0.06339 -0.0847,-0.0939 -0.086,-0.121611 -0.2222,-0.194545 -0.41654,-0.194545 z m 89.420157,0.187676 c -0.32926,0 -0.18767,0.187956 -0.18767,0.517241 v 4.657417 c 0,0.47037 0.0456,0.79872 0.0456,0.79872 h -0.0456 c 0,0 -0.89419,-2.06893 -3.38722,-2.06893 -2.72821,0 -4.65771,2.16372 -4.56357,5.36231 0,3.19862 1.74024,5.41041 4.51551,5.41041 2.68118,0 3.5749,-2.16508 3.5749,-2.16508 h 0.048 c 0,0 -0.0939,0.28283 -0.0939,0.65913 v 0.79874 c 0,0.32926 0.18796,0.47148 0.51726,0.47148 h 0.32955 c 0.32927,0 0.46917,-0.18798 0.46917,-0.51724 V 69.748673 c 0,-0.329285 -0.51754,-0.517241 -0.84681,-0.517241 z m -36.549859,0.0481 c -0.329276,0 -0.13961,0.187976 -0.13961,0.517241 V 81.32017 c 0,2.25783 1.503766,2.54039 2.350463,2.54039 0.376301,0 0.517217,-0.18796 0.517217,-0.51721 v -0.32958 c 0,-0.32926 -0.188212,-0.46918 -0.423394,-0.46918 -0.470405,-0.047 -1.080249,-0.18887 -1.080249,-1.50594 V 69.79677 c 0,-0.329266 -0.517531,-0.517241 -0.846807,-0.517241 z M 57.220266,70.50169 c -0.32927,0 -0.517238,0.187975 -0.517238,0.51724 v 2.44659 1.17638 5.31423 c 0,2.44599 1.365105,3.81064 3.622946,3.81064 0.42334,0 0.563011,-0.13993 0.563011,-0.46918 v -0.2838 c 0,-0.37629 -0.139671,-0.47024 -0.563011,-0.51724 -0.799652,-0.047 -2.258905,-0.32912 -2.258905,-2.72809 v -5.17464 h 2.117009 c 0.329268,0 0.517238,-0.1399 0.517238,-0.46918 v -0.1419 c 0,-0.32926 -0.18797,-0.51722 -0.517238,-0.51722 h -2.117009 v -2.44659 c 0,-0.329265 -0.139909,-0.51724 -0.469177,-0.51724 z m -18.734963,2.63427 c -2.82229,0 -5.08192,2.02359 -5.12888,5.41037 0,3.19859 2.35289,5.40809 5.41039,5.40809 1.646328,0 2.86852,-0.70495 3.432986,-1.12831 0.23526,-0.18814 0.283014,-0.42392 0.141896,-0.65912 l -0.141896,-0.23346 c -0.141115,-0.28223 -0.374612,-0.33005 -0.656846,-0.14188 -0.470383,0.37629 -1.413295,0.94064 -2.730371,0.94064 -2.116709,0 -3.951319,-1.50604 -3.998279,-4.14019 h 7.479331 c 0.282247,0 0.517238,-0.23501 0.517238,-0.51725 0,-2.9634 -1.550291,-4.93889 -4.325569,-4.93889 z m 29.223883,0 c -3.057482,0 -5.409203,2.25755 -5.456161,5.45614 0,3.1986 2.352896,5.41039 5.410387,5.41039 1.881541,0 3.151307,-0.89493 3.668718,-1.31828 0.235262,-0.2352 0.280729,-0.42265 0.139619,-0.7049 L 71.33213,81.79165 c -0.188136,-0.28225 -0.376902,-0.33005 -0.659131,-0.14191 -0.470383,0.42334 -1.457552,1.08255 -2.915751,1.08255 -2.257826,0 -4.046348,-1.69419 -4.046348,-4.14019 0,-2.49302 1.788522,-4.18596 4.046348,-4.18596 1.223008,0 2.115816,0.61137 2.58618,0.94065 0.282241,0.18807 0.516748,0.18838 0.704913,-0.0938 l 0.1419,-0.23572 c 0.235271,-0.28224 0.187125,-0.51677 -0.0481,-0.7049 -0.517422,-0.42337 -1.645515,-1.17638 -3.432986,-1.17638 z m 15.899301,0 c -3.010451,0 -5.456156,2.30482 -5.456156,5.36231 0,3.10451 2.445705,5.45615 5.456156,5.45615 3.010478,0 5.456168,-2.35164 5.456168,-5.45615 0,-3.05749 -2.44569,-5.36231 -5.456168,-5.36231 z m -30.429991,0.15793 c -0.11518,0.0184 -0.226037,0.0959 -0.331857,0.22197 l -1.904164,2.26805 -1.423546,1.69818 -2.158205,-2.57015 -1.169505,-1.39608 c -0.105876,-0.12611 -0.225795,-0.19525 -0.350163,-0.20597 -0.124354,-0.01 -0.253796,0.0361 -0.379919,0.14189 l -0.288371,0.24258 c -0.252223,0.21167 -0.23901,0.44583 -0.02745,0.69807 l 1.904166,2.26803 1.579172,1.88357 -2.311543,2.75326 c -0.0024,0.002 -0.0035,0.005 -0.0046,0.006 l -1.167215,1.38923 c -0.211653,0.25223 -0.188132,0.51842 0.06408,0.73009 l 0.288368,0.2403 c 0.252239,0.21164 0.481813,0.15841 0.693465,-0.0939 l 1.901876,-2.26806 1.425834,-1.69818 2.158204,2.57244 c 10e-4,0.002 0.0035,0.004 0.0046,0.005 l 1.164928,1.3915 c 0.211652,0.25223 0.477834,0.27337 0.730081,0.0617 l 0.288371,-0.2403 c 0.252237,-0.21165 0.239134,-0.44581 0.02746,-0.69805 l -1.904161,-2.27034 -1.579177,-1.88129 2.311546,-2.75554 c 0.0024,-0.002 0.0035,-0.004 0.0046,-0.006 l 1.167214,-1.38921 c 0.211651,-0.25224 0.188132,-0.51844 -0.06408,-0.73009 l -0.288371,-0.2403 c -0.126112,-0.10587 -0.246408,-0.14655 -0.361607,-0.12815 z m 38.662308,0.0779 c -0.32928,0 -0.47148,0.18796 -0.47148,0.51723 v 6.06722 c 0,2.6812 1.9757,3.99829 4.42169,3.99829 2.446,0 4.421696,-1.31709 4.421696,-3.99829 v -6.06723 c 0.047,-0.32926 -0.13991,-0.51723 -0.469176,-0.51723 h -0.37763 c -0.32927,0 -0.51724,0.18797 -0.51724,0.51723 v 5.69189 c 0,1.59931 -1.035,3.05766 -3.05765,3.05766 -1.9756,0 -3.05763,-1.45835 -3.05763,-3.05766 v -5.69189 c 0,-0.32926 -0.18797,-0.51723 -0.51726,-0.51723 z m -53.403561,0.94063 c 1.505226,0 2.82161,1.08155 2.915753,3.24531 h -6.490633 c 0.32927,-2.11674 1.83447,-3.24531 3.57488,-3.24531 z m 45.171244,0.0939 c 2.210809,0 3.998303,1.74023 3.998303,4.09214 0,2.44598 -1.787494,4.23401 -3.998303,4.23401 -2.210781,0 -3.999385,-1.83505 -4.046332,-4.23401 0,-2.30488 1.835551,-4.09214 4.046332,-4.09214 z m 23.566303,0 c 2.21082,0 3.29339,2.02346 3.29339,4.1402 0,2.9634 -1.60102,4.18595 -3.34144,4.18595 -1.92856,0 -3.24413,-1.6459 -3.29108,-4.18595 0,-2.63415 1.50465,-4.1402 3.33913,-4.1402 z"
				/>
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});
export const SvgAlarm = defineComponent({
	// https://www.svgrepo.com/svg/442028/alarm
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" height={height} width={width} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill={fill}>
				<circle cx="16" cy="17" r="11" stroke={stroke} stroke-width="2" />
				<path
					fill={stroke}
					d="M25.9 7.1a1 1 0 101.414-1.415L25.899 7.1zM20.14 1.543a1 1 0 10-.517 1.932l.517-1.932zm7.173 4.141a16 16 0 00-7.173-4.14l-.517 1.93A14 14 0 0125.9 7.1l1.414-1.414zM12.377 3.476a1 1 0 10-.518-1.932l.518 1.932zm-7.69 2.21A1 1 0 106.1 7.098L4.686 5.685zm7.172-4.142a16 16 0 00-7.173 4.141L6.101 7.1a14 14 0 016.276-3.623l-.518-1.932z"
				/>
				<path stroke={stroke} stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 10.5V17l-4 4" />
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgClock = defineComponent({
	// https://www.svgrepo.com/svg/491204/clock
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" height={height} width={width} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="12" r="8" stroke={stroke} stroke-width="2" />
				<path d="M13 7.5L12.5436 11.6079C12.5156 11.8599 12.3929 12.0918 12.2005 12.2567L9 15" stroke={stroke} stroke-width="2" stroke-linecap="round" />
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgSettings = defineComponent({
	// https://www.svgrepo.com/svg/10207/settings
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		/* stroke={stroke} stroke-width="1" */
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 489.802 489.802" xml:space="preserve">
				<g>
					<path
						fill={stroke} stroke-width="0"
						d="M20.701,281.901l32.1,0.2c4.8,24.7,14.3,48.7,28.7,70.5l-22.8,22.6c-8.2,8.1-8.2,21.2-0.2,29.4l24.6,24.9
		c8.1,8.2,21.2,8.2,29.4,0.2l22.8-22.6c21.6,14.6,45.5,24.5,70.2,29.5l-0.2,32.1c-0.1,11.5,9.2,20.8,20.7,20.9l35,0.2
		c11.5,0.1,20.8-9.2,20.9-20.7l0.2-32.1c24.7-4.8,48.7-14.3,70.5-28.7l22.6,22.8c8.1,8.2,21.2,8.2,29.4,0.2l24.9-24.6
		c8.2-8.1,8.2-21.2,0.2-29.4l-22.6-22.8c14.6-21.6,24.5-45.5,29.5-70.2l32.1,0.2c11.5,0.1,20.8-9.2,20.9-20.7l0.2-35
		c0.1-11.5-9.2-20.8-20.7-20.9l-32.1-0.2c-4.8-24.7-14.3-48.7-28.7-70.5l22.8-22.6c8.2-8.1,8.2-21.2,0.2-29.4l-24.6-24.9
		c-8.1-8.2-21.2-8.2-29.4-0.2l-22.8,22.6c-21.6-14.6-45.5-24.5-70.2-29.5l0.2-32.1c0.1-11.5-9.2-20.8-20.7-20.9l-35-0.2
		c-11.5-0.1-20.8,9.2-20.9,20.7l-0.3,32.1c-24.8,4.8-48.8,14.3-70.5,28.7l-22.6-22.8c-8.1-8.2-21.2-8.2-29.4-0.2l-24.8,24.6
		c-8.2,8.1-8.2,21.2-0.2,29.4l22.6,22.8c-14.6,21.6-24.5,45.5-29.5,70.2l-32.1-0.2c-11.5-0.1-20.8,9.2-20.9,20.7l-0.2,35
		C-0.099,272.401,9.201,281.801,20.701,281.901z M179.301,178.601c36.6-36.2,95.5-35.9,131.7,0.7s35.9,95.5-0.7,131.7
		s-95.5,35.9-131.7-0.7S142.701,214.801,179.301,178.601z"
					/>
				</g>
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});
export const SvgSettings2 = defineComponent({
	// https://www.svgrepo.com/svg/362189/wrench
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<title>/svg/ic-settings</title>
				<desc>Created with Sketch.</desc>
				<defs></defs>
				<g id="Page-1" stroke="none" stroke-width="1" fill={fill} fill-rule="evenodd">
					<g id="ic-settings" fill={stroke}>
						<path
							d="M1,5 C1,4.44771525 1.44266033,4 1.99895656,4 L3.00104344,4 C3.55275191,4 4,4.44386482 4,5 C4,5.55228475 3.55733967,6 3.00104344,6 L1.99895656,6 C1.44724809,6 1,5.55613518 1,5 Z M12,5 C12,4.44771525 12.444837,4 12.9955775,4 L22.0044225,4 C22.5542648,4 23,4.44386482 23,5 C23,5.55228475 22.555163,6 22.0044225,6 L12.9955775,6 C12.4457352,6 12,5.55613518 12,5 Z M8,6 C7.44771525,6 7,5.55228475 7,5 C7,4.44771525 7.44771525,4 8,4 C8.55228475,4 9,4.44771525 9,5 C9,5.55228475 8.55228475,6 8,6 Z M8,8 C6.34314575,8 5,6.65685425 5,5 C5,3.34314575 6.34314575,2 8,2 C9.65685425,2 11,3.34314575 11,5 C11,6.65685425 9.65685425,8 8,8 Z M1,19 C1,18.4477153 1.44266033,18 1.99895656,18 L3.00104344,18 C3.55275191,18 4,18.4438648 4,19 C4,19.5522847 3.55733967,20 3.00104344,20 L1.99895656,20 C1.44724809,20 1,19.5561352 1,19 Z M12,19 C12,18.4477153 12.444837,18 12.9955775,18 L22.0044225,18 C22.5542648,18 23,18.4438648 23,19 C23,19.5522847 22.555163,20 22.0044225,20 L12.9955775,20 C12.4457352,20 12,19.5561352 12,19 Z M8,20 C7.44771525,20 7,19.5522847 7,19 C7,18.4477153 7.44771525,18 8,18 C8.55228475,18 9,18.4477153 9,19 C9,19.5522847 8.55228475,20 8,20 Z M8,22 C6.34314575,22 5,20.6568542 5,19 C5,17.3431458 6.34314575,16 8,16 C9.65685425,16 11,17.3431458 11,19 C11,20.6568542 9.65685425,22 8,22 Z M1,12 C1,11.4477153 1.4556644,11 1.99539757,11 L10.0046024,11 C10.5543453,11 11,11.4438648 11,12 C11,12.5522847 10.5443356,13 10.0046024,13 L1.99539757,13 C1.44565467,13 1,12.5561352 1,12 Z M19,12 C19,11.4477153 19.4433532,11 20.0093689,11 L21.9906311,11 C22.5480902,11 23,11.4438648 23,12 C23,12.5522847 22.5566468,13 21.9906311,13 L20.0093689,13 C19.4519098,13 19,12.5561352 19,12 Z M15,13 C14.4477153,13 14,12.5522847 14,12 C14,11.4477153 14.4477153,11 15,11 C15.5522847,11 16,11.4477153 16,12 C16,12.5522847 15.5522847,13 15,13 Z M15,15 C13.3431458,15 12,13.6568542 12,12 C12,10.3431458 13.3431458,9 15,9 C16.6568542,9 18,10.3431458 18,12 C18,13.6568542 16.6568542,15 15,15 Z"
							id="Combined-Shape"
						></path>
					</g>
				</g>
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});
export const SvgWrench = defineComponent({
	// https://www.svgrepo.com/svg/362189/wrench
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">
				<g transform="translate(0 -1028.4)">
					<g>
						{/* fill="#7f8c8d" */}
						<path
							d="m5.2812 1.2812v1l4.7188 4.7188-1 3-3 1-4.7188-4.7188c-0.1638 0.5466-0.2812 1.1188-0.2812 1.7188 0 3.314 2.6863 6 6 6 0.6 0 1.1721-0.117 1.7188-0.281 1.7612 1.759 3.5192 3.522 5.2812 5.281l4 4c0.513 0.512 1.217 0.844 2 0.844 1.567 0 2.844-1.282 2.844-2.844 0-0.781-0.331-1.488-0.844-2l-4-4c-1.761-1.76-3.52-3.521-5.281-5.2812 0.164-0.5468 0.281-1.1188 0.281-1.7188 0-3.3137-2.686-6-6-6-0.2459 0-0.482 0.0279-0.7188 0.0625v-0.7813h-1zm14.719 18.219c0.828 0 1.5 0.672 1.5 1.5s-0.672 1.5-1.5 1.5-1.5-0.672-1.5-1.5 0.672-1.5 1.5-1.5z"
							transform="translate(0 1028.4)"
							fill={stroke}
						/>
						{/* fill="#95a5a6" */}
						<path
							fill={stroke}
							d="m7 1029.4c-0.6 0-1.1721 0.1-1.7188 0.2l4.7188 4.8-1 3-3 1-4.7188-4.8c-0.1638 0.6-0.2812 1.2-0.2812 1.8 0 3.3 2.6863 6 6 6 0.6 0 1.1721-0.2 1.7188-0.3 1.7612 1.7 3.5192 3.5 5.2812 5.3l4 4c0.513 0.5 1.217 0.8 2 0.8 1.567 0 2.844-1.3 2.844-2.8 0-0.8-0.331-1.5-0.844-2l-4-4c-1.761-1.8-3.52-3.6-5.281-5.3 0.164-0.6 0.281-1.1 0.281-1.7 0-3.4-2.686-6-6-6zm13 17.5c0.828 0 1.5 0.6 1.5 1.5 0 0.8-0.672 1.5-1.5 1.5s-1.5-0.7-1.5-1.5c0-0.9 0.672-1.5 1.5-1.5z"
						/>
					</g>
				</g>
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

/*  */

export const SvgBin = defineComponent({
	// https://www.svgrepo.com/svg/491188/bin
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path d="M7.69231 8.70833H5V8.16667H9.84615M7.69231 8.70833V19H16.3077V8.70833M7.69231 8.70833H16.3077M16.3077 8.70833H19V8.16667H14.1538M9.84615 8.16667V6H14.1538V8.16667M9.84615 8.16667H14.1538" stroke={stroke} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M10 11V17" stroke={stroke} stroke-linecap="round" stroke-linejoin="round" />
				<path d="M12 11V17" stroke={stroke} stroke-linecap="round" stroke-linejoin="round" />
				<path d="M14 11V17" stroke={stroke} stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgVisible = defineComponent({
	// https://www.svgrepo.com/svg/491155/visible
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 7C7.60743 7 4.49054 10.5081 3.41345 11.9208C3.15417 12.2609 3.17881 12.7211 3.4696 13.0347C4.66556 14.3243 8.01521 17.5 12 17.5C15.9848 17.5 19.3344 14.3243 20.5304 13.0347C20.8212 12.7211 20.8458 12.2609 20.5865 11.9208C19.5095 10.5081 16.3926 7 12 7Z"
					stroke={stroke}
					stroke-width="2"
				/>
				<path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill={stroke} />
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});
export const SvgNotVisible = defineComponent({
	// https://www.svgrepo.com/svg/491289/not-visible
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M10.6484 10.5264L13.4743 13.3523C13.8012 12.9962 14.0007 12.5214 14.0007 12C14.0007 10.8954 13.1053 10 12.0007 10C11.4793 10 11.0045 10.1995 10.6484 10.5264Z" fill={stroke} />
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M14.1211 18.2422C13.4438 18.4051 12.7343 18.5 12.0003 18.5C9.7455 18.5 7.72278 17.6047 6.14832 16.592C4.56791 15.5755 3.3674 14.3948 2.73665 13.7147C2.11883 13.0485 2.06103 12.0457 2.6185 11.3145C3.05443 10.7428 3.80513 9.84641 4.83105 8.95209L6.24907 10.3701C5.35765 11.1309 4.68694 11.911 4.2791 12.436C4.86146 13.0547 5.90058 14.0547 7.23022 14.9099C8.62577 15.8075 10.2703 16.5 12.0003 16.5C12.1235 16.5 12.2463 16.4965 12.3686 16.4896L14.1211 18.2422ZM15.6656 15.544L17.1427 17.0211C17.3881 16.8821 17.6248 16.7383 17.8522 16.592C19.4326 15.5755 20.6332 14.3948 21.2639 13.7147C21.8817 13.0485 21.9395 12.0457 21.3821 11.3145C20.809 10.563 19.6922 9.25059 18.1213 8.1192C16.5493 6.98702 14.4708 6 12.0003 6C10.229 6 8.65936 6.50733 7.33335 7.21175L8.82719 8.70559C9.78572 8.27526 10.8489 8 12.0003 8C13.9223 8 15.5986 8.76704 16.9524 9.7421C18.2471 10.6745 19.1995 11.7641 19.7215 12.436C19.1391 13.0547 18.1 14.0547 16.7703 14.9099C16.4172 15.137 16.0481 15.3511 15.6656 15.544Z"
					fill={stroke}
				/>
				<path d="M4 5L19 20" stroke={stroke} stroke-width="2" stroke-linecap="round" />
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgRestart = defineComponent({
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		//let svg = ( // https://www.svgrepo.com/svg/488668/restart
		let svg = // https://www.svgrepo.com/svg/488668/restart
			(
				<svg class="svg-default" fill={stroke} width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="-7.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<path d="M15.88 13.84c-1.68-3.48-5.44-5.24-9.040-4.6l0.96-1.8c0.24-0.4 0.080-0.92-0.32-1.12-0.4-0.24-0.92-0.080-1.12 0.32l-1.96 3.64c0 0-0.44 0.72 0.24 1.040l3.64 1.96c0.12 0.080 0.28 0.12 0.4 0.12 0.28 0 0.6-0.16 0.72-0.44 0.24-0.4 0.080-0.92-0.32-1.12l-1.88-1.040c2.84-0.48 5.8 0.96 7.12 3.68 1.6 3.32 0.2 7.32-3.12 8.88-1.6 0.76-3.4 0.88-5.080 0.28s-3.040-1.8-3.8-3.4c-0.76-1.6-0.88-3.4-0.28-5.080 0.16-0.44-0.080-0.92-0.52-1.080-0.4-0.080-0.88 0.16-1.040 0.6-0.72 2.12-0.6 4.36 0.36 6.36s2.64 3.52 4.76 4.28c0.92 0.32 1.84 0.48 2.76 0.48 1.24 0 2.48-0.28 3.6-0.84 4.16-2 5.92-7 3.92-11.12z"></path>
				</svg>
			);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgPlay = defineComponent({
	// https://www.svgrepo.com/svg/491305/play
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path d="M17.2839 11.134C17.9506 11.5189 17.9506 12.4811 17.2839 12.866L6.71601 18.9674C6.04934 19.3523 5.21601 18.8712 5.21601 18.1014L5.21601 5.8986C5.21601 5.1288 6.04934 4.64768 6.71601 5.03258L17.2839 11.134Z" fill={stroke} />
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});
export const SvgPause = defineComponent({
	// https://www.svgrepo.com/svg/491298/pause
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path d="M8.5 7V18" stroke={stroke} stroke-width="3" stroke-linecap="round" />
				<path d="M15.5 7V12.5V18" stroke={stroke} stroke-width="3" stroke-linecap="round" />
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgBicycle = defineComponent({
	// https://www.svgrepo.com/svg/509755/bicycle
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" style="pointer-events:none;" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M16 6C17.1046 6 18 5.10457 18 4C18 2.89543 17.1046 2 16 2C14.8954 2 14 2.89543 14 4C14 5.10457 14.8954 6 16 6ZM13.2428 5.52993C13.5738 5.61279 13.8397 5.85869 13.9482 6.18222C14.13 6.72461 14.3843 7.20048 14.697 7.59998C15.5586 8.70094 16.9495 9.32795 18.8356 9.01361C19.3804 8.92281 19.8956 9.29083 19.9864 9.8356C20.0772 10.3804 19.7092 10.8956 19.1644 10.9864C17.0282 11.3424 15.1791 10.7992 13.8435 9.60462L11.1291 11.9869L12.7524 13.8413C12.912 14.0236 13 14.2577 13 14.5V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V14.8759L8.9689 12.5556L8.92455 12.5059C8.68548 12.2386 8.28531 11.7911 8.11145 11.2626C8.00463 10.9379 7.97131 10.5628 8.08578 10.1667C8.1967 9.78279 8.42374 9.45733 8.7058 9.18044L8.71971 9.16705L12.3134 5.77299C12.5614 5.53871 12.9118 5.44708 13.2428 5.52993ZM2 17C2 15.3431 3.34315 14 5 14C6.65685 14 8 15.3431 8 17C8 18.6569 6.65685 20 5 20C3.34315 20 2 18.6569 2 17ZM5 12C2.23858 12 0 14.2386 0 17C0 19.7614 2.23858 22 5 22C7.76142 22 10 19.7614 10 17C10 14.2386 7.76142 12 5 12ZM16 17C16 15.3431 17.3431 14 19 14C20.6569 14 22 15.3431 22 17C22 18.6569 20.6569 20 19 20C17.3431 20 16 18.6569 16 17ZM19 12C16.2386 12 14 14.2386 14 17C14 19.7614 16.2386 22 19 22C21.7614 22 24 19.7614 24 17C24 14.2386 21.7614 12 19 12Z"
					fill={stroke}
				/>
			</svg>
		);
		return () => wrapperElement(svg, 'bicycle');
	},
});

export const SvgCheckbox = defineComponent({
	// https://www.svgrepo.com/svg/509805/checkbox
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M6 5C5.44772 5 5 5.44772 5 6V13V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V13V6C19 5.44772 18.5523 5 18 5H6ZM3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V13V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V13V6Z"
					fill={stroke}
				/>
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgCheckboxChecked = defineComponent({
	// https://www.svgrepo.com/svg/509806/checked-checkbox
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM17.8 8.6C18.1314 8.15817 18.0418 7.53137 17.6 7.2C17.1582 6.86863 16.5314 6.95817 16.2 7.4L10.8918 14.4776L8.70711 12.2929C8.31658 11.9024 7.68342 11.9024 7.29289 12.2929C6.90237 12.6834 6.90237 13.3166 7.29289 13.7071L10.2929 16.7071C10.4979 16.9121 10.7817 17.018 11.0709 16.9975C11.3601 16.9769 11.6261 16.8319 11.8 16.6L17.8 8.6Z"
					fill={stroke}
				/>
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgDebug = defineComponent({
	// https://www.svgrepo.com/svg/509806/checked-checkbox
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (
			<svg class="svg-default" width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					fill={stroke}
					stroke={stroke}
					d="M4.6 15c-.9-2.6-.6-4.6-.5-5.4 2.4-1.5 5.3-2 8-1.3.7-.3 1.5-.5 2.3-.6-.1-.3-.2-.5-.3-.8h2l1.2-3.2-.9-.4-1 2.6h-1.8C13 4.8 12.1 4 11.1 3.4l2.1-2.1-.7-.7L10.1 3c-.7 0-1.5 0-2.3.1L5.4.7l-.7.7 2.1 2.1C5.7 4.1 4.9 4.9 4.3 6H2.5l-1-2.6-.9.4L1.8 7h2C3.3 8.3 3 9.6 3 11H1v1h2c0 1 .2 2 .5 3H1.8L.6 18.3l.9.3 1-2.7h1.4c.4.8 2.1 4.5 5.8 3.9-.3-.2-.5-.5-.7-.8-2.9 0-4.4-3.5-4.4-4zM9 3.9c2 0 3.7 1.6 4.4 3.8-2.9-1-6.2-.8-9 .6.7-2.6 2.5-4.4 4.6-4.4zm14.8 19.2l-4.3-4.3c2.1-2.5 1.8-6.3-.7-8.4s-6.3-1.8-8.4.7-1.8 6.3.7 8.4c2.2 1.9 5.4 1.9 7.7 0l4.3 4.3c.2.2.5.2.7 0 .2-.2.2-.5 0-.7zm-8.8-3c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1-2.3 5.1-5.1 5.1z"
				/>
				<path fill={fill} d="M0 0h24v24H0z" />
			</svg>
		);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});
export const SvgQuestionMark = defineComponent({
	// https://www.svgrepo.com/svg/479050/question-mark
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle, accent} = _.merge(structuredClone(defaultProps), props);
		let svg = ( <svg class="svg-default" fill={stroke} width={width} height={height} preserveAspectRatio={preserveAspectRatio} version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-153.6 -153.6 819.20 819.20" xml:space="preserve" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke={accent} stroke-width="51.2">  <g> <path fill={stroke} class="st0" d="M396.138,85.295c-13.172-25.037-33.795-45.898-59.342-61.03C311.26,9.2,280.435,0.001,246.98,0.001 c-41.238-0.102-75.5,10.642-101.359,25.521c-25.962,14.826-37.156,32.088-37.156,32.088c-4.363,3.786-6.824,9.294-6.721,15.056 c0.118,5.77,2.775,11.186,7.273,14.784l35.933,28.78c7.324,5.864,17.806,5.644,24.875-0.518c0,0,4.414-7.978,18.247-15.88 c13.91-7.85,31.945-14.173,58.908-14.258c23.517-0.051,44.022,8.725,58.016,20.717c6.952,5.941,12.145,12.594,15.328,18.68 c3.208,6.136,4.379,11.5,4.363,15.574c-0.068,13.766-2.742,22.77-6.603,30.442c-2.945,5.729-6.789,10.813-11.738,15.744 c-7.384,7.384-17.398,14.207-28.634,20.479c-11.245,6.348-23.365,11.932-35.612,18.68c-13.978,7.74-28.77,18.858-39.701,35.544 c-5.449,8.249-9.71,17.686-12.416,27.641c-2.742,9.964-3.98,20.412-3.98,31.071c0,11.372,0,20.708,0,20.708 c0,10.719,8.69,19.41,19.41,19.41h46.762c10.719,0,19.41-8.691,19.41-19.41c0,0,0-9.336,0-20.708c0-4.107,0.467-6.755,0.917-8.436 c0.773-2.512,1.206-3.14,2.47-4.668c1.29-1.452,3.895-3.674,8.698-6.331c7.019-3.946,18.298-9.276,31.07-16.176 c19.121-10.456,42.367-24.646,61.972-48.062c9.752-11.686,18.374-25.758,24.323-41.968c6.001-16.21,9.242-34.431,9.226-53.96 C410.243,120.761,404.879,101.971,396.138,85.295z"></path> <path class="st0" d="M228.809,406.44c-29.152,0-52.788,23.644-52.788,52.788c0,29.136,23.637,52.772,52.788,52.772 c29.136,0,52.763-23.636,52.763-52.772C281.572,430.084,257.945,406.44,228.809,406.44z"></path> </g> </g><g id="SVGRepo_iconCarrier">  <g> <path fill={stroke}  class="st0" d="M396.138,85.295c-13.172-25.037-33.795-45.898-59.342-61.03C311.26,9.2,280.435,0.001,246.98,0.001 c-41.238-0.102-75.5,10.642-101.359,25.521c-25.962,14.826-37.156,32.088-37.156,32.088c-4.363,3.786-6.824,9.294-6.721,15.056 c0.118,5.77,2.775,11.186,7.273,14.784l35.933,28.78c7.324,5.864,17.806,5.644,24.875-0.518c0,0,4.414-7.978,18.247-15.88 c13.91-7.85,31.945-14.173,58.908-14.258c23.517-0.051,44.022,8.725,58.016,20.717c6.952,5.941,12.145,12.594,15.328,18.68 c3.208,6.136,4.379,11.5,4.363,15.574c-0.068,13.766-2.742,22.77-6.603,30.442c-2.945,5.729-6.789,10.813-11.738,15.744 c-7.384,7.384-17.398,14.207-28.634,20.479c-11.245,6.348-23.365,11.932-35.612,18.68c-13.978,7.74-28.77,18.858-39.701,35.544 c-5.449,8.249-9.71,17.686-12.416,27.641c-2.742,9.964-3.98,20.412-3.98,31.071c0,11.372,0,20.708,0,20.708 c0,10.719,8.69,19.41,19.41,19.41h46.762c10.719,0,19.41-8.691,19.41-19.41c0,0,0-9.336,0-20.708c0-4.107,0.467-6.755,0.917-8.436 c0.773-2.512,1.206-3.14,2.47-4.668c1.29-1.452,3.895-3.674,8.698-6.331c7.019-3.946,18.298-9.276,31.07-16.176 c19.121-10.456,42.367-24.646,61.972-48.062c9.752-11.686,18.374-25.758,24.323-41.968c6.001-16.21,9.242-34.431,9.226-53.96 C410.243,120.761,404.879,101.971,396.138,85.295z"></path> <path class="st0" d="M228.809,406.44c-29.152,0-52.788,23.644-52.788,52.788c0,29.136,23.637,52.772,52.788,52.772 c29.136,0,52.763-23.636,52.763-52.772C281.572,430.084,257.945,406.44,228.809,406.44z"></path> </g> </g></svg>);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgRedDot = defineComponent({
	// https://www.svgrepo.com/svg/366077/dialog-no
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = ( <svg class="svg-default"  width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="-20 -20 140.00 140.00" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="#000000" style="--darkreader-inline-fill: #000000;" data-darkreader-inline-fill=""><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.2" style="--darkreader-inline-stroke: #c8c3bc;" data-darkreader-inline-stroke=""></g><g id="SVGRepo_iconCarrier"> <defs> <mask id="mask_circle"> <circle cx="50" cy="50" r="50" fill="white" style="--darkreader-inline-fill: #e8e6e3;" data-darkreader-inline-fill=""></circle> <circle cx="50" cy="50" r="12" fill="#000000" style="--darkreader-inline-fill: #e8e6e3;" data-darkreader-inline-fill=""></circle> </mask> <linearGradient x1="20" y1="60" x2="60" y2="40" id="Gradient" gradientUnits="userSpaceOnUse"> <stop style="stop-color: rgb(101, 14, 19); stop-opacity: 1; --darkreader-inline-stopcolor: #ef8c91;" offset="0" data-darkreader-inline-stopcolor=""></stop> <stop style="stop-color: rgb(221, 48, 67); stop-opacity: 1; --darkreader-inline-stopcolor: #e04254;" offset="1" data-darkreader-inline-stopcolor=""></stop> </linearGradient> </defs> <circle cx="50" cy="50" r="48" style="fill: rgb(101, 14, 19); --darkreader-inline-fill: #ef8c91;" data-darkreader-inline-fill=""></circle> <circle cx="50" cy="50" r="43" style="fill: url(&quot;#Gradient&quot;); stroke: rgb(238, 238, 238); stroke-width: 3px; --darkreader-inline-stroke: #dddad6;" data-darkreader-inline-stroke=""></circle> </g></svg>);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});
export const SvgGreenDot = defineComponent({
	// https://www.svgrepo.com/svg/366081/dialog-yes
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		let svg = (<svg viewBox="-20 -20 140.00 140.00" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="#000000" style="--darkreader-inline-fill: #000000;" data-darkreader-inline-fill=""><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1" style="--darkreader-inline-stroke: #c8c3bc;" data-darkreader-inline-stroke=""></g><g id="SVGRepo_iconCarrier"> <defs> <mask id="mask_circle"> <circle cx="50" cy="50" r="50" fill="white" style="--darkreader-inline-fill: #e8e6e3;" data-darkreader-inline-fill=""></circle> <circle cx="50" cy="50" r="12" fill="#000000" style="--darkreader-inline-fill: #e8e6e3;" data-darkreader-inline-fill=""></circle> </mask> <linearGradient x1="20" y1="60" x2="60" y2="40" id="Gradient" gradientUnits="userSpaceOnUse"> <stop style="stop-color: rgb(15, 101, 14); stop-opacity: 1; --darkreader-inline-stopcolor: #8def8c;" offset="0" data-darkreader-inline-stopcolor=""></stop> <stop style="stop-color: rgb(57, 146, 56); stop-opacity: 1; --darkreader-inline-stopcolor: #75ca74;" offset="1" data-darkreader-inline-stopcolor=""></stop> </linearGradient> </defs> <circle cx="50" cy="50" r="48" style="fill: rgb(15, 101, 14); --darkreader-inline-fill: #8def8c;" data-darkreader-inline-fill=""></circle> <circle cx="50" cy="50" r="43" style="fill: url(&quot;#Gradient&quot;); stroke: rgb(238, 238, 238); stroke-width: 3px; --darkreader-inline-stroke: #dddad6;" data-darkreader-inline-stroke=""></circle> </g></svg>);
		return () => wrapperElement(svg, wrapper, wrapStyle);
	},
});

export const SvgPin = defineComponent({
	// https://www.svgrepo.com/svg/509197/pin
	props: ['fill', 'stroke', 'width', 'height', 'preserveAspectRatio', 'wrapper', 'wrapStyle', 'active'],
	setup(props, {emit}) {
		let {fill, stroke, width, height, preserveAspectRatio, wrapper, wrapStyle} = _.merge(structuredClone(defaultProps), props);
		const active = toRef(props, 'active');
		watch(active, (value) => {
			console.log('props.active', props, props.active, active, value);
			stroke = setColor(active.value, stroke);
		});
		const setColor = (b, color) => {
			if (b) color = '#00FF00';
			else color = defaultProps.stroke;
			return color;
		};
		stroke = setColor(active.value, stroke);
		const svg = () => {
			return (
				<svg class="svg-default" fill={stroke} width={width} height={height} preserveAspectRatio={preserveAspectRatio} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<path d="M31.714 11.864l-11.505-11.563c-0.248-0.249-0.605-0.35-0.948-0.266-0.341 0.083-0.613 0.339-0.717 0.674-0.692 2.228-0.773 4.245-0.244 6.084-0.049 0.034-0.095 0.070-0.138 0.113l-5.347 5.346c-1.725-0.8-3.579-1.233-5.428-1.233-1.175 0-2.327 0.174-3.424 0.515-0.334 0.104-0.59 0.375-0.674 0.714s0.014 0.698 0.261 0.947l6.843 6.887-9.568 9.72-0.832 2.192 2.011-0.777 9.793-9.72 6.932 6.977c0.189 0.192 0.447 0.295 0.709 0.295 0.079 0 0.159-0.010 0.238-0.029 0.341-0.084 0.613-0.34 0.717-0.675 0.905-2.913 0.64-6.042-0.636-8.848l5.459-5.46c0.020-0.020 0.033-0.041 0.051-0.063 0.824 0.236 1.678 0.361 2.564 0.361 1.101 0 2.268-0.158 3.468-0.531 0.334-0.104 0.59-0.375 0.674-0.714s-0.015-0.697-0.262-0.945zM18.849 25.755l-12.587-12.669c3.23-0.377 6.714 0.925 9.236 3.447 2.51 2.509 3.735 5.978 3.351 9.221zM18.757 17.392c-0.526-0.804-1.14-1.568-1.845-2.274-0.702-0.702-1.469-1.321-2.28-1.854l4.504-4.503c0.459 0.799 1.052 1.563 1.782 2.291 0.745 0.745 1.534 1.348 2.363 1.814zM22.332 9.639c-1.923-1.923-2.664-4.067-2.271-6.653l8.966 9.012c-2.583 0.37-4.738-0.403-6.695-2.36z"></path>
				</svg>
			);
		};
		return () => wrapperElement(svg(), wrapper, wrapStyle);
	},
});


export default defineComponent({});
</script>

<style>
.svg-default{
	display:inline-block;
	/* display:block; */
	position:relative;
	object-fit: contain;
	box-sizing: border-box;
	align-self: center;
}
.bicycle {
	display: inline-block;
	position: absolute;
	transition: transform 25s ease;
}
.translate-bicycle {
	transform: translateX(1550%);
}
</style>
