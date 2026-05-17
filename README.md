# NovaCart Ecommerce Demo

Static ecommerce application built with HTML, CSS, and JavaScript.

## Run locally

Open `index.html` in a browser, or serve the folder with any static server.

## Deploy to Netlify

1. Create a new Netlify site.
2. Upload this folder or connect it to a Git repository.
3. Use these settings:
   - Build command: leave empty
   - Publish directory: `.`

The included `netlify.toml` already points Netlify at the project root.

## Deploy to Render

This project is also compatible with Render as a Static Site.

### Dashboard settings

- Service type: Static Site
- Build command: `true`
- Publish directory: `.`

### Blueprint deploy

The included `render.yaml` defines the same settings for Render Blueprints:

- Runtime: static
- Static publish path: `.`
- No application build step
- Security and cache headers
- Rewrite fallback to `index.html`
