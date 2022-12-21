var fs = require('fs');
var nunjucks = require('nunjucks');
var settings = require('settings.json');

module.exports = function(){
  nunjucks.configure({ autoescape: true });
  let feedJson = fs.readFileSync('feed.json', 'utf8');

  let json = JSON.parse(feedJson);

  let itemStrings = settings.links.map((link) => JSON.stringify(link));
  let feedStrings = json.items.map(link => JSON.stringify(link))
  let uniqueItems = new Set(...feedStrings ...)

  fs.writeFileSync('myjsonfile.json', json, 'utf8');
}