# lighthouse-mongo
Run lighthouse reports on a schedule and insert them into MongoDB!

- Add your own [connection string](https://github.com/dmalik-mdb/lighthouse-mongo/blob/d875419202adeb3068833218a75008167bc420e7/app.js#L32) to get started.

- Edit the [URLs](https://github.com/dmalik-mdb/lighthouse-mongo/blob/d875419202adeb3068833218a75008167bc420e7/app.js#L8-L12) to include your own URLs to test on. 

- Edit the [cron job](https://github.com/dmalik-mdb/lighthouse-mongo/blob/d875419202adeb3068833218a75008167bc420e7/app.js#L49) to your liking.

- You can save your reports locally as HTML by adding the following block to saveReports()
```
const reportHtml = results.report;
const reportFilename = url.replace(/.+\/\/|www.|\..+/g, '') + '.html'
fs.writeFileSync(reportFilename, reportHtml);
```
