import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/tailwind-config';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Pick<
  Config,
  'prefix' | 'presets' | 'content' | 'darkMode' | 'plugins'
> = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx,css}',
  ],
  prefix: '',
  presets: [sharedConfig],
  plugins: [tailwindcssAnimate],
};

export default config;
