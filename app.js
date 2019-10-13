const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.get("/",(req,res)=>{
    res.render("index");
})

app.get('/download', (req,res) => {
    let URL = req.query.URL;
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(URL, {
        format: 'mp4'
        }).pipe(res);
    });

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});