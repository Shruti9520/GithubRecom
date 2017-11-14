var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Datastore = require('nedb');
var qs = require('querystring');
var github = require('octonode');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require("http");
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var request = require('request');
var jwt = require('jwt-simple');

var index= require('./routes/index');
var tasks= require('./routes/tasks');

var port = 3000;
var myApp = express();

// View Engine
myApp.use(bodyParser.json());
myApp.set('views', path.join(__dirname, 'views'));
myApp.set('view engine', 'ejs');
myApp.engine('html', require('ejs').renderFile);

//set Static Folder
//myApp.use(express.static(path.join(__dirname,'bower_components')));
myApp.use(express.static('client'));

//Body Parser MW
myApp.use(bodyParser.json());
myApp.use(bodyParser.urlencoded({extended: false}));

myApp.use('/',index);
myApp.use('/api',tasks);

db = {};
db.users = new Datastore({ filename: 'db/users.db', autoload: true });

myApp.post('/auth/github', function(req, res) {
     console.log("Github auth1");
    var accessTokenUrl = 'https://github.com/login/oauth/access_token';
    var params = {
        code: req.body.code,
        client_id: 'c915274b9f730289a5f0',
        client_secret: '3fdc6d25f477ad2357688dc73d0627c4162ad8cb',
        redirect_uri: 'http://localhost:3000/'
    };
    // Exchange authorization code for access token.
     console.log("Github auth2");
    request.post({ url: accessTokenUrl, qs: params }, function(err, response, token) {
          console.log("Github auth3");
         var access_token = qs.parse(token).access_token;
         var github_client = github.client(access_token);

         // Retrieve profile information about the current user.
         github_client.me().info(function(err, profile){
              console.log("Github auth4");
            if(err){
                return res.status(400).send({ message: 'User not found' });
                 console.log("Github auth5");
            }

            var github_id = profile['id'];
            var user = { _id: github_id, oauth_token: access_token }
             console.log("Github auth6");
            db.users.find({ _id: github_id  }, function (err, docs) {


              // The user doesn't have an account already
              if(_.isEmpty(docs)){
                  console.log("Github auth7");
                // Create the user
                db.users.insert(user);

              }
              // Update the oauth2 token
              else{
                 console.log("Github auth8");
               db.users.update({ _id: github_id }, { $set: { oauth_token: access_token } } )
              }

            });

            console.log("Github auth9");
              res.send({token: access_token});
              console.log("token send");
           
         });

    });
    
});

myApp.listen(port, function(){
    console.log('server started on port'+ port);
})