function printReport(pages) {
  console.log(`===============================================`);
  console.log('  YOUR REPORT  ');
  console.log(`===============================================`);
  const sortedPages = sortPages(pages);
  for (const page of sortedPages) {
    const [url, hits] = page;
    console.log(`Found ${hits} hits to page ${url}`);
  }
  console.log(`===============================================`);
  console.log('  END OF REPORT  ');
  console.log(`===============================================`);
}

function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a, b) => {
    let aHits = a[1];
    let bHits = b[1];

    return bHits - aHits;
  });

  return pagesArr;
}

module.exports = { sortPages, printReport };
