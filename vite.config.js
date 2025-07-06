import { resolve } from "path";
import { defineConfig } from "vite";
// Slightly modified from https://github.com/alexlafroscia/vite-plugin-handlebars
// import handlebars from "@glitchdotcom/vite-plugin-handlebars";
import handlebars from "vite-plugin-handlebars";
import { default as rssBuild } from "./rss-build";
import basicSsl from "@vitejs/plugin-basic-ssl";

import settings from "./settings.json";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
	console.log("BUILDING from config");

	return {
		plugins: [
			basicSsl(),
			{ ...rssBuild(), enforce: "post" },
			handlebars({
				partialDirectory: resolve(__dirname, "layout"),
				settingsFile: "settings.json",
				reloadOnPartialChange: true,
				context: {
					settings,
				},
			}),
		],
		build: {
			cssCodeSplit: false,
			outDir: "build",
		},
		optimizeDeps: {
			exclude: ["./settings.json"],
		},
		server: {
			strictPort: false,
			port: 8085,
			hmr: {
				port: 443,
			},
		},
		preview: {
			strictPort: false,
			port: 8084,
		},
	};
});
