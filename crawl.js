const { JSDOM } = require('jsdom');

async function crawlPage(currentURL) {
  console.log(`Actively crawling ${currentURL}....`);

  try {
    const res = await fetch(currentURL);
    if (res.status > 399) {
      console.log(
        `Error in fetch with status code ${res.status}, on url: ${currentURL}`
      );
      return;
    }

    const contentType = res.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(
        `Fetched non-html response of type: ${contentType}, on url: ${currentURL}`
      );
      return;
    }

    const data = await res.text();
    console.log(data);
  } catch (error) {
    console.log(`Error in fetching: ${error.message}, url: ${currentURL}`);
  }
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
