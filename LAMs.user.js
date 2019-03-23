// ==UserScript==
// @name         NTULearn Player with Key Controls
// @namespace    https://gphofficial.com
// @version      0.1
// @description  A better LAMs player
// @author       @GPHOfficial
// @match        *://presentur.ntu.edu.sg/aculearn-idm/*
// @match        *://lams.ntu.edu.sg/lams/tool/lanb11/starter/learner.do?
// @match        *://*.ntu.edu.sg/aculearn-me/v9/studio/play.asp?*
// ==/UserScript==

(function() {
    'use strict';


    var script = document.createElement('script');

    script.src = "https://gphofficial.github.io/videojs-vtt-thumbnails/videojs.thumbnails.js";

    document.head.appendChild(script); //or something of the likes

    var link = document.createElement("link");
    link.href = "https://gphofficial.github.io/videojs-vtt-thumbnails/videojs.thumbnails.css";
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    document.addEventListener('keydown',function(e){

        var videoURL = document.getElementById("Video1_html5_api").src;
        var videoID = videoURL.slice(videoURL.indexOf("/content/")+9,videoURL.indexOf("/media/1.mp4")).replace("/","-")

        if(e.keyCode == 32){
            document.getElementsByClassName("vjs-play-control")[0].click();
            setTimeout(function(){
                document.getElementById("div_index").style.visibility = "hidden";
                document.getElementById("div_index").style.opacity = 0;
                document.getElementById("div_index").style.display = "none";
            }, 3000)
        }

        if(e.keyCode == 70){
            document.getElementsByClassName("arv_fullscreenButton")[0].click();
        }

        var durationTime = document.getElementsByClassName("vjs-duration")[0].innerText.slice(14,-1)
        var currentTime = document.getElementsByClassName("vjs-current-time-display")[0].innerText.slice(13)

        var timeInSec = parseInt(currentTime.slice(-2));
        var durationInSec = parseInt(currentTime.slice(-2));

        if(currentTime.length > 2){
            timeInSec += parseInt(currentTime.slice(-5,-3))*60
        }
        if(durationTime.length > 2){
            durationInSec += parseInt(durationTime.slice(-5,-3))*60
        }
        if(currentTime.length > 5){
            timeInSec += parseInt(currentTime.slice(0,-6))*3600;

        }
        if(durationTime.length > 5){
            durationInSec += parseInt(durationTime.slice(0,-6))*3600;
        }

        if(e.keyCode >= 48 && e.keyCode <= 57){
            var segment = (e.keyCode - 48) * (0.1*durationInSec);
            arvcurrentTime(segment);
        }

        if(e.keyCode == 39){
            arvcurrentTime(timeInSec + 11)
        }

        if(e.keyCode == 37){
            arvcurrentTime(timeInSec - 10)
        }

        if(e.keyCode == 40 || e.keyCode == 38){
            var newVolume = document.getElementById("Video1_html5_api").volume;
            if(e.keyCode == 40){
                newVolume -= 0.05;
                if(newVolume < 0){
                    newVolume = 0
                }
                document.getElementById("Video1_html5_api").volume = newVolume
            }

            if(e.keyCode == 38){
                newVolume += 0.05;
                if(newVolume > 1){
                    newVolume = 1
                }
            }
            document.getElementById("Video1_html5_api").volume = newVolume



            return;
        }

        if(e.keyCode == 65){
            document.getElementById("Video1_html5_api").playbackRate -= 0.1
        }

        if(e.keyCode == 83){
            document.getElementById("Video1_html5_api").playbackRate += 0.1
        }

        //var temp = videojs(document.getElementById("Video1_html5_api"));
        //console.log(arvplayer);

        var captionOption = {
            kind: 'subtitles',
            srclang: 'en',
            label: 'English',
            src: 'http://lams.southeastasia.cloudapp.azure.com/' + videoID + '/sub.vtt',
            default: true
        };

        //'http://gist.githubusercontent.com/GPHofficial/b3198e958667b8972dea20f6dab1d631/raw/a878817b6e208eea06474f5cd66fb4028fec2c83/webvtt.vtt'

        arvplayer.addRemoteTextTrack(captionOption);

        captionOption = {
            kind: 'metadata',
            src: 'http://lams.southeastasia.cloudapp.azure.com/' + videoID + '/video.vtt'
        };

        arvplayer.addRemoteTextTrack(captionOption);

        var tracks = arvplayer.textTracks();

        for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];

            // Find the English captions track and mark it as "showing".
            if (track.kind === 'subtitles' || track.kind === 'metadata') {
                track.mode = 'showing';
            }
        }

        arvplayer.thumbnails({width:400,height:250,basePath : "http://lams.southeastasia.cloudapp.azure.com/" + videoID + "/"})

        var xhr = new XMLHttpRequest(),
            fileReader = new FileReader();






        xhr.open("GET", document.getElementById("Video1_html5_api").src, true);
        // Set the responseType to blob
        xhr.responseType = "blob";
        xhr.addEventListener("load", function () {

            if (xhr.status === 200) {

                //console.log(xhr.response)



                var oReq = new XMLHttpRequest();
                var formData = new FormData();
                formData.append("files", xhr.response);
                formData.append("fileName",videoID);
                oReq.open("POST", "http://lams.southeastasia.cloudapp.azure.com/api/v1/video", true);
                oReq.send(formData);
            }

        }, false);
        // Send XHR
        xhr.send();


    })


})();
