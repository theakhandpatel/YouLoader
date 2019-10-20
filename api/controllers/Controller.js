const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs')
const path = require('path');
ffmpeg.setFfmpegPath(ffmpegPath);



// CALLBACK TO SEND THE AVAILABLE DATA
exports.get_video_details = function(req, res) {
            let url = req.query.url;
        
            ytdl.getInfo(url, (err, info) => {
                if (err) res.json(err);
                let videoFormats = ytdl.filterFormats(info.formats, 'video');
                let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

                let data = {
                    video_id : info.video_id,
                    title : info.title,
                    duration : info.length_seconds,
                    videoformats : videoFormats,
                    audioformats: audioFormats,
                }
               
                res.header("Access-Control-Allow-Origin", "http://localhost:3000");
                res.json(data);
        
              });
  };

exports.get_audio_download_link= function(req,res){

    let id = req.query.id;
    let itag = req.query.itag;

    try {
        let stream = ytdl(id, {
            quality: itag
          })
          .on('info',(videoInfo,videoFormat)=>{
            res.attachment(videoInfo.player_response.videoDetails.title+"."+videoFormat.container);
            res.setHeader('Content-Length',videoFormat.clen);
            stream.pipe(res);
          })
          
        
    } catch (error) {
        res.json(error)
    }

}
  

exports.get_video_download_link= function(req,res){
    
    let id = req.query.id;
    let itag = req.query.itag;
    let videoOnly= false;
    let streamFormat;
    
    
    try {
        let videoStream = ytdl(id,{quality:itag})
        .on('info',(videoInfo,videoFormat)=>{
        res.attachment(videoInfo.player_response.videoDetails.title+"."+videoFormat.container);
        res.setHeader('Content-Length',videoFormat.clen);
        console.log("inside")
        if(videoFormat.audioEncoding){
            videoOnly = true;
            console.log(videoOnly)
        }
        streamFormat = videoFormat; 

        if(videoOnly){
            videoStream.pipe(res);
            console.log("only sending the videoStream: ***************************  ") 
            console.log(streamFormat )
        }else{
            console.log("startig audio Stream")
            let audioStream = ytdl(id, {
                            quality : 'highestaudio'
                            // filter: format => ((format.container == streamFormat.container || format.container == "m4a")  && !format.encoding),
                        })
                        .pipe(fs.createWriteStream(path.resolve(__dirname, `../../public/audio/${id}.mp4`)))
                        .on('finish',()=>{
    
                            console.log('\ndownloading video');
                            
                            ffmpeg()
                            .input(videoStream)
                            .videoCodec('copy')
                            .input(path.resolve(__dirname, `../../public/audio/${id}.mp4`))
                            .audioCodec('copy')
                            .save(path.resolve(__dirname, `../../public/video/${id}.mp4`))
                            .on('progress', progress => {
                    
                                console.log(progress.timemark);
                              })
                            .on('end', () => {
                                console.log("Done everything");
                                let file = path.resolve(__dirname, `../../public/video/${id}.mp4`);
                                res.download(file,(err)=>{
    
                                    if(err) res.json(err);
                                    
                                    setTimeout(()=>{try {
                                        
                                        fs.unlinkSync(file)
                                        //file removed
                                        console.log("file deleted")
                                    } catch(err) {
                                        console.error(err);
                                    }},1800000);
    
                                    try {
                                        fs.unlinkSync(path.resolve(__dirname, `../../public/audio/${id}.mp4`));
                                        console.log("audio file deleted");
                                    } catch(err) {
                                        console.error(err);
                                    }
                                }) 
                            })        
                        })
            }
    })
    } catch (error) {
      res.json(error);  
    }
    
    }
       

