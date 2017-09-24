var express = require('express');
var router = express.Router();
var https = require('https');
const apiai = require('apiai');

let msgPath ='';
let coordsArry = [];


const ai = async (req, res, next) => {
  var app = apiai("ada56cc499b24f979d9f85c035efbba9");
  var ai = app.textRequest(req.body.msg, {
    sessionId: '1132111'
  });
  ai.on('response', function(response) {
    console.log(response);
    res.json(response);
  });
  ai.on('error', function(error) {
    console.log(error);
  });
  ai.end();
};

const ask = async (req, res, next) => {

  if(req.body && Object.getOwnPropertyNames(req.body).length > 0) {
    msgDeets = await send(req.body.msg);

    if (req.body.location !== '') {
      coordsArry.push(req.body.location);
    }
    res.json({
      msg: "Message has been sent!"
    });

  }
  if (!req.params.msg) {
    res.render('ask');
  }
  // else {
  //  res.send(req.params.msg);
  //}
};

const index = (req, res, next) => {
  res.send('respond with a resource');
};

const send = async (msg) => {

  let postData = {
    message_sid: new Date(),
    account_sid: process.env.APIFONICA_ACCOUNT_SSID,
    from: process.env.NEEDS_HELP,
    to: process.env.GIVES_HELP,
    text: msg
  };

  const options = {
    hostname: process.env.APIFONICA_BASE,
    path: '/v2/accounts/' + process.env.APIFONICA_ACCOUNT_SSID + '/messages',
    method: 'POST',
    auth: process.env.APIFONICA_ACCOUNT_SSID + ':' + process.env.APIFONICA_AUTH_TOKEN,
    headers: {
      'Content-Type': 'application/json'
    }
  };


  const sendr = await https.request(options, (resp) => {
    console.log(`STATUS: ${resp.statusCode}`);
    resp.setEncoding('utf8');
    resp.on('data', (chunk) => {
      //console.log(`BODY: ${chunk}`);
      //getMsg(chunk);
    });
    resp.on('end', () => {
      console.log('getting here');
      return 'woo-hoo';
    });
  });

  sendr.on('error', (e) => {
    console.log(e);
    console.error(`problem with request: ${e.message}`);
  });

  // write data to request body
  sendr.write(JSON.stringify(postData));
  sendr.end();
};

const getMsg = (uri) => {
  chunk = JSON.parse(uri);

  console.log(chunk);

  const options = {
    hostname: process.env.APIFONICA_BASE,
    path: chunk.uri,
    method: 'POST',
    auth: process.env.APIFONICA_ACCOUNT_SSID + ':' + process.env.APIFONICA_AUTH_TOKEN,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  https.get(options, function(req, res) {
    console.log('req = ', req);
    console.log('res = ', res);
  });
};

const processMsg = (msg) => {

}

router.get('/', index);
router.get('/ask', ask);
router.post('/ask', ask);
router.post('/ask/ai', ai);
router.get('/ask/:msg', ask);
router.get('/send', send);


module.exports = router;
