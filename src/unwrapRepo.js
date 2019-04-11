const path = require("path");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const fs = require("fs-extra");

module.exports = async function unwrapRepo(name) {
  console.log("GONNA UNWRAP", name);
  const workingDir = process.cwd();
  const repoDir = path.join(workingDir, ".ct/raw");
  const unfoldedDir = path.join(workingDir, ".ct/unfolded");
  const { stdout } = await exec(`cd ${path.join(repoDir, name)}; git branch`);

  console.log("hmm", stdout);

  const branches = stdout
    .split("\n")
    .map(b => b.replace(/^[\* ]*/, ""))
    .filter(Boolean);

  console.log("WAA", branches);

  await Promise.all(
    branches.map(async branch => {
      await exec(`cd ${path.join(repoDir, name)}; git checkout ${branch}`);
      await fs.ensureDir(path.join(unfoldedDir, name, branch));
      console.log(
        "Gonna copy",
        path.join(repoDir, name),
        "to",
        path.join(unfoldedDir, name, branch)
      );
      await fs.copy(
        path.join(repoDir, name),
        path.join(unfoldedDir, name, branch),
        {
          filter: path => path.indexOf("node_modules") === -1
        }
      );
    })
  );

  console.log("BRANCHES", branches);
};
