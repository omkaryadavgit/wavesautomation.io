var methods={};
var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var express = require('express');
var app = express();
var myParser = require("body-parser");
var sessions=require("express-session");
var session = require('express-session')
const boolean = require('boolean');
var cookieParser = require('cookie-parser');
app.use(myParser.urlencoded({extended : true}));
redirect = require("express-redirect");
var path = require("path");
//var flash = require('connect-flash');
var pwdd;
var location = require('location-href')
var status=true;
var nodemailer = require('nodemailer');
var formidable = require('formidable');
var multer  = require('multer');
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.set('view engine', 'html');
var dal=require('./dal.js');
var rn = require('random-number');
var options = {
  min:  1000
, max:  9999
, integer: true
}

//app.use(flash());
var rno=rn(options);
methods.logincheck= function(l_email,l_pwd,req, resp)
{
    var t_email;
    var t_pwd;
     console.log(l_email);
     console.log(l_pwd);
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: "nodedb"
      });
      con.connect(function(err) {
       if (err) throw err;
       con.query("SELECT * FROM customerinfo where customer_email= ?",l_email, function (err, result, fields) {
         if (err) throw err;
         console.log(result);
         if(result == false){
            console.log("in the outer else");
            resp.redirect('/logincustomerw');

    }
    else
    {
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            t_email=row.customer_email;
            t_pwd=row.customer_password;  
            t_uname=row.customer_name;  
            console.log(t_email);
            console.log(t_pwd); 
          //  req.flash('info', '<h1>Something went wrong while deleting post!</h1>')
            if(t_email == l_email)
            {
              if(t_pwd == l_pwd)
              {
              console.log("in the if1");
              sess = req.session;
              req.session.page_views=1;
              req.session.t_email=t_uname;
              console.log(req.session.t_email);
              console.log("*****************************************");
              console.log(req.session.page_views);  
              resp.redirect('/welcome');
              }
              else{
                 console.log("in the else 2");
                 resp.redirect('/logincustomerw');
              }
             }
             else{
              console.log("in the else");
              resp.redirect('/logincustomerw');

             }
         });   
    }                         
       });
     });
};
methods.logincheckw= function(l_email,l_pwd,req, resp)
{
    var t_email;
    var t_pwd;
     console.log(l_email);
     console.log(l_pwd);
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: "nodedb"
      });
      con.connect(function(err) {
       if (err) throw err;
       con.query("SELECT * FROM customerinfow where customer_email= ?",l_email, function (err, result, fields) {
         if (err) throw err;
         console.log(result);
         if(result == false){
            console.log("in the outer else");
            resp.redirect('/loginexecutivew');
    }
    else
    {
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            t_email=row.customer_email;
            t_pwd=row.customer_password; 
            t_uname=row.customer_name; 
            console.log(t_email);
            console.log(t_pwd); 
          //  req.flash('info', '<h1>Something went wrong while deleting post!</h1>')
            if(t_email == l_email)
            {
              if(t_pwd == l_pwd)
              {
              console.log("in the if1");
              sess = req.session;
              req.session.page_views=1;
              req.session.t_email1=t_uname;
              console.log(req.session.page_views);  
              resp.redirect('/welcomeexecutive');
              }
              else{
                 console.log("in the else 2");
                 resp.redirect('/loginexecutivew');
              }
             }
             else{
              console.log("in the else");
              resp.redirect('/loginexecutivew');

             }
         });   
    }                         
       });
     });
};
/*
app.get('/logout', function(req, res){
	req.session.destroy();
    res.redirect('/login');
});
*/
methods.imageupload= function(uname,prod_id_form_value,prod_category,prod_purches_date,prod_price,prod_description,image_path,stat,req,resp)
{
   var users={
     "uname":uname,
    "prod_id": prod_id_form_value,
    "prod_cat": prod_category,
    "prod_date": prod_purches_date,
    "prod_price": prod_price,
    "prod_description": prod_description,
    "image_path":image_path,
    "stat":stat,
    "customer_type":'customer'
   } 

    console.log(prod_description);
    console.log(prod_price);
    console.log(prod_purches_date);
    console.log(prod_category);
    console.log(image_path);
    console.log(prod_id_form_value);
    console.log(status);
    
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: "nodedb"
      });

         con.connect(function(err) {
         if (err) throw err;      
         con.query("insert into productDescription SET ?",users,function(err, results, fields){
         if (err) throw err;
         console.log(results);
         console.log("in the imageupload");
         resp.redirect('/index');
     });
});
}






methods.changestat= function(req,resp)
{
  var idd;
    
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: "nodedb"
      });

         con.connect(function(err) {
         if (err) throw err;      
         //let sql =  ;
         con.query('SELECT * FROM productDescription  where stat =? order by ID desc LIMIT 1','unresolved', (err, res, cols)=>{
           if(err) throw err;
           if(res == false){
            console.log("in the outer else");
            resp.redirect('/noprod');
             }
             else{
           values = res;
           idd=values[0].ID;
           //console.log(res);
           con.query('UPDATE productDescription SET stat = ? WHERE ID = ?', ['resolved',idd],function(err, results, fields){
            //  "UPDATE productDescriptionSET stat = 'resolved', City= 'Frankfurt' WHERE CustomerID = 1;"
            //where stat =? order by ID desc LIMIT 1','unresolved'
            if (err) throw err;
             console.log("in the imageupload");
             resp.redirect('/welcomeexecutive');
         });
        }
         });

});
}


methods.changestatw= function(req,resp)
{
  var idd;
    
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: "nodedb"
      });

         con.connect(function(err) {
         if (err) throw err;      
         //let sql =  ;
         con.query('SELECT * FROM productDescription  where stat =? order by ID desc LIMIT 1','unresolved', (err, res, cols)=>{
           if(err) throw err;
           if(res == false){
            console.log("in the outer else");
            resp.redirect('/noprod');
             }
             else{
           values = res;
           idd=values[0].ID;
           //console.log(res);
           con.query('UPDATE productDescription SET stat = ? WHERE ID = ?', ['working',idd],function(err, results, fields){
            //  "UPDATE productDescriptionSET stat = 'resolved', City= 'Frankfurt' WHERE CustomerID = 1;"
            //where stat =? order by ID desc LIMIT 1','unresolved'
            if (err) throw err;
             console.log("in the imageupload");
             resp.redirect('/welcomeexecutivew');
         });
        }
         });

});
}

methods.sendemail= function(req, resp,emailid,t_pwd,t_email)
{
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "nodedb"
              });
              con.connect(function(err) {
               if (err) throw err;
               con.query("SELECT * FROM customerinfo where customer_email= ?",emailid, function (err, result, fields) {
                 if (err) throw err;  
                 if(result == false){
                    console.log("in the outer else");
                    resp.redirect('/logincustomerw');
            }
            else
            {
                 Object.keys(result).forEach(function(key) {
                   var row = result[key];
                   t_email=row.customer_email;
                   t_pwd=row.customer_password;
                   pwdd=t_pwd;
                   console.log(t_email);
                   console.log(t_pwd);  
                   {
                    var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: 'okeyadav@gmail.com',
                        pass: '7276427372'
                      }
                    });
                    console.log(pwdd);
                    var mailOptions = {
                      from: 'okeyadav@gmail.com',
                      to: emailid,
                      subject: 'forgot password ',
                      text: 'Your AvayaKart password is :- '+pwdd
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                        resp.redirect('/logincustomerf');
                      }
                    });
                 }

                });   
            }                                    
               });

         });
}



methods.sendemaile= function(req, resp,emailid,t_pwd,t_email)
{
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "nodedb"
              });
              con.connect(function(err) {
               if (err) throw err;
               con.query("SELECT * FROM customerinfow where customer_email= ?",emailid, function (err, result, fields) {
                 if (err) throw err;  
                 if(result == false){
                    console.log("in the outer else");
                    resp.redirect('/loginexecutivew');
            }
            else
            {
                 Object.keys(result).forEach(function(key) {
                   var row = result[key];
                   t_email=row.customer_email;
                   t_pwd=row.customer_password;
                   pwdd=t_pwd;
                   console.log(t_email);
                   console.log(t_pwd);  
                   {
                    var transporter = nodemailer.createTransport({
                      service: 'gmail',
                      auth: {
                        user: 'okeyadav@gmail.com',
                        pass: '7276427372'
                      }
                    });
                    console.log(pwdd);
                    var mailOptions = {
                      from: 'okeyadav@gmail.com',
                      to: emailid,
                      subject: 'forgot password ',
                      text: 'your password is :- '+pwdd
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                        resp.redirect('/loginexecutivef');
                      }
                    });
                 }

                });   
            }                                    
               });

         });
}


methods.registercheck= function(l_name,l_username,l_email,l_mobileno,l_pwd,req, resp)
{
   var users={
    "customer_name":l_name,
    "customer_username": l_username,
    "customer_email":l_email,
    "customer_mobile_no":l_mobileno,
    "customer_password":l_pwd,
    "customer_type":'customer'
   } 

    console.log(l_name);
    console.log(l_username);
     console.log(l_email);
     console.log(l_mobileno);
     console.log(l_pwd);
var con = mysql.createConnection({
host: "localhost",
user: "root",
password: "root",
database: "nodedb"
      });
      //var status= true;
      con.connect(function(err) {
       if (err) throw err;      
       con.query("SELECT * FROM customerinfo where customer_email= ?",l_email, function (err, result, fields){
        if(result == false){
       con.query("insert into customerinfo SET ?",users,function(err, results, fields){
         if (err) throw err;
         console.log(results);
         console.log("in the register");
         resp.redirect('/logincustomer');
     });
    }
    else{
        console.log("user is already registered");
        resp.redirect('/registred');
    }
    });
    
});


}
var values;
var idd;
methods.prodinfo= function(req, resp)
{
    const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nodedb'
  });
  //let sql ='SELECT * FROM productDescription';
  //let sql =  +'unresolved' ;
  pool.query('SELECT * FROM productDescription  where stat =? order by ID desc LIMIT 1','unresolved' , (err, res, cols)=>{
    if(err) throw err;
    if(res == false){
      console.log("in the outer else");
      resp.redirect('/noprod');
    }
    else{
    values = res;
    idd=values[0].ID;
    console.log(values);
    resp.render('welcomeexecutive.ejs',{
      prod_id: values[0].prod_id,
          prod_cat: values[0].prod_cat,
          prod_date: values[0].prod_date,
          prod_price: values[0].prod_price,
          prod_description: values[0].prod_description,
          image_path: values[0].image_path,
          ID:values[0].ID,
          stat: values[0].stat,
          uname1:values[0].uname,
          uname2:req.session.t_email1,
          ctype :values[0].customer_type
    });
  }
    //console.log(res);
  });
  console.log("------------------------------------------------");
// console.log(values);
/*
 */
}

methods.prodinfow= function(req, resp)
{
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nodedb'
  });
  //let sql ='SELECT * FROM productDescription';
  //let sql =  +'unresolved' ;
  pool.query('SELECT * FROM productDescription  where stat =? order by ID desc LIMIT 1','working', (err, res, cols)=>{
    if(err) throw err;
    console.log("*-*-*-*-*-*-*-*-*--*--");
    if(res == false){
      console.log("in the outer else");
      console.log("*-*-*-*-*-*-*-*-*--*--");
      resp.redirect('/noprod');
    }
    else{
    values = res;
    idd=values[0].ID;
    console.log(values);
    console.log("*-*-*-*-*-*-*-*-*--*--");
    resp.render('welcomeexecutive.ejs',{
      
      prod_id: values[0].prod_id,
          prod_cat: values[0].prod_cat,
          prod_date: values[0].prod_date,
          prod_price: values[0].prod_price,
          prod_description: values[0].prod_description,
          image_path: values[0].image_path,
          ID:values[0].ID,
          stat: values[0].stat,
          uname1:values[0].uname,
          uname2:req.session.t_email1,
          ctype :values[0].customer_type
    });
  }
    //console.log(res);
  });
  console.log("------------------------------------------------");
// console.log(values);
/*
 */
}

methods.prodinfownew= function(req, resp, uname)
{
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nodedb'
  });
  //let sql ='SELECT * FROM productDescription';
  //let sql =  +'unresolved' ;

  var users={
    "uname":uname,
    "stat":'unresolved'
   } 
   pool.query('SELECT * FROM productDescription where uname ="'+ uname +'" and stat="unresolved" order by ID desc LIMIT 1', (err, res, cols)=>{
    if(err) throw err;
    console.log("*-*-*-* in the method prodinfownew 1");
    if(res == false){
      console.log("in the outer else");
      console.log("*-*-*-* in the method prodinfownew 1 in the result is false");
      resp.redirect('/noprod');
    }
    else{
      console.log("*-*-*-* in the method prodinfownew 1 in the result is true");
    values = res;
    idd=values[0].ID;
    console.log(values);
    console.log("*-*-*-*-*-*-*-*-*--*--");
   
    resp.render('chat_to_customer.ejs',{
      prod_id: values[0].prod_id,
          prod_cat: values[0].prod_cat,
          prod_date: values[0].prod_date,
          prod_price: values[0].prod_price,
          prod_description: values[0].prod_description,
          image_path: values[0].image_path,
          ID:values[0].ID,
          stat: values[0].stat,
          uname1:values[0].uname,
          uname2:req.session.t_email1,
          ctype :values[0].customer_type
    }); 
   //resp.redirect('/forgotpassword');
  }
    //console.log(res);
  });
  console.log("------------------------------------------------");
// console.log(values);
/*
 */
}

console.log('--------------===============================');
console.log(idd);
exports.data= methods;  