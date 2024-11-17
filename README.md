# vite-plugin-html-django

Plugin that creates generates an HTML file dynamically, embedding all necessary static assets (JavaScript, CSS, etc.) bundled by Vite.js. Inspired from html-webpack-plugin-django

## Key Features

- Automatically includes Vite-bundled assets in the generated HTML ensuring correct file paths.
- Compatible with Django’s /templates folder for easy integration.
- Allows you to specify the Vite build output directory via configuration options.

# Get Started

Install the package

```bash
npm install --save-dev vite-plugin-html-django
```
```bash
yarn add --dev vite-plugin-html-django
```

- Configure in `vite.config.ts`

```ts
import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

import VitePluginHtmlDjango from 'vite-plugin-html-django'

export default defineConfig({
    plugins: [
        VitePluginHtmlDjango({
            bundlePath: "static/js/my-app",
            /**
             * relative path to the static folder of the app
            */
            htmlFileName: "templates/my-app.html"
            /**
             * relative path to the template folder of the app
            */
        })
    ]
})
```

## Output

```html
{% load static %}
<link rel="stylesheet" href="{% static 'js/my-app/index.n_ryQ3BS.css' %}">
<script type="module" src="{% static 'js/my-app/index.olF0dh3Q.js' %}"></script>
```

