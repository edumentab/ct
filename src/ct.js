const command = process.argv[2];

const readConfig = require("./readConfig");
const fetchRepo = require("./fetchRepo");
const unwrapRepo = require("./unwrapRepo");
const printRepo = require("./printRepo");
const urlToName = require("./urlToName");

(async () => {
  const config = await readConfig();
  for (url of config.repos) {
    const name = urlToName(url);
    //await fetchRepo(url);
    await unwrapRepo(name);
    const out = await printRepo(name);
    console.log("PRINT", out);
  }
})();
