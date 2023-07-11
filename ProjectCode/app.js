const express = require('express');
const path = require('path');
const PORT = 8080;          // Port No
const {createResume} = require('./Controller/createResume');       // MiddleWare Function for Resume Generation
const cors = require('cors');

// Creates an Express Application and sets its properties
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'Public')));


// Endpoint for loading Resume Builder UI
app.get('/',(req,res)=>{
    res.sendFile('index.html', {root: path.join(__dirname,'Views')});
});

// Endpoint for creating and sending Resume
app.post('/resume',createResume);


app.listen(PORT, ()=>{
    console.log(`Server Listening At Port: ${PORT}`);
})