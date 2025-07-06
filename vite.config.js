import { resolve } from "path";
import { defineConfig } from "vite";
// Slightly modified from https://github.com/alexlafroscia/vite-plugin-handlebars
// import handlebars from "@glitchdotcom/vite-plugin-handlebars";
import handlebars from "vite-plugin-handlebars";
// const dotenv = require("dotenv");
import * as dotenv from "dotenv";
import { default as rssBuild } from "./rss-build";
import basicSsl from "@vitejs/plugin-basic-ssl";

import settings from "./settings.json";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
	console.log("BUILDING from config", process.env.NODE_ENV);
	let domain =
		process.env.NODE_ENV !== "development"
			? settings.domain
			: "localhost:8085";
	return {
		plugins: [
			basicSsl(),
			{ ...rssBuild(), enforce: "post" },
			handlebars({
				partialDirectory: resolve(__dirname, "layout"),
				reloadOnPartialChange: true,
				context: {
					settings,
					build_meta: {
						domain: domain,
						base_url: "https://" + domain,
					},
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
			strictPort: true,
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
