//npm install restify
//npm install mongojs

var restify = require('restify');
var mongojs = require("mongojs");

var ip_addr = '127.0.0.1';
var port    =  '8080';
 
var server = restify.createServer({
    name : "apphub"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var connection_string = '127.0.0.1:27017/apphub';
var db = mongojs(connection_string, ['apphub']);
var errors = db.collection("errors");
 
server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});

var PATH = '/error'
server.get({path : PATH , version : '0.0.1'} , findAllErrors);
server.get({path : PATH +'/:errorId' , version : '0.0.1'} , findError);
server.post({path : PATH , version: '0.0.1'} ,postNewError);
server.del({path : PATH +'/:errorId' , version: '0.0.1'} ,deleteError);

function findAllErrors(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    errors.find().limit(20).sort({postedOn : -1} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }else{
            return next(err);
        }
 
    });
 
}
 
function findError(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    errors.findOne({_id:mongojs.ObjectId(req.params.errorId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }
        return next(err);
    })
}
 
function postNewError(req , res , next){
    var job = {};
    job.title = req.params.title;
    job.description = req.params.description;
    job.location = req.params.location;
    job.postedOn = new Date();
 
    res.setHeader('Access-Control-Allow-Origin','*');
 
    errors.save(job , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , job);
            return next();
        }else{
            return next(err);
        }
    });
}
 
function deleteError(req , res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    errors.remove({_id:mongojs.ObjectId(req.params.errorId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(204);
            return next();      
        } else{
            return next(err);
        }
    })
}
