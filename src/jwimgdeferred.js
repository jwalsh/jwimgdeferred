var jw = jw || {};

jw.ImgDeferred = (function() {

	// class DeferredImages: 
	// class CachedDeferredImages: 

	var imgs = document.querySelectorAll('img');
	// When we've undeferred the image we don't need to reprocess
	// Coerce into an array for removing nodes
	deferredImages = [];
	for (var n = 0; n < imgs.length; n++) { 
		deferredImages[n] = imgs[n];
	}


	// Options 

	var config = {
		threshold: { // When are we close enough to pull
			top: 0, // We have to have the image in the viewport
			left: 0 
		}
	};

	// Utilities

	// Event factory 
	function bind(e, l) { 
		if (window.addEventListener) { 
			window.addEventListener(e, l);
		} else if (window.attachEvent) { 
			window.attachEvent(e, l);
		} else {
			new Error('No event binder found.');
		}
	}

	// Logger
	function log(e) { 
		if (console && typeof console.log === 'function') {
			console.log(e);
		}
	}

	// Dimensions
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

	function undeferImg(imgs, i) { 
		var img = imgs[i];
		var deferredAvatarSrc = img.getAttribute('src');
		// TODO: Check against future implementations
		var imgSrc = deferredAvatarSrc.split('?')[0]; 
		//		log('Undeferring ' + deferredAvatarSrc);
		img.setAttribute('src', imgSrc);
		return true;
	}


	function imgInView(img) { 
		var viewBottomThreshold = window.pageYOffset + window.innerHeight + config.threshold.top;
		var imgOffsetTop = findPos(img).top;
		if (imgOffsetTop <= viewBottomThreshold) {
			//			log(imgOffsetTop + '<' + viewBottomThreshold);
			return true;
		}
	}

	// TODO:  Optimization review 
	function checkDeferredImgs() {

		if(deferredImages.length > 0) { 
			var _deferredImages = [];
			// Set up the cache

			for (var i = 0; i < deferredImages.length; i++) { 
				if(imgInView(deferredImages[i])) { 
					if (undeferImg(deferredImages, i)) { 
						// log('removed' + i);
					} 
				} else { 
					_deferredImages.push(deferredImages[i]);
				}
			}

			// log('Setting deferred images to new length ' + _deferredImages.length);
			deferredImages = _deferredImages;
		}
	}

	function init() { 
		//		log('initializing');
		checkDeferredImgs(); 
	}

	bind('load', init);
	bind('scroll', checkDeferredImgs);

}());
