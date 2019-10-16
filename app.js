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


app.get("/video",(req,res)=>{
    let url = req.query.URL;

    ytdl.getBasicInfo(url, (err, info) => {
        if (err) throw err;
        let video_qualities = new Set();
        let audio_qualities = new Set();

        info.formats.forEach((format)=>{
            
            if(format.quality_label){
                video_qualities.add(format.quality_label);
            }

            if(format.type.includes("audio")){
                audio_qualities.add(format.type);
            }
        });


        let data = {
            video_id : info.video_id,
            title : info.title,
            durations : info.length_seconds,
            video_qualities : Array.from(video_qualities),
            audio_qualities : Array.from(audio_qualities),
            formats : info.formats,
        }
        res.json(data);

      });
})

app.listen(4000,() => {
    console.log('Server Works !!! At port 4000');
});


