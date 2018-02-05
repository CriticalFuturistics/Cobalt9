/* Gameloop to be ran on a different therad

*/

// Import external scripts for APIs and Objects.
// The list neede to be kept up to date with newer js files
self.importScripts('api.js', 'objects/asteroidObject.js', 'objects/canvasObject.js', 'objects/lineObject.js')


let data = null
let gLoop = null
let FRAMERATE = 1000 / 40

self.onmessage = function(e) {
	if (e.data.hasOwnProperty('init')) {
		data = JSON.parse(e.data.data)
		FRAMERATE = e.data.framerate
		stopGame()
		initGame()
	}

	if (e.data.hasOwnProperty('stop')) {
		stopGame()
	}

	if (e.data.hasOwnProperty('resume')) {
		resumeGame()
	}	
}

function initGame() {
	// init
	// setinterval gameloop
}

function gameloop() {
	if (data.consts.updateTime >= 3) {
		data.consts.updateTime = 0
		timeToUpdate = true
	} else {
		data.consts.updateTime += 1
		timeToUpdate = false
	}

	// Update every 4th tick
	if (timeToUpdate) {
		updateMining()

		updateTravelInfo()
		updateUI()
	}

	// Update every tick
	decrementTurbo()
}







function stopGame() {

}

function resumeGame() {

}