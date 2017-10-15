/* Cobalt9 - 2017 - Critical Futuristics Copyright */

const fps = 40
const framerate = 1000 / fps


let canvas = document.getElementById("gameCanvas")
let ctx = canvas.getContext("2d")
let gLoop = null
let isPaused = false

let easeingShip = true
let increment = .002

// Called once the HTML document has finished loading.
$(document).ready(function($) {

	init()

})



function init() {

	// Load Sprites
	// In order to not load the same sprites evey frame, load them from the src once at the start.
	let srcs = gameData.src.sprites.stars.srcs

	for (var i = 0; i < srcs.length; i++) {
		let img = new Image()
		img.src = srcs[i]
		img.i = i

		// Fantastic function to make sure all stars have been loaded.
		img.onload = function() {
			gameData.src.sprites.stars.images[this.i] = img

			let allImagesLoaded = false
			for (let j = 0; j < gameData.src.sprites.stars.images.length; j++) {

				if (typeof gameData.src.sprites.stars.images[j] !== 'undefined') {
					allImagesLoaded = true
				} else {
					allImagesLoaded = false
					break
				}
			}
			if (allImagesLoaded) {
				loadShip()
			}
		}
	}
}

function loadShip(){
	let ship = new Image()
	ship.src = gameData.src.sprites.spaceship.srcs

	ship.onload = function(){
		gameData.src.sprites.spaceship.srcs = ship

		canvas.width = $("#game").innerWidth()
		canvas.height = $("#game").innerWidth()

		let sc = new canvasObject(canvas.width/2 - 32, canvas.height * 1.2, ship, 1)
		sc.height = 64
		sc.width = 64
		gameData.canvas.spaceship = sc

		loadCanvas()
	}
}

function loadCanvas() {
	window.addEventListener('resize', resizeCanvas, false)

	function resizeCanvas() {
		if (gLoop) {
			clearInterval(gLoop)
		}
        canvas.width = $("#game").innerWidth()
        canvas.height = $("#game").innerWidth()

        gLoop = setInterval(gameLoop, framerate)
    }
    resizeCanvas()
}




// --------------- Game Loop --------------- //

function gameLoop() {
	loopCanvas()
	
}









// --------------- Renderer --------------- //

function loopCanvas(){
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// aggiungi nuove stelle
	// renderizza + movimento (e update gameData)
	// se movimento fa uscire la stella, toglila e shifta l'array
	// renderizza gli oggetti
	

	// Get a random number. If it's 1, spawn a new star
	if (getRandomStarTiming() == 1) {
		newStar()
	}

	renderStars()
	renderSpaceship()
}	

function renderSpaceship() {
	let ship = gameData.canvas.spaceship

	// EaseIn of the ship when the game starts.
	if (easeingShip) {
		increment += .016
		ship.y -= 1 / increment

		if (ship.y <= canvas.height/2) {
			increment = 0
			easeingShip = false
		}
		ctx.drawImage(ship.img, ship.x, ship.y)
	} else {
		ctx.drawImage(ship.img, canvas.width/2 - ship.width/2, canvas.height/2)
	}
}

// Loops every star, renders it and moves it at the start of every frame.
function renderStars() {
	for (var i = 0; i < gameData.canvas.stars.length; i++) {
		let s = gameData.canvas.stars[i]
		s.moveDown()

		// If the star reaches the end of the screen, remove it and shift the array.
		if (!s.img) {
			// In case the img hasn't fully loaded yet
			if (s.y > canvas.height + 64) {
				gameData.canvas.stars.shift()
			}
		} else {
			if (s.y > canvas.height + s.img.height) {
				gameData.canvas.stars.shift()
			}
		}

		// Draw the star
		if (typeof s.img === 'undefined') {
			console.log("ERROR: star img Undefined. Ignoring star.")
		} else {
			ctx.drawImage(s.img, s.x, s.y)
		}
		

	}	
}

// Adds a new star with a random X coord to gameData.canvas.stars.
function newStar(){
	let x = getRandomStarPos(canvas.width)
	let minDistance = 32

	// Check if it's not too close to another star.
	let lastStars = []
	if (gameData.canvas.stars.length > 2) {

		lastStars.push(gameData.canvas.stars[gameData.canvas.stars.length - 1].getX())
		lastStars.push(gameData.canvas.stars[gameData.canvas.stars.length - 2].getX())
		lastStars.push(gameData.canvas.stars[gameData.canvas.stars.length - 3].getX())

	} else {
		for (var i = 0; i < lastStars.length; i++) {
			lastStars[i] = x + minDistance
		}
	}

	// Checks the distance between the new star and the last 3 stars.
	// If it's not enought, random a new star.
	if (Math.abs(lastStars[0] - x) < minDistance ||
		Math.abs(lastStars[1] - x) < minDistance ||
		Math.abs(lastStars[2] - x) < minDistance) 
	{
		newStar()
	} else {
		// Adds the star to the list of stars.
		let sprite = getRandomStarSprite()
		let s = new canvasObject(x, 0, sprite, gameData.consts.starSpeed)
		if (!s.img) {
			s.y = -18
		} else {
			s.y = -(s.img.height)
		}
		
		// Deprecated. Having stars move at different speeds overloaded the game.
		//s.speed += getRandom(0, 2)
		gameData.canvas.stars.push(s)
	}	
}


function getRandomStarPos(mapW) {
	// Offset per non clippare le stelle ai lati
	let offset = 8	
	let randomNumber = offset + getRandom(0, (mapW - offset * 3))
		
	return randomNumber
}


function getRandomStarTiming() {

	return getRandom(0, gameData.consts.starSpawnRate)
}


// Randomly selects a star sprite from gameData.src.sprites.stars
function getRandomStarSprite() {
	let n = 0
	let chances = gameData.src.sprites.stars.chances

	// Recursively analyze the percentage and get the index of the random star src
	function getStarChance(i) {
		let r = getRandom(1, 100)
		if (r <= chances[i]) {
			return getStarChance(i + 1)
		} else {
			return i
		}
	}
	n = getStarChance(0)

	return gameData.src.sprites.stars.images[n]	
}







function hyperdrive(){
	for (var i = 0; i < gameData.canvas.stars.length; i++) {
		gameData.canvas.stars[i].speed = 4
	}
	gameData.consts.starSpeed = 4
	gameData.consts.starSpawnRate = 6
}







function pauseGameLoop(){
	if (gLoop) {
		clearInterval(gLoop)
		isPaused = true
	}
}

function resumeGameLoop(){
	if (isPaused) {
		gLoop = setInterval(gameLoop, framerate)
		isPaused = false
	}
}







function test(){
	let srcs = gameData.src.sprites.stars.srcs

	for (var i = 0; i < srcs.length; i++) {
		let img = new Image()
		img.src = srcs[i]
		img.i = i

		// Fantastic function to make sure all stars have been loaded.
		img.onload = function() {
			gameData.src.sprites.stars.images[this.i] = img

			let allImagesLoaded = false
			for (let j = 0; j < gameData.src.sprites.stars.images.length; j++) {

				if (typeof gameData.src.sprites.stars.images[j] !== 'undefined') {
					allImagesLoaded = true
				} else {
					allImagesLoaded = false
					break
				}
			}
			if (allImagesLoaded) {
				//-------
			}
		}
	}
}