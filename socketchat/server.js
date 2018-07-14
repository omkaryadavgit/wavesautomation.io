var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//added afterwords
var mysql = require('mysql');
var fs = require('fs');
var ejs = require('ejs');
var multer = require('multer');
var multerGdrive = require('multer-gdrive');
var myParser = require("body-parser");
var session = require("express-session");
const boolean = require('boolean');
var formidable = require('formidable');
app.use(myParser.urlencoded({ extended: true }));
redirect = require("express-redirect");
var path = require('path');
var dal = require('./dal');
var pwdd;
var status = true;
var nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');
var tm;
var qs = require('querystring');
var location = require('location-href');
app.use(myParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "Shh, its a secret!" }));
app.set('view engine', 'ejs');

var rn = require('random-number');
var options = {
    min: 1000
    , max: 9999
    , integer: true
}
var rno = rn(options);

var id;
//above are newly added
console.log(dal)

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server running at 3000');
app.use("/", express.static(path.join(__dirname, "./public/uploads")));

app.get('/index', function (req, res) {
    if (req.session.t_email) {
        //res.sendFile(__dirname+'/public/assets/index.html');
        var t1=req.session.t_email;
        res.render('index.ejs',{
            uname:t1
          });
    }
    else {
        res.redirect('/logincustomer');
    }
});
//view engine
//app.set('view engine','ejs');


//connected
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);
   //create room foer socket

   socket.on('room', function(room) {
    socket.join(room);
    console.log("new member for room");        
});

console.log("wwwwwwwwwwwwwwwwwwwwwwwwww");
console.log(socket.username);
    //send message
    socket.on('send message', function (data) {
        console.log('in send message method');
        //io.sockets.emit('new message', { msg: data, user: socket.username });
       // socket.to(<socketid>).emit('hey', 'I just met you');
       // io.to('some room').emit("new message", { msg: data, user: socket.username });
        // room = socket.username;
        console.log(socket.username);
        /*if(socket.username=='name1' )
        {
          room='name1';  
        }
        else{
            room='name2';
        }*/
       
            io.sockets.in(uname1).emit("new message", { msg: data, user: socket.username });
            
           // var clients = io.sockets.clients('room');
           var clients_in_the_room = io.sockets.adapter.rooms['name2']; 
            for (var clientId in clients_in_the_room ) {
             console.log('client: %s', socket.username); //Seeing is believing 
                var client_socket = io.sockets.connected[clientId];//Do whatever you want with this
                    } 
         //  console.log(clients);
    });
    //New user 
    socket.on('new user', function (data, callback) {
        console.log('in method of new user');
        callback(true);
        console.log('in new user');
        socket.username = data;
        users.push(socket.username);
        console.log("!!!!!!!!!!!!!!!!");
        io.sockets.emit("newmessage", socket.username);
        console.log("!!!!!!!!!!!!!!!!");
        console.log(socket.username);
        updateUsernames();

    });
    //disconnected
    socket.on('disconnect', function (data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames(data);
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets disconnected', connections.length);
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
        console.log('in updateusername');
    }
});

io.sockets.in('Agent').emit('new_msg', {msg: 'hello'});

//Register

//register get method
app.get('/register', function (req, resp) {
    console.log("in register url");
    if (req.url === "/register") {
        fs.readFile("public/assets/register.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents are not present here');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            resp.end();
        });
    }
});
app.get('/registred', function (req, resp) {
    console.log("in register url");
    if (req.url === "/registred") {
        fs.readFile("public/assets/registred.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents are not present here');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            resp.end();
        });
    }
});

//register post method
app.post('/register', function (req, resp) {
    //resp.end(JSON.stringify(req.body));
    console.log("in the register method");
    var l_name = req.body.cust_name_registerform;
    //console.log(l_name);
    var l_username = req.body.cust_username_registerform;
    var l_email = req.body.cust_email_registerform;
    var l_mobileno = req.body.cust_mobileno_registerform;
    var l_pwd = req.body.cust_pwd_registerform;
    dal.data.registercheck(l_name, l_username, l_email, l_mobileno, l_pwd, req, resp);

});


//LOGIN
 
//login for customer get method
app.get('/logincustomer', function (req, resp) {
    //res.send('<html><body><h1>Hello World</h1></body></html>');
    console.log("in the login url");
    if (req.url === "/logincustomer") {
        fs.readFile("public/assets/logincustomer.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>login page is not here</h1><br /><br /> ' + req.url);
        resp.end();
    }
});



app.get('/loginexecutive', function (req, resp) {
    //res.send('<html><body><h1>Hello World</h1></body></html>');
    console.log("in the login url");
    if (req.url === "/loginexecutive") {
        fs.readFile("public/assets/loginexecutive.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>login page is not here</h1><br /><br /> ' + req.url);
        resp.end();
    }
});

//login post method
app.post('/logincustomer', function (req, resp) {

    //resp.end(JSON.stringify(req.body));

    var l_email = req.body.cust_email_loginform;
    var l_pwd = req.body.cust_pwd_loginform;
    dal.data.logincheck(l_email, l_pwd, req, resp);

});


//login customer api
app.post('/loginexecutive', function (req, resp) {
    //resp.end(JSON.stringify(req.body));

    var l_email = req.body.cust_email_loginform;
    var l_pwd = req.body.cust_pwd_loginform;
    dal.data.logincheckw(l_email, l_pwd, req, resp);

});

//login wrong credentials

app.get('/logincustomerw', function (req, resp) {
    console.log("in the login url");
    if (req.url === "/logincustomerw") {
        fs.readFile("public/assets/logincustomerw.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
               // resp.write("</br><h5 align='center' class='text-warning'>Entered Credentials did not match</h5>");
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>login page is not here</h1><br /><br /> ' + req.url);
        resp.end();
    }
});



app.get('/loginexecutivew', function (req, resp) {
    console.log("in the login url");
    if (req.url === "/loginexecutivew") {
        fs.readFile("public/assets/loginexecutivew.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
               // resp.write("</br><h5 align='center' class='text-warning'>Entered Credentials did not match</h5>");
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>login page is not here</h1><br /><br /> ' + req.url);
        resp.end();
    }
})



//login wrong credentials

app.get('/logincustomerf', function (req, resp) {
    console.log("in the login url");
    if (req.url === '/logincustomerf') {
        fs.readFile("public/assets/logincustomerf.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
               // resp.write("</br><h5 align='center' class='text-warning'>Entered Credentials did not match</h5>");
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>login page is not here</h1><br /><br /> ' + req.url);
        resp.end();
    }
});





app.get('/loginexecutivef', function (req, resp) {
    console.log("in the login url");
    if (req.url === '/loginexecutivef') {
        fs.readFile("public/assets/loginexecutivef.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
               // resp.write("</br><h5 align='center' class='text-warning'>Entered Credentials did not match</h5>");
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>login page is not here</h1><br /><br /> ' + req.url);
        resp.end();
    }
});

/*app.get('/welcome', function (req, resp) {
    //if(sessions.id)
    {
       fs.readFile("public/assets/uploadImage.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }             
            resp.end();
    });
    
    }
});*/



//UPLOAD IMAGE

//welcome get method
app.get('/welcome', function (req, res) {
    if (req.session.t_email) {
       // res.sendFile(__dirname + '/public/assets/upload_prod_id.html');
       var t1=req.session.t_email;
       res.render('upload_prod_id.ejs',{
        uname:t1
      });
    }
    else {
        res.redirect('/logincustomer');
    }
});



app.get('/welcomeexecutive', function (req, res) {
    if (req.session.t_email1) {
         var values=dal.data.prodinfo(req, res);
    }
    else {
        res.redirect('/loginexecutive');
    }
});
app.get('/welcomeexecutivew', function (req, res) {
    if (req.session.t_email1) {
         var values=dal.data.prodinfow(req, res);
    }
    else {
        res.redirect('/loginexecutive');
    }
});

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public/uploads/');
    },
    filename: function (req, file, callback) {

        tm= Date.now();
      callback(null, file.fieldname + '-' + tm + '.jpeg');
    }

  });
  var upload = multer({ storage : storage}).array('userPhoto',2);
  

//welcome post method
app.post('/welcome',  function (req, res, next) {
console.log("in the post method of welcome");
    upload(req,res,function(err) {
        console.log(req.body);
        if(err) {
            return res.end("Error uploading file.");
        } 
        var  uname=req.body.uname;
        var  prod_id_form_value = req.body.prod_id_form_value;
        var  prod_category = req.body.prod_category;
        var  prod_purches_date =req.body.prod_purches_date;
        var  prod_price =req.body.prod_price;
        var  prod_description=req.body.prod_description;
        var  stat="Unresolved";
        var  image_path;
        id=prod_id_form_value;
        image_path = 'userPhoto-' + tm + '.jpeg';
        console.log(image_path);
        console.log('--------------------------------------');
       // console.log(tm);
       // console.log(req.files.originalname);
        console.log('--------------------------------------');
      //  console.log(prod_id);
        dal.data.imageupload(uname,prod_id_form_value,prod_category,prod_purches_date,prod_price,prod_description,image_path,stat,req,res);
      //  res.end("File is uploaded");
    });
});
app.post('/updatestat',  function (req, res, next) {
    console.log("in the post method of welcome");
            console.log('--------------------------------------');
          //  console.log(prod_id);
            dal.data.changestat(req,res);
          //  res.end("File is uploaded");
       
    });

    
app.post('/updatestatw',  function (req, res, next) {
    console.log("in the post method of welcome");
            console.log('--------------------------------------');
          //  console.log(prod_id);
            dal.data.changestatw(req,res);
          //  res.end("File is uploaded");
       
    });


    

//welcome_product_id get methos
app.get('/welcome_prod_id',function (req, resp) {
    if (req.session.t_email) {
        console.log("in the login url");
        if (req.url === "/welcome_prod_id") {
            fs.readFile("public/assets/upload_prod_id.html", function (error, pgResp) {
                if (error) {
                    resp.writeHead(404);
                    resp.write('Contents you are looking are Not Found');
                } else {
                    resp.writeHead(200, { 'Content-Type': 'text/html' });
                    resp.write(pgResp);
                }
                resp.end();
            });
        } else {
            resp.writeHead(200, { 'Content-Type': 'text/html' });
            resp.write('<h1>login page is not here</h1><br /><br /> ' + req.url);
            resp.end();
        }
    }
    else {
        resp.redirect('/login');
    }
});

//welcome_product_id post methos
app.post('/welcome1', function (req, res) {
    console.log("in the welcome_prod_id method");

    var l_email = req.body.username;
    image_path = 'public/uploads/' + 'userPhoto-' + rno + '.jpg';
    prod_id = req.body.prod_id_form_value;
    console.log(image_path);
    console.log(prod_id);
    dal.data.imageupload(image_path, prod_id, req, res);

});


//FORGET PASSWORD

//forget password get method
app.get('/forgotpassword', function (req, resp) {
    if (req.url === "/forgotpassword") {
        fs.readFile("public/assets/forgotpassword.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>this is not what you are looking ??? </h1><br /><br /> ' + req.url);
        resp.end();
    }
});
app.get('/forgotpassworde', function (req, resp) {
    if (req.url === "/forgotpassworde") {
        fs.readFile("public/assets/forgotpassworde.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>this is not what you are looking ??? </h1><br /><br /> ' + req.url);
        resp.end();
    }
});
app.get('/home', function (req, resp) {
    if (req.url === "/home") {
        fs.readFile("public/uploads/index.html", function (error, pgResp) {
            if (error) {
                resp.writeHead(404);
                resp.write('Contents you are looking are Not Found');
            } else {
                resp.writeHead(200, { 'Content-Type': 'text/html' });
                resp.write(pgResp);
            }
            resp.end();
        });
    } else {
        //4.
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.write('<h1>this is not what you are looking ??? </h1><br /><br /> ' + req.url);
        resp.end();
    }
});
app.get('/noprod', function (req, resp) {
    if (req.session.t_email1) {
        //res.sendFile(__dirname+'/public/assets/index.html');
        var t1=req.session.t_email1;
        resp.render('noprod.ejs',{
            uname1:t1
          });
    }
    else {
        resp.redirect('/logincustomer');
    }
});




// forget password post method
app.post('/forgotpassword', function (req, resp) {  
    var emailid=req.body.email;
    var t_email;
    var t_pwd;
    console.log(emailid);
    dal.data.sendemail(req, resp,emailid,t_pwd,t_email);
});

app.post('/forgotpassworde', function (req, resp) {  
    var emailid=req.body.email;
    var t_email;
    var t_pwd;
    console.log(emailid);
    dal.data.sendemaile(req, resp,emailid,t_pwd,t_email);
});



//put and delet methods
app.put('/update-data', function (req, res) {
    res.send('PUT Request');
});

app.delete('/delete-data', function (req, res) {
    res.send('DELETE Request');
});

//logout method
app.get('/logoutcustomer', function (req, res) {
    req.session.destroy();
    res.redirect('/logincustomer');
});
app.get('/logoutexecutive', function (req, res) {
    req.session.destroy();
    res.redirect('/loginexecutive');
});
app.get('/giveselected', function (req, res) {
   var uname="name2";
  // var uname1=req.query.nm;
  global.uname1;
   if(req.query.nm)
   {
    console.log("in the if");
    uname1=req.query.nm;
    console.log(uname1);
   }
  
    console.log("in the else");
    console.log('in the selceted method 1111------------------------------------------------');
    console.log(uname1);
    console.log('in the selceted method 1111-------------------------------------------------');
    dal.data.prodinfownew(req, res, uname1);
   //location.set('/giveselected1');
   console.log('in the last of selceted method11111---------------');
   

});
