$(document).ready(
  //When DOM loaded we attach click event to button, after button is clicked we download the data
  $('.button').click(function(){
    //start ajax request
    $.ajax({
      url: "/playlists/",
      //force to handle it as text
      dataType: "text",
      success: function(data) {
        //data downloaded so we call parseJSON function 
        //and pass downloaded data
        var json = $.parseJSON(data);
        //now json variable contains data in json format
        var sources=captions='';
        /* ignore links for now */
        var posterLink = json.uber.data[0].data[0].url;
	var uber = json.uber.data[1];
	uber.data.forEach(function(playlist) {
	  if (playlist.id==undefined) { 
            var p = playlist[1].data;
            sources += '<source src='+ p[1]+ ' type='+ p[3]+ '>';
            captions += '<a href='+ p[1]+ '><img src='+ p[5]+ ' alt="'+ p[7]+ '"></a>';
	  }
	});

/*
        for(var i=0;i<json.playlist.length;i++){
          sources += '<source src='+ json.playlist[i].source+ ' type='+ json.playlist[i].type+ '>';
          captions += '<a href='+ json.playlist[i].source+ '><img src='+ json.playlist[i].caption+ ' alt="'+ json.playlist[i].text+ '"></a>';
        }
        $('#video_player').html('<video controls poster='+ json.poster+ '>'+ sources+ '</video>'+ '<figcaption>'+ captions+ '</figcaption>');
*/
        $('#video_player').html('<video controls poster='+ posterLink+ '>'+ sources+ '</video>'+ '<figcaption>'+ captions+ '</figcaption>');
        handleLinks();
      }
    });
  })
);

  function handleLinks(){
    var video_player=document.getElementById("video_player");
    var links=video_player.getElementsByTagName('a');
    for(var i=0;i<links.length;i++){
      links[i].onclick=handler;
    }
  }

function handler(e){
  e.preventDefault();videotarget=this.getAttribute("href");
  filename=videotarget.substr(0,videotarget.lastIndexOf('.'))||videotarget;
  video=document.querySelector("#video_player video");
  // video.removeAttribute("controls");
  // video.setAttribute("poster","http://demosthenes.info/assets/images/video-placeholder.png");
  source=document.querySelectorAll("#video_player video source");
  source[0].src=filename+".mp4";
  source[1].src=filename+".webm";
  video.load();
  video.play();
}
