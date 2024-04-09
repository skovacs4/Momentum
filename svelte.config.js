import preprocess from 'svelte-preprocess';

/** 
 * This will add autocompletion if you're working with SvelteKit
 * 
 * @type {import('@sveltejs/kit').Config} 
 */
const config = {
  preprocess: preprocess({
    scss: {
      prependData: `@import 'src/styles.scss';`, // Optional: Import global SCSS variables
    },
  }),
  // ...other SvelteKit options
};

export default config;
