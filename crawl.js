function normalizeURL(urlString) {
  const { hostname, pathname } = new URL(urlString);
  return `${hostname}${pathname}`;
}

module.exports = { normalizeURL };
