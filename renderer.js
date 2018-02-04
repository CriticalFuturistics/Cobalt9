/* Console Rendere to be ran on a differet thread.

*/

// Import external scripts for APIs and Objects.
self.importScripts('api.js', 'objects/asteroidObject.js', 'objects/canvasObject.js', 'objects/lineObject.js')

let data = null
let cLoop = null
let FRAMERATE = 1000 / 40

self.onmessage = function(e) {
	if (e.data.hasOwnProperty('data')) {
		data = JSON.parse(e.data.data)
	}
	
	if (e.data.hasOwnProperty('stopCanvas')) {
		if (e.data.stopCanvas && cLoop) {
			clearInterval(cLoop)
		}
	} else if (e.data.hasOwnProperty('loopCanvas')) {
		FRAMERATE = e.data.loopCanvas.framerate
		cLoop = setInterval(loopCanvas, e.data.loopCanvas.framerate)
	} else if (e.data.hasOwnProperty('resumeCanvas')) {
		cLoop = setInterval(loopCanvas, FRAMERATE)
	}
}


function loopCanvas() {
	// New canvas object (only src)
	// Update the canvas objects positions


	// Render the positions
	self.postMessage({
		updateCanvas : {
			data : JSON.stringify(data)
		}
	})
}	

