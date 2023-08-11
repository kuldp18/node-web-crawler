const { normalizeURL } = require('./crawl');
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
