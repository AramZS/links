import fs from "fs";
import nunjucks from "nunjucks";

function generateRssFeed() {
	var nj = new nunjucks.Environment(new nunjucks.FileSystemLoader("layout"), {
		autoescape: true,
	});
	let feedJson = fs.readFileSync("feed.json", "utf8");
	let settingsText = fs.readFileSync("settings.json", "utf8");

	let json = JSON.parse(feedJson);
	// console.log('json', json.items)
	let settings = JSON.parse(settingsText);
	// console.log('settings', settings.links)

	let itemStrings = settings.links.map((link) => {
		// link.date_published = ((new Date).toUTCString())
		return JSON.stringify(link);
	});
	let feedStrings = json.items.map((link) => JSON.stringify(link));
	//console.log('strings', itemStrings, feedStrings)
	let uniqueItems = new Set();
	itemStrings.forEach((string) => uniqueItems.add(string));
	feedStrings.forEach((string) => uniqueItems.add(string));
	let itemList = Array.from(uniqueItems);
	// console.log('rss itemlist', itemList)

	let finalJson = Object.assign(json, {
		title: settings.metaTitle,
		home_page_url: `https://${settings.domain}`,
		feed_url: `https://${settings.domain}/rss/index.xml`,
		description: settings.metaDescription,
		icon: `https://aramzs.xyz/feed-img.svg`,
		favicon: `https://aramzs.xyz/feed-img.svg`,
		authors: [
			{
				name: settings.name,
				url: settings.authorUrl,
				avatar: settings.avatarImage,
				email: settings.social.email,
			},
		],
		builddate: new Date().toUTCString(),
		language: "en-US",
		items: itemList.map((item) => {
			var item = JSON.parse(item);
			// item.date_published = item.date_published ? item.date_published : ((new Date).toUTCString());
			// 		<pubDate>{{ item.date_published }}</pubDate>
			return item;
		}),
	});

	fs.writeFileSync("feed.json", JSON.stringify(json, null, 1), "utf8");
	const feed = nj.render("rss.njk", finalJson);

	fs.writeFileSync("public/rss/index.xml", feed, "utf8");
	//console.log('feed', feed)
	try {
		fs.mkdirSync("build/rss", { recursive: true });
	} catch (err) {
		if (err.code !== "EEXIST") throw err;
		console.log("build/rss exists");
	}
	fs.writeFileSync("build/rss/index.xml", feed, "utf8");
}

export default function rssBuildPlugin() {
	return {
		name: "rss-build",
		buildStart() {
			// Generate RSS feed when build starts
			generateRssFeed();
		},
		configureServer(server) {
			// Also generate RSS feed during development
			generateRssFeed();
		},
		configResolved(config) {
			// Ensure the public directory is created
			generateRssFeed();
		},
	};
}
