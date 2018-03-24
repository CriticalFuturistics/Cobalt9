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

	if (e.data.hasOwnProperty('stop')) { stopGame() }

	if (e.data.hasOwnProperty('resume')) { resumeGame() }

	if (e.data.hasOwnProperty('update')) {
		if (e.data.update.hasOwnProperty('speedConstants')) {
			if (e.data.update.speedConstants.update) {
				data.consts.turbo = e.data.update.speedConstants.turbo
			}
		}
		if (e.data.update.hasOwnProperty('miningPriority')) {
		 	if (e.data.update.miningPriority.update) {
				data.consts.miningPriority = e.data.update.miningPriority.new
			}
		}
	}

	if (e.data.hasOwnProperty('newLaser')) {
		let g = e.data.game
		game.asteroidsData = g.asteroidsData
		game.activeLasers = g.activeLasers
		data.canvas.lasers = e.data.canvasLasers
	}
}

function initGame() {
	gLoop = setInterval(gameloop, TICKRATE)
}

function gameloop() {
	let update = false
	let removeAst = {
		remove : false,
		removeIDs : null
	}

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
		if (game.activeLasers > 0) {
			// Mine the linked asteroids.
			// If one of them needs to be destroyed, update removeAst.
			let removeIDs = updateMining()
			if (removeIDs != null) {
				removeAst.remove = true
				removeAst.removeIDs = removeIDs
				game.activeLasers--
				data.canvas.lasers = removeLasers(data.canvas.lasers, removeIDs)
			}
		}

		//updateTravelInfo()
		update = true
	}

	
	// Send a message to the main thread with the new data.
	if (!game.isPaused) {
		self.postMessage({
			speedConstants : speedConstants,
			update : update,
			newData : {
				game : {
					resources : game.resources
				}
			},
			removeAst : removeAst
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


// Loops the active lasers and calls asteroidObj.mine().
// Returns an array of uIDs if some asteroids need to be destroyed.
function updateMining() {
	let inv = game.resources
	let ls = data.canvas.lasers
	let as = game.asteroidsData

	let removeIDs = null
	data._s.rPrio.reverse()
	let prio = data._s.rPrio[data.consts.miningPriority]
	data._s.rPrio.reverse()

	for (let i = 0; i < ls.length; i++) {
		for (let j = 0; j < as.length; j++) {
			if (as[j].uniqueID == ls[i].uniqueID) {
				let mined = AsteroidObj.mine(as[j], data.consts.miningStrength, prio, data._s, data.canvas.asteroids)	
				// TODO pass only the relevant data, not the entire Data JSON + canvas.astrds
				
				// If null, destroy the asteroid and tell the main thread to update the canvas.
				if (mined == null) {
					if (removeIDs == null) {
						removeIDs = []
					}
					removeIDs.push(as[j].uniqueID)

				} else {
					addResource(mined.resource, mined.n)
					data.consts.miningPriority = mined.nextP
				}		
			} 
		}
	}
	return removeIDs
}

function addResource(r, n) {
	game.resources[r] += n
	if (game.resources[r] > game.resourcesMax[r]) {
		game.resources[r] = game.resourcesMax[r]
	}
}



// Removes the lasers with a uniqueID = those in ids
function removeLasers(ls, ids) {
	let toRemove = []

	if (typeof ls[0] == 'undefined') {
		return []
	}

	for (let i = 0; i < ls.length; i++) {
		for (let j = ids.length - 1; j >= 0; j--) {
			if (ids[j] == ls[i].uniqueID) {
				ls.splice(i, 1)
			}
		}
	}

	return ls
}







function stopGame() {
	clearInterval(gLoop)
}

function resumeGame() {
	initGame()
}