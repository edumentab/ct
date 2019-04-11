const command = process.argv[2];

const readConfig = require("./readConfig");
const fetchRepo = require("./fetchRepo");
const unwrapRepo = require("./unwrapRepo");
const urlToName = require("./urlToName");

(async () => {
  const config = await readConfig();
  for (url of config.repos) {
    //await fetchRepo(url);
    await unwrapRepo(urlToName(url));
  }
})();
