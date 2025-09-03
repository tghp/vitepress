import { defineConfig } from 'vite';
import type { UserConfigFn, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import glob from 'glob-promise';

type VitepressOptions = {
  root: string;
  alterConfig?: (config: UserConfig) => UserConfig;
  react?: boolean;
  preact?: boolean;
};

const getError = (error: string) => {
  console.error(error);
  return new Error(error);
};

const vitepress = (options: VitepressOptions) => {
  const {
    root,
    alterConfig,
    react: reactEnabled = false,
    preact: preactEnabled = false,
  } = options;

  if (!root) {
    throw new Error('No path provided');
  }

  const getConfig: UserConfigFn = async ({ command, mode }) => {
    const theme = await glob('src/themes/*');

    if (theme.length === 0) {
      throw getError('No theme found in src/themes');
    } else if (theme.length > 1) {
      throw getError('Multiple themes found in src/themes');
    } else {
      const [mainTheme] = theme;
      const js = await glob(`${mainTheme}/assets/src/js/*.{js,ts}`);
      const sass = await glob(`${mainTheme}/assets/src/sass/*.scss`);

      let config: UserConfig = {
        base: './',
        clearScreen: false,
        build: {
          manifest: true,
          rollupOptions: {
            output: {
              assetFileNames: '[name][extname]',
              chunkFileNames: '[name].js',
              entryFileNames: '[name].js',
            },
            input: [...js, ...sass],
          },
          polyfillModulePreload: false,
          outDir: `${mainTheme}/assets/dist`,
          assetsDir: '',
        },
        resolve: {
          alias: {},
        },
        esbuild: {},
        plugins: [],
      };

      if (
        (!process.argv.includes('build') ||
          (process.argv.includes('build') && process.argv.includes('watch'))) &&
        config.build
      ) {
        config.build.sourcemap = true;
        config.build.minify = false;
      }

      if (mode === 'watch' && config.build) {
        config.build.watch = {
          exclude: ['**/node_modules/**'],
        };
      }

      if ((reactEnabled || preactEnabled) && config.plugins && config.esbuild) {
        if (reactEnabled) {
          config.plugins.push(react());
        }

        config.plugins.push(svgr());

        if (preactEnabled) {
          config.esbuild.jsxFactory = 'h';
          config.esbuild.jsxFragment = 'Fragment';

          if (config.resolve) {
            config.resolve.alias = {
              ...config.resolve.alias,
              react: 'preact/compat',
            };
          }
        }
      }

      if (alterConfig) {
        const alteredConfig = alterConfig(config);

        if (alteredConfig) {
          config = alteredConfig;
        }
      }

      return config;
    }
  };

  return defineConfig(getConfig);
};

export default vitepress;
