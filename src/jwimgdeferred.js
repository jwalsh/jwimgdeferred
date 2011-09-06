var jw = jw || {};

jw.ImgDeferred = (function() {

	// var imgs, config, n, i;

	// class DeferredImages: 
	// class CachedDeferredImages: 

	var imgs = document.getElementsByTagName('img');
	// When we've undeferred the image we don't need to reprocess
	// Coerce into an array for removing nodes
	// We lose live updates to the NodeList but this is more performant
	deferredImages = [];
	for (var n = 0; n < imgs.length; n++) { 
		// ...push() faster?
		deferredImages[n] = imgs[n];
	}


	// Options 

	var config = {
		threshold: { // When are we close enough to pull
			top: 80, // We have to have the image in the viewport
			left: 0 
		}
	};

	// Utilities

	// Logger
	var debug = log = function(e) { 
		if (console && typeof console.log === 'function') {
			console.log(e);
		}
	}

	// Event factory 
	function bind(e, l) { 
		log('bind ' + e);
		if (window.addEventListener) { 
			window.addEventListener(e, l);
		} else if (window.attachEvent) { 
			window.attachEvent(e, l);
		} else {
			new Error('No event binder found.');
		}
	}

	function unbind(o, e, l) { 
		// TODO: Cache the call rather than checking each time
		debug('unbind ' + o);
		if (o.removeEventListener) { 
			o.removeEventListener(l);
		} else if (e.detachEvent) { 
			e.detachEvent(e, l);
		} else { 
			new Error('No event removal found.');
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
		var imgSrc = img.getAttribute('data-deferred-src');
		//		log('Undeferring ' + deferredAvatarSrc);
		img.setAttribute('src', imgSrc);
		return true;
	}


	function imgInView(img) { 
		var viewBottomThreshold = window.pageYOffset + window.innerHeight + config.threshold.top;
		var pos = findPos(img);
		if (pos) { 
			var imgOffsetTop = pos.top;
			if (imgOffsetTop <= viewBottomThreshold) {
				// log(imgOffsetTop + '<' + viewBottomThreshold);
				return true;
			}
		}
	}

	// TODO:  Optimization review 
	function checkDeferredImgs() {

		if (deferredImages.length > 0) { 
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

			// Only indicate when we're actually doing something interesting with the list of images 
			if (deferredImages.length !== _deferredImages.length) { 
				// debug('Setting deferred images to new length ' + _deferredImages.length);
				deferredImages = _deferredImages;
			}
		} else { 
			// We don't need to keep listening since we've undeferred all images
			// log('scroll unbound for checkDeferredImgs');
			log('Deferred images queue cleared; removing event listener for window scroll checkDeferredImgs');
			window.removeEventListener('scroll', checkDeferredImgs);
		}
	}

	function init() { 
		//		log('initializing');
		checkDeferredImgs(); 
	}

	bind('load', init);
	bind('scroll', checkDeferredImgs);

}());
