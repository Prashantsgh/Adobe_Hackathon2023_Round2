const PORT = 8080;          // Port No
const app = require("./app");

// Starting the server
app.listen(PORT, ()=>{
    console.log(`Server Listening At Port: ${PORT}`);
});