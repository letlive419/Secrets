//jshint esversion:6
require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require("ejs")
const encrypt = require("mongoose-encryption");
const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("public"));

//mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/userDB');
//schema creation
const UserSchema = new mongoose.Schema({
  email:String,
  password:String
});

const secret = process.env.secret;

UserSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});



const User = mongoose.model("User", UserSchema);

app.get('/',function(req,res){
    res.render("home")
});

app.get('/login',function(req,res){
    res.render("login")
});

app.get('/register',function(req,res){
    res.render("register")
});

app.post("/register", function(req, res) {
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
})
   
newUser.save()
res.render("secrets");
});
 
app.post("/login", function (req,res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username})
    .then(function(foundUser){
        if (foundUser) {
            if (foundUser.password === password){
                res.render("secrets")
            }
            res.send("wrong password")
        }
    })
    .catch(function(err){
        console.log(err);

    })
})






app.listen(3000,function(){
    console.log("Server started on port 3000")
});