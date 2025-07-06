import { resolve } from "path";
import { defineConfig } from "vite";
// Slightly modified from https://github.com/alexlafroscia/vite-plugin-handlebars
import handlebars from "@glitchdotcom/vite-plugin-handlebars";
import rssBuild from "./rss-build";
import basicSsl from "@vitejs/plugin-basic-ssl";
// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
	console.log("BUILDING from config");

	return {
		plugins: [
			basicSsl(),
			rssBuild(),
			handlebars({
				partialDirectory: resolve(__dirname, "layout"),
				settingsFile: "settings.json",
				helpers: {
					hostasclass: (value) =>
						new URL(value).hostname.replace(/\./g, "_"),
				},
				reloadOnPartialChange: true,
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
