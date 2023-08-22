import _ from 'lodash';

export default {
	install(app) {
		const componentFiles = import.meta.globEager('./components/base/*.vue');
		Object.entries(componentFiles).forEach(([path, m]) => {
			const componentName = _.upperFirst( _.camelCase(path.split('/').pop().replace(/\.\w+$/, '')) );
			app.component(`Base${componentName}`, m.default);
		});
	},
};
