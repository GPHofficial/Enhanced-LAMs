const express = require('express')
const fileUpload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');  
const url = require('url');  
const querystring = require('querystring');  
const shell = require('shelljs');
const path = require('path');

app.use(fileUpload({createParentPath: true}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
  if (req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
});

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

app.use(express.static(path.join(__dirname, '../videos')));

app.post('/api/v1/video', function(req, res) {
     res.header('Access-Control-Allow-Origin', '*');
  	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	console.log("ran");
    req.setTimeout(9999999999)
    if (Object.keys(req.files).length == 0){
        return res.status(400).send('No files were uploaded.');
    }
 
    var sampleFile = req.files['files'];
    var fileName = req.body.fileName;
	console.log(fileName)
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('../videos/' + fileName + '/video.mp4', function(err) {
        if (err)
            return res.status(500).send(err);
        
	res.send('File uploaded!');
	shell.exec('./processVideo.sh ' + fileName + ' > /dev/null', {async:true});
    });
});

const PORT = 80;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
