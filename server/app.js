const express = require("express");
const app = express();
const port = 5000
const mongoose = require("mongoose")
const {MONGOURI}=require("./config/valueKeys")



mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

mongoose.connection.on('connected',()=>{
console.log("connected to server")
})
mongoose.connection.on('error',()=>{
    console.log("connected not to server")
    })

    require("./models/user")
    require("./models/post")
    app.use(express.json())
    
    app.use(require('./routes/authentication'))
    app.use(require('./routes/post'))
    app.use(require('./routes/user'))
    

//SocialNetwork password for db access

const customMiddleWare = (request, response, next) => {
    console.log("this is middleware");
    next()
}

app.use(customMiddleWare);



app.listen(port, () => {
    console.log("server", port)
})