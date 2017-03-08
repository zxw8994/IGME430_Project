const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;


const handleGet = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/getNote':
      jsonHandler.getNote(request, response);
      break;
    case '/notReal':
      jsonHandler.notFound(request, response);
      break;
    /* case '/findNote':

      const res = response;

      request.on('error', (err) => {
        console.dir(err);
        res.statusCode = 400;
        res.end();
      });

      const title = [];

      request.on('data', (chunk) => {
        title.push(chunk);
            // title = chunk;
      });

      request.on('end', () => {
        const titleString = Buffer.concat(title).toString();
        const titleParams = query.parse(titleString);

        jsonHandler.findNote(request, res, titleParams);
      });
      break; */
    default:
      jsonHandler.notFound(request, response);
      break;
  }
};

const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getNote') {
    jsonHandler.getNoteMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addNote') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addNote(request, res, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  switch (request.method) {
    case 'GET':
      handleGet(request, response, parsedUrl);
      break;
    case 'HEAD':
      handleHead(request, response, parsedUrl);
      break;
    case 'POST':
      handlePost(request, response, parsedUrl);
      break;
    default:
      jsonHandler.notFound(request, response);
  }
};


http.createServer(onRequest).listen(PORT);

console.log(`Listening on 127.0.0.1: ${PORT}`);
