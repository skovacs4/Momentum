import preprocess from 'svelte-preprocess';

/** 
 * This will add autocompletion if you're working with SvelteKit
 * 
 * @type {import('@sveltejs/kit').Config} 
 */
const config = {
  kit: {
    // Specify target adapter, e.g., 'adapter-static' for static hosting
    // adapter: 'adapter-static',
    // ...other SvelteKit options
  },
  preprocess: preprocess({
    scss: {
      prependData: `@import 'src/styles.scss';`, // Optional: Import global SCSS variables
    },
    postcss: {
      plugins: [
        // @ts-ignore
        require('autoprefixer'), // Add autoprefixer plugin for vendor prefixing
        // Add other PostCSS plugins here as needed
      ],
    },
  }),
};

export default config;
