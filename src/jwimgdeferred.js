var jw = jw || {};

jw.jwimgdeferred = (function() {

	// Options 

	var config = {
		threshold: { // When are we close enough to pull
			x: 0, // We have to have the image in the viewport
			y: 0 
		}
	};

	// Dimensions utility 
	// Externally sourced from http://www.quirksmode.org/js/findpos.html
	function findPos(obj) {
		var _left = _top = 0;
		if (obj.offsetParent) {
			do {
				_left += obj.offsetLeft;
				_top += obj.offsetTop;
			} while (obj = obj.offsetParent);
			return {top: _top, left: _left};
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
		var imgOffsetTop = findPos(img).top;
		if (imgOffsetTop <= viewBottomThreshold) {
			console.log(imgOffsetTop + '<' + viewBottomThreshold);
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

	function init() { 
		console.log('initializing');
		console.info('window dimensions: ' + window.innerWidth + ',' + window.innerHeight);
		checkDeferredImgs(); 
	}

	window.addEventListener('load', init);

}());
