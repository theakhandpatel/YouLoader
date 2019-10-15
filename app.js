const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');
const lib = require("./lib.js");

const app = express();


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.get("/",(req,res)=>{
    res.render("index");
})

app.get('/download', (req,res) => {
    
    // Extract the VIDEO URL from the request && the quality
    
    let url = req.query.URL;
    let quality = req.query.quality;


    ytdl.getInfo(url, (err, info) => {
        if (err) throw err;
    
        let format = ytdl.chooseFormat(info.formats, { filter: (format)=> format.quality_label === quality });
        if (format) {
            res.attachment(info.title+format.container);
            res.setHeader('Content-Length', format.clen);
            let stream = ytdl.downloadFromInfo(info,{format:format})
            .on('progress', (chunkLength, downloaded, total) => {
                console.log(lib.readableBytes(downloaded)+"/" + lib.readableBytes(total));
            }).pipe(res);
            
            
        }
      });
});  

app.listen(4000,() => {
    console.log('Server Works !!! At port 4000');
});


