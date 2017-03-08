const crypto = require('crypto');

const note = {};

const etag = crypto.createHash('sha1').update(JSON.stringify(note));
const digest = etag.digest('hex');

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};


const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.end();
};


const getNote = (request, response) => {
  const responseJSON = {
    note,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getNoteMeta = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }
  return respondJSONMeta(request, response, 200);
};

/*
const findNote = (request, response, ntTitle) => {
  const responseJSON = {
        // note[ntTitle],
    searched: '',
  };

  responseJSON.searched = note[ntTitle];

  return respondJSON(request, response, 200, responseJSON);
}; */


const addNote = (request, response, body) => {
  const responseJSON = {
    message: 'Title and content are both required.',
  };

  if (!body.title || !body.note) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (note[body.title]) {
    responseCode = 204;
  } else {
    note[body.title] = {};
  }

  note[body.title].title = body.title;
  note[body.title].note = body.note;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};


const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};


module.exports = {
  getNote,
  getNoteMeta,
  // findNote,
  addNote,
  notFound,
  notFoundMeta,
};

