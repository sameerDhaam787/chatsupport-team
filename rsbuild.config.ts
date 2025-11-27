import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  plugins: [pluginReact()],

  server: {
    port: 3004,  // ← Different port for team
  },

  output: {
    publicPath: 'http://localhost:3004/',
  },

  tools: {
    postcss: (config) => {
      config.postcssOptions = {
        plugins: ['@tailwindcss/postcss'],
      };
    },

    rspack: {
      experiments: {
        moduleFederation: true,
      },
      output: {
        uniqueName: 'team',
        publicPath: 'auto',
      },
      plugins: [
        new ModuleFederationPlugin({
          name: 'team',
          filename: 'remoteEntry.js',

          exposes: {
            './App': './src/App.tsx',
          },

          shared: {
            react: { singleton: true, eager: true },
            'react-dom': { singleton: true, eager: true },
            'react-router-dom': { singleton: true, eager: true },
            'lucide-react': { singleton: true, eager: true },
          },

          dts: false,
        }),
      ],
    },
  },
});