const fs = require('fs');
const express = require("express");
const cron = require("node-cron");
const lighthouse = require('lighthouse');
const config = require('lighthouse/lighthouse-core/config/lr-desktop-config.js');
const chromeLauncher = require('chrome-launcher');
const mongodb = require('mongodb');

const urls = [
    'https://www.coach.com/',
    'https://www.stuartweitzman.com/',
    'https://www.katespade.com/',
];

async function runReport(url) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--enable-logging'] });
    const runnerResults = await lighthouse(url, { port: chrome.port }, config);
    setTimeout(() => {chrome.kill().catch(e => console.error(e));}, 2000);
    console.log("Ran report for:", url)
    return runnerResults;
}

async function saveReports(urls) {
    for (const url of urls) {
        const results = await runReport(url);

        // // Save HTML report locally
        // const reportHtml = results.report;
        // const reportFilename = url.replace(/.+\/\/|www.|\..+/g, '') + '.html'
        // fs.writeFileSync(reportFilename, reportHtml);
        // console.log("Saved HTML report for:", url)

        // Convert fetchTime to Date type
        results.lhr.fetchTime = new Date(results.lhr.fetchTime)

        // Insert document into MongoDB
        const MongoClient = mongodb.MongoClient;
        const uri = "mongodb+srv://main_user:Passw0rd@dmalikm10.us76j.mongodb.net/<dbname>?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(function (err, db) {
            if (err) throw err;
            var dbo = db.db("lighthouse");
            dbo.collection("reports").insertOne(results.lhr, { checkKeys: false }, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted with finalUrl:", results.lhr.finalUrl);
                db.close();
            });
        });
    };
}

const app = express();
const port = 5000;

cron.schedule("*/30 * * * *", function () {
    console.log('---------------------');
    console.log('Running cron job');
    saveReports(urls, err => {
        if (err) {
            console.log("Failed run due to", err.message);
        } else {
            console.log("Cron run successful");
        }
    });
});

app.listen(port, () =>
    console.log("Lighthouse service is listening on", port)
);
