import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import {Plugin as ViteFonts} from "vite-plugin-fonts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({compilerOptions: {accessors: true}}),
    ViteFonts({
      google: {
        families: ["Montserrat", "Merriweather Sans", "Material Icons Round"],
      }
    })],
})
