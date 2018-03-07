/* Render handler

*/

// Import external scripts for APIs and Objects.
// The list neede to be kept up to date with newer js files (if needed)
self.importScripts('api.js', 'objects/canvasObject.js')


let FRAMERATE = Math.round(1000 / 40)
let data = null

let readyToRender = true
let readyToSend = true

let hasShifted = false
let newStar = {
	lastStars : [],
	x : 0,
	new : false
}
let newAst = {
	new : false,
	ast : null,
	x : 0,
	srcIndex : -1,
}

self.onmessage = function(e) {
	if (e.data.hasOwnProperty('init')) {
		data = e.data.data
		FRAMERATE = e.data.framerate
		queueRender()
	}

	if (e.data.hasOwnProperty('render')) {
		if (e.data.render) {
			data = e.data.data
			queueRender()
		}
	}
}

function queueRender() {
	// Resets the variables to their original values
	readyToRender = false
	hasShifted = false

	newStar = {
		lastStars : [],
		x : 0,
		new : false
	}

	newAst = {
		new : false,
		ast : null,
		x : 0,
		srcIndex : -1,
	}

	render()
}


function render() {
	let starsCoords = []

	// Decide if a new star is spawning.
	if (isStarSpawning()) {
		newStar = preemptNewStar()
	}

	if (isAsteroidSpawning()) {
		newAst = preemptNewAsteroid()
	}	

	// Move the stars.
	for (let i = 0; i < data.canvas.stars.length; i++) {
		CanvasObj.moveDown(data.canvas.stars[i])
		starsCoords.push({ y : CanvasObj.getY(data.canvas.stars[i])})
		if (data.canvas.stars[i].y > data.canvas.height + data.canvas.stars[i].height) {
			hasShifted = true
			break
		}
	}


	// Send the frame to main.
	send(starsCoords)
}	

function send(starsCoords) {
	// Send the data to the main thread
	self.postMessage({
		newFrame : true,
		hasShifted : hasShifted,
		newStar : newStar,
		newAst : newAst,
		data : {
			canvas : {
				starsCoords : starsCoords,
			}
		}
		//asteroidsData : data.asteroidsData,
		//lasersData : data.lasersData
	})	
}





// Calculate the new star boundaries.
function preemptNewStar() {
	let starW = 32
	let minDistance = 32

	if (data.canvas.stars.length > 1) {
		starW = CanvasObj.getWidth(data.canvas.stars[data.canvas.stars.length - 1])
	}
	let x = getRandomStartPos(data.canvas.width, starW)
	

	// Check if it's not too close to another star.
	let lastStars = []
	if (data.canvas.stars.length > 2) {
		lastStars.push(data.canvas.stars[data.canvas.stars.length - 1])
		lastStars.push(data.canvas.stars[data.canvas.stars.length - 2])
		lastStars.push(data.canvas.stars[data.canvas.stars.length - 3])
	} else {
		for (let i = 0; i < lastStars.length; i++) {
			CanvasObj.setX(lastStars[i], x + minDistance)
		}
	}

	return { 
		lastStars : lastStars,
		x : x,
		new : true
	}
}

// Calculate the new asteroid values.
function preemptNewAsteroid() {
	let asteroidW = 64
	let minDistance = asteroidW

	if (data.canvas.asteroids.length > 1) {
		asteroidW = CanvasObj.getWidth(data.canvas.asteroids[data.canvas.asteroids.length - 1])
	}
	let x = getRandomStartPos(data.canvas.width, asteroidW)
	let ship = data.canvas.spaceship

	// Make sure the asteroid doesn't spawn direclty on top of the ship, it'd be a pain to mine
	if (x > (ship.x) && x < (ship.x + ship.width)) {
		//return preemptNewAsteroid()
		// << Here too
	} else {
		// Check if it's not too close to another asteroid.
		let lastAsteroids = []
		if (data.canvas.asteroids.length > 2) {
			lastAsteroids.push(data.canvas.asteroids[data.canvas.asteroids.length - 1])
			lastAsteroids.push(data.canvas.asteroids[data.canvas.asteroids.length - 2])
		} else {
			for (let i = 0; i < lastAsteroids.length; i++) {
				CanvasObj.setX(lastAsteroids[i], x + minDistance)
			}
		}
		if (data.canvas.asteroids.length <= data.consts.maxAsteroids) {	
			if (lastAsteroids.length == 0) {
				return createAsteroid()
			} else if (Math.abs(CanvasObj.getX(lastAsteroids[0]) - x) < minDistance) {
				//return preemptNewAsteroid()
				// TODO check stack size and stop after a certain point
			} else {
				return createAsteroid()
			}
		}
	}

	// Private internal function
	function createAsteroid(){
		let ast = getRandomAsteroidType()
		let srcIndex = 0
		// Contrary to the stars, the sprite is based on the asteroid, not a random one
		for (let i = 0; i < data.astsrc.length; i++) {
			if (data.astsrc[i] == ast.src) {
				srcIndex = i
				break
			} 
		}
		
		return {
			new : true,
			ast : ast,
			x : x,
			srcIndex : srcIndex,
		}
	}

	return {
		new : false,
		ast : null,
		x : 0,
		srcIndex : -1,
	}
}


function isStarSpawning() {
	return getRandom(0, data.consts.starSpawnRate) == 1
}

function isAsteroidSpawning() {

	return getRandom(0, data.consts.asteroidSpawnRate) == 1
}

function getRandomStartPos(mapW, itemW) {
	// Offset per non clippare ai lati
	let offset = itemW + 2
	let randomNumber = offset + getRandom(0, (mapW - offset * 2))
		
	return randomNumber
}

function getRandomAsteroidType() {
	let r = getRandom(0, 100)
	let asts = data.consts.asteroidTypes
	let id = 0

	function getAstChance(i, r) {
		if (i >= asts.length) {
			return asts[0]
		}
		if (r <= asts[i].chance) {
			return getAstChance((i + 1), r)
		} else {
			return asts[i]
		}
	}
	 
	return getAstChance(0, r)
}











