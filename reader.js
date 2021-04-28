var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const { stringify } = require('node:querystring');
var namer;
var typer;
http.createServer(function (req, res)   { 
     if (req.url == "/") 
      {  file = 'tickerform.html';
        fs.readFile(file, function(err, txt) {
            res.writeHead(200, {'Content-Type': 'text/html'}); 
            res.write(txt);
            res.end();  });  } 
     else if (req.url == "/process")  { 
         res.writeHead(200, {'Content-Type':'text/html'}); 
         res.write ("Your Stock Ticker Data <br>"); 
         pdata = ""; 
         req.on('data', data => {       
                 pdata += data.toString();  
       });
       // when complete POST data is received
       req.on('end', () => { 
           pdata = qs.parse(pdata);
           namer = pdata['name'];
           typer = pdata['type'];
           res.write ("Your Stock is: "+ pdata['name'] + " and it is a " + pdata['type']);
           var mongo = require('mongodb');
            var MongoClient = mongo.MongoClient;
            const url = "mongodb+srv://ml98:Tufts18icome$@cluster0.uit3o.mongodb.net/Loren_Companies?retryWrites=true&w=majority";
            MongoClient.connect(url,{useUnifiedTopology: true}, function(err, db) { 
                if(err) { 
                    return console.log(err); return;
                }   
                var dbo = db.db("Loren_Companies");
                var collection = dbo.collection('companies');
                console.log(typer);
                theQuery = {typer:namer}; 
                collection.find(theQuery).toArray(function(err, items) { 
                     if (err) {console.log("Error: " + err);  } 
                     else   {
                         res.write(" <br> Available Stock Names in the Database are: <br>") 
                         for (i=0; i<items.length; i++)
                         res.write(i + ": " + items[i].Company + " stock ticker: " + items[i].Ticker + "<br>");  res.end();  } 
                //db.close();
                 });})
        });  } 
     else   {  res.writeHead(200, {'Content-Type':'text/html'}); 
             res.write ("Unknown");  res.end();  }}).listen(8080);