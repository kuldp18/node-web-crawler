const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log(`Actively crawling ${currentURL}....`);
  try {
    const res = await fetch(currentURL);
    if (res.status > 399) {
      console.log(
        `Error in fetch with status code ${res.status}, on url: ${currentURL}`
      );
      return pages;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(
        `Fetched non-html response of type: ${contentType}, on url: ${currentURL}`
      );
      return pages;
    }

    const htmlBody = await res.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.log(`Error in fetching: ${error.message}, url: ${currentURL}`);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll('a');
  for (const linkElement of linkElements) {
    if (linkElement.href[0] === '/') {
      //relative url
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with relative url: ${err.message}`);
      }
    } else {
      // absolute url
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with absolute url: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const { hostname, pathname } = new URL(urlString);
  const hostPath = `${hostname}${pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = { normalizeURL, getURLsFromHTML, crawlPage };
