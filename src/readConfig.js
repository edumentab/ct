const fs = require("fs-extra");
const path = require("path");

module.exports = async function readConfig() {
  const workingDir = process.cwd();
  const buffer = await fs.readFile(path.join(workingDir, "ct.config.json"));
  return JSON.parse(buffer.toString());
};
