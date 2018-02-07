/* Render handler
The only thing this file is for is to keep running the renderer even when
the user doesn't have the browser window open.

*/

// Import external scripts for APIs and Objects.
// The list neede to be kept up to date with newer js files (if needed)
self.importScripts('api.js')


let FRAMERATE = 1000 / 40
let renderLoop = null

self.onmessage = function(e) {
	if (e.data.hasOwnProperty('init')) {
		FRAMERATE = e.data.framerate
		stopRenderer()
		initRenderer()
	}

	if (e.data.hasOwnProperty('stop')) {
		stopRenderer()
	}

	if (e.data.hasOwnProperty('resume')) {
		resumeRenderer()
	}
	
}


function render() {
	self.postMessage({ render : true })
}	



function initRenderer() {
	renderLoop = setInterval(render, FRAMERATE)
}



function stopRenderer() {
	clearInterval(renderLoop)
}

function resumeRenderer() {
	if (renderLoop) {
		renderLoop = setInterval(render, FRAMERATE)
	}
}