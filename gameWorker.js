/* Gameloop to be ran on a different therad

*/

// Import external scripts for APIs and Objects.
// The list neede to be kept up to date with newer js files
self.importScripts('api.js', 'objects/asteroidObject.js', 'objects/canvasObject.js', 'objects/lineObject.js')


let data = null
let game = null
let gLoop = null
let TICKRATE = Math.round(1000 / 60)

self.onmessage = function(e) {
	if (e.data.hasOwnProperty('init')) {
		data = e.data.data
		game = e.data.game
		TICKRATE = e.data.tickrate
		stopGame()
		initGame()
	}

	if (e.data.hasOwnProperty('stop')) {
		stopGame()
	}

	if (e.data.hasOwnProperty('resume')) {
		resumeGame()
	}

	if (e.data.hasOwnProperty('update')) {
		if (e.data.update.speedConstants.update) {
			data.consts.turbo = e.data.update.speedConstants.turbo
		}
	}
}

function initGame() {
	gLoop = setInterval(gameloop, TICKRATE)
}

function gameloop() {
	let updateUI = false

	// Handle single and 4-t ticks
	if (data.consts.updateTime >= data.consts.blankTicks) {
		data.consts.updateTime = 0
		data.consts.timeToUpdate = true
	} else {
		data.consts.updateTime += 1
		data.consts.timeToUpdate = false
	}

	// Calc new values.
	let speedConstants = decrementTurbo()


	if (data.consts.timeToUpdate) {
		//updateMining()
		//updateTravelInfo()
		updateUI = true
	}

	

	// Send a message to the main thread with the new data.
	if (!game.isPaused) {
		self.postMessage({
			speedConstants : speedConstants,
			updateUI : updateUI,
			updateMining : true
		})
	}
}


// 					(time TODO)
// Updates distance, time and speed.
function updateTravelInfo() {
	let m = data.consts.turbo/10 + 1

	let d = data.consts.distance.n
	if (d >= data.consts.distanceMax 
	||  d <= data.consts.speed.n * 2
	||  d <= 2
	&& !data.consts.isStopped) {
		if (d == 0 && d <= 0) {
			data.consts.distance.n = 0
			data.consts.speed.n = 0
		} else {			
			updateDistance()
		}
		
	}
	if (data.consts.distance.n >= data.consts.speed.n * m) {
		data.consts.distance.n -= data.consts.speed.n * m	
	} else {
		// Arrived at destination
		data.consts.distance.n = 0
		data.consts.distance.u = 0

		data.consts.speed.u = 0
		data.consts.speed.n = 0

		data.consts.isStopped = true
	}
}

function decrementTurbo() {
	if (data.consts.turbo > 0) {
		// Formulas available at https://www.desmos.com/calculator/y8pibgbwxx
		// Formulas might have been changed.

		// Turbo decrement
		let dec = data.consts.baseTurboDifficulty + Math.round(Math.pow(data.consts.turbo/10, 2) / 900)
		if (dec > 12) dec = 12
		data.consts.turbo -= dec
		if (data.consts.turbo < 0) data.consts.turbo = 0

		// Star Speed increment
		let sspeed = data.consts.baseStarSpeed + (Math.pow(data.consts.turbo/10, 1.6) * 0.012)
		if (isNaN(sspeed)) sspeed = data.consts.baseStarSpeed
		data.consts.starSpeed = sspeed

		// Stars spawnrate increment
		let srate = data.consts.baseStarSpawnRate - Math.pow(data.consts.turbo/10, 0.9)
		if (isNaN(srate)) srate = data.consts.baseStarSpawnRate
		if (srate < 6) srate = 6
		data.consts.starSpawnRate = srate

		// Asteroids speed increment
		let aspeed = data.consts.baseAsteroidSpeed + (Math.pow(data.consts.turbo/10, 1.6) * 0.013)
		if (isNaN(aspeed)) aspeed = data.consts.baseAsteroidSpeed
		data.consts.asteroidSpeed = aspeed


		// When moving real fast, no asteroids will spawn
		if (data.consts.turbo > 10) {
			data.consts.maxAsteroids = 0
		} else {
			data.consts.maxAsteroids = data.consts.baseMaxAsteroids
		}
	}

	let c = {
		turbo : data.consts.turbo,
		starSpeed : data.consts.starSpeed,
		starSpawnRate : data.consts.starSpawnRate,
		asteroidSpeed : data.consts.asteroidSpeed,
		maxAsteroids : data.consts.maxAsteroids,
	}

	return c

}

// Calculates the stars and end point of the laser and adds it to data.canvas.lasers
// Then it keeps mining every 4 ticks
function startMining(targetID) {
	if (data.canvas.lasers.length >= data.consts.maxConcurrentLasers) {
		// Remove existing lasers
		// This will need to be changed when we implement auto-lasers.
		data.canvas.lasers = []
	}

	if (data.canvas.lasers.length > 0) {
		if (data.canvas.lasers[0].uniqueID != uniqueID) {
			makeLaser()
		}
	} else {
		makeLaser()
	}

	// Private function
	function makeLaser() {
		// Rendering
		let astC = data.canvas.asteroids[targetID]
		let shipX = data.canvas.spaceship.x + data.canvas.spaceship.width/2
		let shipY = data.canvas.spaceship.y + data.canvas.spaceship.height/2
		
		let astCenterX = astC.getX() + astC.getWidth()/2
		let astCenterY = astC.getY() + astC.getHeight()/2
		
		let lineObj = new LineObject(shipX, shipY, astCenterX, astCenterY, 2, data.consts.laserColor)
		lineObj.uniqueID = astC.uniqueID
		data.canvas.lasers.push(lineObj)
	}
}

// Loops the active lasers and calls asteroidObj.mine()
function updateMining() {
	let inv = game.resources
	let ls = data.canvas.lasers
	let as = data.asteroidsData

	for (let i = 0; i < ls.length; i++) {
		for (let j = 0; j < as.length; j++) {
			if (as[j].uniqueID == ls[i].uniqueID) {
				data._s.rPrio.reverse()
				let prio = data._s.rPrio[data.consts.miningPriority]
				data._s.rPrio.reverse()
				let mined = as[j].mine(data.consts.miningStrength, prio)	
				if (mined != null) {
					addResource(mined.resource, mined.n)
				}		
				
			} 
		}
	}
}

function addResource(r, n) {
	game.resources[r] += n
	if (game.resources[r] > game.resourcesMax[r]) {
		game.resources[r] = game.resourcesMax[r]
	}
}








function stopGame() {
	clearInterval(gLoop)
}

function resumeGame() {
	initGame()
}