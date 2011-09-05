var imgs = document.querySelectorAll('img');

console.log(imgs.length);

var body = document.querySelector('body');

function logEvent(e) { 
	console.log(e);
}

// TODO: attachEvent
body.addEventListener('scroll', logEvent);
// window.onscroll = logEvent(e);
