const path = require("path");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const fs = require("fs-extra");

module.exports = async function unwrapRepo(name) {
  const workingDir = process.cwd();
  const repoDir = path.join(workingDir, ".ct/raw");
  const unfoldedDir = path.join(workingDir, ".ct/unfolded");
  const { stdout } = await exec(
    `cd ${path.join(repoDir, name)}; git branch -a`
  );

  const branches = stdout
    .split("\n")
    .map(b => b.replace(/^[\* ]*/, ""))
    .map(b =>
      b
        .split("origin/")
        .slice(-1)
        .pop()
    )
    .filter(Boolean)
    .filter((b, n, list) => list.slice(n + 1).indexOf(b) === -1);

  for (branch of branches) {
    await exec(`cd ${path.join(repoDir, name)}; git checkout ${branch}`);
    const hasCTfile = await fs.exists(
      path.join(repoDir, name, `.ct/${branch}.md`)
    );
    if (hasCTfile) {
      await fs.remove(path.join(unfoldedDir, name, branch));
      await fs.ensureDir(path.join(unfoldedDir, name, branch));
      await fs.copy(
        path.join(repoDir, name),
        path.join(unfoldedDir, name, branch),
        {
          filter: path => path.indexOf("node_modules") === -1
        }
      );
    } else {
      console.log(
        "Branch",
        branch,
        "in repo",
        name,
        `didnt have a .ct/${branch}.md file!`
      );
    }
  }

  console.log("Unwrapped", name);
};
