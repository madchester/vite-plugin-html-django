
import { ResolvedConfig, Plugin} from 'vite';

interface VitePluginHtmlDjango {
	htmlFileName?:string,
	bundlePath?: string,
	templatePath?: string,
	templateContent?:string
}
// TODO:
// Documentation
const default_config = ((config:VitePluginHtmlDjango) => {
	const {bundlePath} = config;
	if(!bundlePath){
		throw new Error("bundlePath was not defined");
	}
	return {
		rollupOptions: {
			output: {
				assetFileNames: (assetInfo:any) => {
					const names = assetInfo.names || [];
					const originalPath = names.length > 0 ? names.join('/') : 'default';
		  
					const extType = originalPath.split('.').pop();
					const originalFileName = originalPath.split('.').shift();
		  
					if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extType!)) {
						  return `${bundlePath}/images/${originalFileName}.[hash][extname]`;
					} else if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extType!)) {
						  return `${bundlePath}/fonts/${originalFileName}.[hash][extname]`;
					}
					return `${bundlePath}/${originalPath}-[hash][extname]`;
				},
				entryFileNames: `${bundlePath}/[name].[hash].js`,
				chunkFileNames: `${bundlePath}/[name].[hash].js`
			}
		}
	}
})

const VitePluginHtmlDjango = (template_options:VitePluginHtmlDjango):Plugin => {
	const { htmlFileName } = template_options;
	return {
		name: 'vite:plugin-html-django',
		apply: 'build',
		enforce: 'post',
		config(){
			return {
				build: default_config(template_options)
			}
		},
		transformIndexHtml(html, tags) {
			const {bundle} = tags;
			if (!bundle) return html;
			
			let minimalHtmlContent = `{% load static %}\n`;

			for (const [fileName, file] of Object.entries(bundle)) {
				let finalPath = fileName?.replace('static/', '');
				if (file.type === 'asset' && fileName.endsWith('.css')) {
					minimalHtmlContent += `<link rel="stylesheet" href="{% static '${finalPath}' %}">\n`;
				} else if (file.type === 'chunk' && fileName.endsWith('.js')) {
					minimalHtmlContent += `<script type="module" src="{% static '${finalPath}' %}"></script>\n`;
				}
			}
		
			return minimalHtmlContent;
		},
		// @ts-ignore
		generateBundle(options, bundle) {
			if(!htmlFileName){
				throw new Error("htmlFileName was not defined");
			}
			for (const [fileName, file] of Object.entries(bundle)) {
				if (fileName.endsWith('.html') && file.type === 'asset') {
					if(template_options.htmlFileName){
						bundle[htmlFileName] = { ...file, fileName: htmlFileName };
						delete bundle[fileName];
					}
				}
			}
		},

	}
}

export default VitePluginHtmlDjango