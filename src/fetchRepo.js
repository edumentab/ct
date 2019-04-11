const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const urlToName = require("./urlToName");

module.exports = async function fetchRepo(repoUrl) {
  const name = urlToName(repoUrl);
  console.log("NAME", name);
  const workingDir = process.cwd();
  const outDir = path.join(workingDir, ".ct/raw");
  await fs.ensureDir(path.join(outDir));
  await fs.remove(path.join(outDir, name));
  await exec(`cd ${outDir}; git clone ${repoUrl}`);
  console.log("Done!");
};
