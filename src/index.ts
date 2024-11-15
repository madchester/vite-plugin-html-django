
import { ResolvedConfig, Plugin} from 'vite';

interface VitePluginHtmlDjango {
	htmlFileName?:string,
	bundlePath?: string,
	templatePath?: string,
	templateContent?:string
}
// TODO:
// include svg on the bundle path directory
// Documentation

const VitePluginHtmlDjango = (template_options:VitePluginHtmlDjango):Plugin => {
	return {
		name: 'vite:plugin-html-django',
		apply: 'build',
		enforce: 'post',
		config(){
			if(template_options && template_options.hasOwnProperty("bundlePath")){
				return {
					build: {
						rollupOptions: {
							output: {
								assetFileNames: `${template_options.bundlePath}/[name].[hash][extname]`, // Custom asset directory
								entryFileNames: `${template_options.bundlePath}/[name].[hash].js`,
								chunkFileNames: `${template_options.bundlePath}/[name].[hash].js`
							}
						}
					}
				}
			}
		},
		transformIndexHtml(html, ctx) {
			const {bundle} = ctx;
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
			for (const [fileName, file] of Object.entries(bundle)) {
				if (fileName.endsWith('.html') && file.type === 'asset') {
					if(template_options.htmlFileName){
						bundle[template_options.htmlFileName] = { ...file, fileName: template_options.htmlFileName };
						delete bundle[fileName];
					}
				}
			}
		},

	}
}

export default VitePluginHtmlDjango