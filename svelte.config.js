import preprocess from 'svelte-preprocess';

const config = {
  preprocess: preprocess({
    scss: {
      prependData: `@import 'src/styles.scss';`, // Import global SCSS variables
    },
  }),
  // Other SvelteKit configuration options...
};

export default config;
