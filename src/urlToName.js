module.exports = function urlToName(repoUrl) {
  return repoUrl
    .split("/")
    .slice(-1)
    .pop()
    .replace(/\.git$/, "");
};
