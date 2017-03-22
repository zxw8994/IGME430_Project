const crypto = require('crypto');

const note = {};
let addedTitle;
let addedBody;

let noteTitle;
let noteBody;

const etag = crypto.createHash('sha1').update(JSON.stringify(note));
const digest = etag.digest('hex');

// responds to user with json
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

// returns the last added note Title and Body
const getNote = (request, response) => {
  const responseJSON = {
    addedTitle,
    addedBody,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getNoteMeta = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }
  return respondJSONMeta(request, response, 200);
};

// adds note from POST to json object
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

  addedTitle = '';
  addedBody = '';

  note[body.title].title = body.title;
  note[body.title].note = body.note;

  addedTitle = note[body.title].title;
  addedBody = note[body.title].note;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// takes note Title from POST and checks if it exists in the json object. If so
// it changes the noteTitle and noteBody lets into that notes title and body
const findNote = (request, response, ntTitle) => {
  const responseJSON = {
        // note[ntTitle],
    message: 'Title is required',
  };

  const responseCode = 201;

  if (!ntTitle.title || !note[ntTitle.title]) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }


  noteTitle = note[ntTitle.title].title;
  noteBody = note[ntTitle.title].note;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// returns two lets containing the title and body of searched note
const returnNote = (request, response) => {
  const responseJSON = {
    // Title,
    noteTitle,
    noteBody,
  };

  return respondJSON(request, response, 200, responseJSON);
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
  findNote,
  addNote,
  returnNote,
  notFound,
  notFoundMeta,
};

