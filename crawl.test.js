const { normalizeURL, getURLsFromHTML } = require('./crawl');
const { test, expect } = require('@jest/globals');

test('normalizeURL: Strip protocol', () => {
  const input = 'https://blog.boot.dev/path';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeURL: Strip trailing slashes', () => {
  const input = 'https://blog.boot.dev/path/';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeURL: Convert to lowercase', () => {
  const input = 'https://BLOG.boot.dev/path/';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeURL: Strip http', () => {
  const input = 'http://blog.boot.dev/path/';
  const actual = normalizeURL(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('getURLsFromHTML: Absolute urls', () => {
  const inputHTMLBody = `
  <html>
    <body>
        <a href="https://blog.boot.dev/">
            Boot.dev blog
        </a>
    </body>
  </html>
  `;

  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ['https://blog.boot.dev/'];
  expect(actual).toEqual(expected);
});

test('getURLsFromHTML: Relative urls', () => {
  const inputHTMLBody = `
  <html>
    <body>
        <a href="/path/">
            Boot.dev blog
        </a>
    </body>
  </html>
  `;

  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ['https://blog.boot.dev/path/'];
  expect(actual).toEqual(expected);
});

test('getURLsFromHTML: Both urls', () => {
  const inputHTMLBody = `
  <html>
    <body>
        <a href="https://blog.boot.dev/path1/">
            Boot.dev blog path one
        </a>

        
        <a href="/path2/">
            Boot.dev blog path two
        </a>
    </body>
  </html>
  `;

  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    'https://blog.boot.dev/path1/',
    'https://blog.boot.dev/path2/',
  ];
  expect(actual).toEqual(expected);
});

test('getURLsFromHTML: Invalid urls', () => {
  const inputHTMLBody = `
  <html>
    <body>
        <a href="invalid">
            Invalid url
        </a>
    </body>
  </html>
  `;

  const inputBaseURL = 'https://blog.boot.dev';
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(actual).toEqual(expected);
});
