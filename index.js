const fs = require('fs');
const http = require('http');
const url = require('url');

// Own created module.
const replaceTemplate = require('./modules/replaceTemplate');

// Third Party module.
// const slugify = require('slugify');

//////// //////////////////////////////////
// FILES
/*
// BLOCKING, SYNCHRONOUS WAY (not recommended)
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${new Date()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");
*/
/*
// NON-BLOCKING, ASYNCHRONOUS WAY (recommended)
// import { readFile } from "node:fs";
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("ERROR! 💥");
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      console.log(data3);
      // Write to file
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("Your file has been written! 🎉");
      });
    });
  });
});
console.log("Will read file!");
*/

//////// //////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API Page
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not Found Page
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not Found!<h1>');
  }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log('Listening to request on the port 8000');
});

// Just to use third party module.
// const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slug);
