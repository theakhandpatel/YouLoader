module.exports = function(app) {
    var controllerList = require('../controllers/Controller');
  
    // Routes
  
    app.route('/info')
      .get(controllerList.get_video_details);

    app.route('/download/audio')
      .get(controllerList.get_audio_download_link);
    
      app.route("/download/video")
      .get(controllerList.get_video_download_link)
  };
  