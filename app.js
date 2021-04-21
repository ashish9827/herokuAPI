var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');
var app = express();
const mongoose = require("mongoose");
var cors = require('cors')

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/demo",{ useUnifiedTopology: true ,useNewUrlParser: true })
.then(response=>{console.log(`connection success`)})
.catch((err)=>console.log(err));

//Schema
const demoSchema = new mongoose.Schema({
    mobile:String,
    name:String,
    email:String,
    city:String,
    pincode:String
});
//collection
const democollection2 = new mongoose.model("democollection2",demoSchema);

//get all data or read all data
const readData = async () => {
    const result = await democollection2.find();
    return result;
}
app.get('/users', function(req, res){
    let data={
        "result":"success"
    };
    return readData().then(response=>{
        //console.log(response);
        res.send(response);
    });
});

//get one data or read one data
const readOneData = async (mobile) => {
    const result = await democollection2.find({mobile:mobile});
    return result;
}
app.post('/user', function(req, res){
    console.log('mobile res.body',req.body);
    return readOneData(req.body.data[0].mobile).then(response=>{
        console.log(response);
        res.send(response);
    });
});

//insert data or create data
const insertData = async (mobile,uname,email,city,pincode) => {
    try{
        const reactDate = new democollection2({
            mobile:mobile,
            name:uname,
            email:email,
            city:city,
            pincode:pincode
        });
        const result = await reactDate.save();
        console.log(result);
    }catch(err){
        console.log(err)
    }
  }
app.post('/users',function(req, res){
    console.log(`post insert`, req.body);
    return insertData(req.body.data[0].mobile,req.body.data[0].name,req.body.data[0].email,req.body.data[0].city,req.body.data[0].pincode).then(response=>{
        console.log(response);
        res.send(`Record inserted`);
    });
});

//Delete data
const deleteData = async (mobile) => {
    console.log(`here is mobile number ${mobile}`)
    const result = await democollection2.deleteOne({mobile:`${mobile}`});
    return result;
}
app.delete('/users',function(req, res){
    console.log(`post deleted`, req.body);
    return deleteData(req.body[0].mobile).then(response=>{
        console.log(response);
        res.send(`Record deleted`);
    });
});


app.set('view engine', 'pug');
app.set('views', './views');

// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded


app.post('/', function(req, res){
   console.log(req.body);
   res.send("recieved your request!");
});
app.listen(3001);