#! /usr/bin/env node

const https = require('https');
const fs = require('fs');
const util = require('util');
const child = require('child_process');

const fsUnlink = util.promisify(fs.unlink);
const childExec = util.promisify(child.exec);

function get(url, options = {}) {
  options.method = options.method || 'GET';

  return new Promise((resolve, reject) => {
    https.get(url, options, (resp) => {
      if (resp.statusCode === 302) {
        resolve(get(resp.headers.location, options));
      } else {
        resolve(resp);
      }
    }).on("error", err => {
      reject(err);
    });
  });
}

async function fetchLatest() {
  const resp = await get(
    'https://api.github.com/repos/luvies/rbpi-temp-readings/releases/latest', {
      headers: {
        'User-Agent': 'luvies',
      },
    });
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', chunk => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  return new Promise(resolve => {
    resp.on('end', () => {
      resolve(JSON.parse(data));
    });
  });
}

async function download(url, dest) {
  var file = fs.createWriteStream(dest);

  try {
    const resp = await get(url);
    resp.pipe(file);

    await new Promise(resolve => {
      file.on('finish', function () {
        file.close(resolve);
      });
    })
  } catch (err) {
    await fsUnlink(dest);
    throw err;
  }
};

async function main() {
  console.log('Fetching latest release...');
  const latest = await fetchLatest();
  const asset = latest.assets[0];
  if (asset) {
    console.log('Downloading primary asset from release...');
    const baseServer = 'server';
    const output = 'rbpi-readings-server';
    await download(asset.browser_download_url, `${output}.zip`);
    console.log('Preparing to install latest server...');
    await Promise.all([
      childExec(`unzip ${output} -d ${output}`),
      childExec(`mkdir -p ${baseServer}`)
    ])
    console.log('Installing latest server and cleaning up...');
    await childExec(`rm -rf ${baseServer}/*`);
    await Promise.all([
      childExec(`cp -rf ${output}/* ${baseServer}/`),
      childExec(`rm -rf ${output}.zip`)
    ]);
    await childExec(`rm -rf ${output}`);
    console.log('Done!');
  } else {
    console.error('Latest release does not have any assets, unable to download latest version');
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
})
