/* playlists uber example */

var fs = require('fs');
var http = require('http');
var querystring = require('querystring');

var g = {};
g.host = '0.0.0.0';
g.port = (process.env.PORT ? process.env.PORT : 3001);

/* internal test data */
g.list = [];
g.list[0] = {id:001,source:'http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv',type:'video/ogv',caption:'http://camendesign.com/code/video_for_everybody/poster.jpg',text:'Big Buck Bunny'};
g.list[1] = {id:002,source:'http://demosthenes.info/assets/videos/nambia1.mp4',type:'video/mp4',caption:'http://demosthenes.info/assets/images/nambia1.jpg',text:'Namibia Timelapse'};
g.list[2] = {id:003,source:'http://www.808.dk/pics/video/gizmo.webm',type:'video/webm',caption:'http://developer.html5dev-software.intel.com/images/Video_Placeholder.png',text:'Gizmo'};

// main entry point
function handler(req, res) {

  var m = {};
  m.video = {};
  m.filter = '';
  
  // internal urls
  m.homeUrl = '/';
  m.listUrl = '/playlists/';
  m.scriptUrl = '/playlists.js';
  m.filterUrl = '/playlists/search';
  m.completeUrl = '/playlists/complete/';
//  m.posterUrl = 'http://developer.html5dev-software.intel.com/images/Video_Placeholder.png';

  // media-type identifiers
  m.uberJson  = {'content-type':'application/json'};
  m.textHtml = {'content-type':'text/html'};
  m.appJS = {'content-type':'application/javascript'};
  m.appXml = {'content-type':'application/xml'};

  // add support for CORS
  var headers = {
    'Content-Type' : 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : '*',
    'Access-Control-Allow-Headers' : '*'
  };


  // hypermedia controls
  m.errorMessage = '{"uber":{"version":"1.0","error":{"data":[{"id":"status","status":"{status}"},{"id":"message","message":"{msg}"}]}}}';
  m.addControl = '{"id":"add","rel":"add","name":"links","url":"/playlists/","action":"append","model":"text={text}"}';
  m.filterControl = '{"id":"search","rel":"search","name":"links","url":"/playlists/search","action":"read","model":"?text={text}"}';
  m.listControl = '{"id":"list","rel":"collection","name":"links","url":"/playlists/","action":"read"}';
  m.completeControl = '{"rel":"complete","url":"/playlists/complete/","model":"id={id}","action":"append"}';
  m.videoControl = '{"id":"video#{id}","rel":"item","name":"playlists"},[{complete},{"data":[{"name":"source"},"{source}",{"name":"type"},"{type}",{"name":"caption"},"{caption}",{"name":"text"},"{text}"]}]';
  m.posterControl = '{"id":"poster","rel":"icon","url":"http://files.tested.com/uploads/0/5/35506-html5_teaser.jpg","action":"read"}';

  main();

  /* process requests */
  function main() {
    var url;

    // check for a search query
    if(req.url.indexOf(m.filterUrl)!==-1) {
      url = m.filterUrl;
      m.filter = req.url.substring(m.filterUrl.length,255).replace('?text=','');
    }
    else {
      url = req.url;
    }
    console.log("receiving url "+ url);

    // handle CORS OPTIONS call
    if(req.method==='OPTIONS') {
        var body = JSON.stringify(headers);
        showResponse(req, res, body, 200);
    }

    // process request
    switch(url) {
      case m.homeUrl:
        switch(req.method) {
          case 'GET':
            showHtml();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.scriptUrl:
        switch(req.method) {
          case 'GET':
            showScript();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
/*
      case m.profileUrl:
        switch(req.method) {
          case 'GET':
            showProfile();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
*/
      case m.listUrl:
        switch(req.method) {
          case 'GET':
            sendList();
            break;
          case 'POST':
            addToList();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.filterUrl:
        switch(req.method) {
          case 'GET':
            searchList();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      case m.completeUrl:
        switch(req.method) {
          case 'POST':
            completeItem();
            break;
          default:
            showError(405, 'Method not allowed');
            break;
        }
        break;
      default:
        showError(404, 'Page not found');
        break;
    }
  }

  /* 
    show list of videos

    /playlists/
 
  */
  function sendList() {
    var msg, i, x;

    msg = makeUber(g.list,false);
    res.writeHead(200, 'OK', m.uberJson);
    console.log("sending json "+ g.list.length);
    res.end(msg);
  }

  /* 
     search the list

     /playlists/search?text={text} 

  */
  function searchList() {
    var coll, i, x, msg;

    coll = [];
    for(i=0,x=g.list.length;i<x;i++) {
      if(g.list[i].text.indexOf(m.filter)!==-1) {
        coll.push(g.list[i]);
      }
    }

    msg = makeUber(coll,true);
    res.writeHead(200, 'OK', m.uberJson);
    res.end(msg);
  }

  /* 
     add video to list

     /playlists/
     text={text} 

  */
  function addToList() {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {
      m.video = querystring.parse(body);
      sendAdd();
    });
  }
  function sendAdd() {
    var video;

    video = {};
    video.id = g.list.length;
    video.text = m.video.text;
    g.list.push(video);

    res.writeHead(204, "No content");
    res.end();
  }

  /* 
     complete single video

     /playlists/complete/
     id={id} 

  */
  function completeItem() {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk.toString();
    });

    req.on('end', function() {
      m.video = querystring.parse(body);
      sendComplete();
    });
  }
  function sendComplete() {
    var tlist, i, x;

    //build new list
    tlist = [];
    for(i=0,x=g.list.length;i<x;i++) {
      if(g.list[i].id!=m.video.id) {
        tlist.push(g.list[i]);
      }
    }
    g.list = tlist.slice(0);

    res.writeHead(204, "No content");
    res.end();
  }

  /* generate uber representation */
  function makeUber(list, showControls) {
    var i, x, msg;

    msg  = '{"uber":{"version": "1.0",';
    msg += '"data": [{"id":"links","data":[';
    msg += m.posterControl;

    if(list.length>0 || showControls===true) {
      msg += ','+ m.listControl;
      msg += ','+ m.filterControl;
    }
    msg += ','+ m.addControl;
    msg += ']},';
    msg += '{"id":"playlists","data":[';
    for(i=0,x=list.length;i<x;i++) {
      msg += m.videoControl
        .replace('{complete}',m.completeControl)
        .replace(/{id}/gi,list[i].id)
        .replace(/{source}/gi,list[i].source)
        .replace(/{type}/gi,list[i].type)
        .replace(/{caption}/gi,list[i].caption)
        .replace(/{text}/gi,list[i].text);
      msg += ',';
    }
    /* strip last comma if there is one */
    if(list.length>0) { 
      msg = msg.substring(0,msg.length-1);
    }
    msg += ']';
    msg += '}]}}';

    return msg;
  }

  /* show html page */
  function showHtml() {
    fs.readFile('index.html', 'ascii', sendHtml);
  }
  function sendHtml(err, data) {
    if (err) {
      showError(500, err.message);
    }
    else {
      res.writeHead(200, "OK",m.textHtml);
      res.end(data);
    }
  }

  /* show script file */
  function showScript() {
    fs.readFile('playlists.js', 'ascii', sendScript);
  }
  function sendScript(err, data) {
    if (err) {
      showError(500, err.message);
    }
    else {
      res.writeHead(200, "OK",m.appJS);
      res.end(data);
    }
  }

  /* show profile document */
  function showProfile() {
    fs.readFile('playlists-alps.json', 'ascii', sendProfile);
  }
  function sendProfile(err, data) {
    if (err) {
      showError(500, err.message);
    }
    else {
      res.writeHead(200, "OK",m.appXml);
      res.end(data);
    }
  }

  /* show error page */
  function showError(status, msg) {
    res.writeHead(status, msg, m.uberJson);
    res.end(m.errorMessage.replace('{status}', status).replace('{msg}', msg));
  }
}

// return response to caller
function showResponse(req, res, body, code) {
    res.writeHead(code,headers);
    res.end(body);
}

// listen for requests
http.createServer(handler).listen(g.port, g.host);

// ***** END OF FILE *****
