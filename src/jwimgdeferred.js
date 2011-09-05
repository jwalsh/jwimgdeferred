// Options 

var config = {
	threshold: { // When are we close enough to pull
		x: 0, // We have to have the image in the viewport
		y: 0 
	}
}

// class DeferredImages: 
// class CachedDeferredImages: 

var imgs = document.querySelectorAll('img');
// When we've undeferred the image we don't need to reprocess
var deferredImages = imgs;

function undeferImg(img) { 
	var deferredAvatarSrc = img.getAttribute('src');
	// TODO: Check against future implementations
	var imgSrc = deferredAvatarSrc.split('?')[0]; 
	console.log('Undeferring ' + deferredAvatarSrc);
	img.setAttribute('src', imgSrc);
}


function imgInView(img) { 
	var viewBottomThreshold = window.pageYOffset + window.innerHeight + config.threshold.y;
	console.log(img.offsetTop + '<' + viewBottomThreshold);
	if (img.offsetTop <= viewBottomThreshold) {
		return true;
	}
}

function checkDeferredImgs() {
	for (var i = 0; i < deferredImages.length; i++) { 
		if(imgInView(deferredImages[i])) { 
			undeferImg(deferredImages[i]);
		}
	}
}

checkDeferredImgs(); 


var body = document.querySelector('body');

function logEvent(e) { 
	if (e.type === 'scroll') { 

	} else { 
		console.log(e);
	}

}

// TODO: attachEvent
window.addEventListener('scroll', logEvent);
window.addEventListener('load', logEvent);
window.addEventListener('DOMContentLoaded', logEvent);
// window.onscroll = logEvent(e);

function init() { 
	console.log('initializing');
	console.info('window dimensions: ' + window.innerWidth + ',' + window.innerHeight);
}

window.addEventListener('load', init);
