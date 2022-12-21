var fs = require('fs');
var nunjucks = require('nunjucks');

module.exports = function(){
  nunjucks.configure({ autoescape: true });
  let feedJson = fs.readFileSync('feed.json', 'utf8');
  let settingsText = fs.readFileSync('settings.json', 'utf8');

  let json = JSON.parse(feedJson);
  console.log('json', json.items)
  let settings = JSON.parse(settingsText);
  console.log('settings', settings.links)

  let itemStrings = settings.links.map((link) => JSON.stringify(link));
  let feedStrings = json.items.map(link => JSON.stringify(link))
  console.log('strings', itemStrings, feedStrings)
  let uniqueItems = new Set(...itemStrings, ...feedStrings);
  let itemList = Array.from(uniqueItems);
  console.log('itemlist', itemList)
  
  let finalJson = Object.assign(json, {
    title: settings.metaTitle,
    home_page_url: `https://${process.env.PROJECT_DOMAIN}.glitch.me/`,
    feed_url: `https://${process.env.PROJECT_DOMAIN}.glitch.me/rss`,
    description: settings.metaDescription,
    icon: `https://cdn.glitch.me/efc5414a-882b-4708-af81-8461abbc1a82%2Ftouch-icon.png?v=1633521972305`,
    favicon: `https://cdn.glitch.me/efc5414a-882b-4708-af81-8461abbc1a82%2Ftouch-icon.png?v=1633521972305`,
    authors: [
      {
        name: settings.name,
        url: settings.authorUrl,
        avatar: settings.avatarImage
      }
    ],
    language: "en-US",
    items: itemList.map(item => JSON.parse(item))
  })

  fs.writeFileSync('feed.json', JSON.stringify(json, null, 1), 'utf8');
}