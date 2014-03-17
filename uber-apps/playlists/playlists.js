$(document).ready(
  /* after button is clicked fetch the playlist */
  $('.button').click(function(){
    //start ajax request
    $.ajax({
      url: "/playlists/",
      dataType: "text",
      success: function(data) {
        var json = $.parseJSON(data);
        var sources=captions='';
        /* uber structures are a bit obtuse: i want to think of posterLink as json.uber.playlist[i].url */
        var posterLink = json.uber.data[0].data[0].url;
        /* ignore the uber links go straight for the playlist data */
	var uber = json.uber.data[1];
	uber.data.forEach(function(playlist) {
	  if (playlist.id==undefined) { 
            var p = playlist[1].data;
            sources += '<source src='+ p[1]+ ' type='+ p[3]+ '>';
            captions += '<a href='+ p[1]+ '><img src='+ p[5]+ ' alt="'+ p[7]+ '"></a>';
	  }
	});
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
  source=document.querySelectorAll("#video_player video source");
  source[0].src=filename+".mp4";
  source[1].src=filename+".webm";
  video.load();
  video.play();
}
