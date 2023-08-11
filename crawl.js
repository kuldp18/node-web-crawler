function normalizeURL(urlString) {
  const { hostname, pathname } = new URL(urlString);
  const hostPath = `${hostname}${pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = { normalizeURL };
