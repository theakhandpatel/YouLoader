const PORT = 4000;
const express = require('express');
const cors = require('cors');

const path = require('path');
const lib = require("./lib.js");
const app = express();
const bodyParser = require('body-parser');
const routes = require('./api/routes/Routes'); //importing route

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));


// SERVES INDEX PAGE
app.get("/",(req,res)=>{
    res.render("index");
})

routes(app);




app.listen(PORT,() => {
    console.log('Server Works !!! At port ' + PORT);
});
