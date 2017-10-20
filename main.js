/* Cobalt9 - 2017 - Critical Futuristics Copyright */

const fps = 40
const framerate = 1000 / fps


let canvas = document.getElementById("gameCanvas")
let ctx = canvas.getContext("2d")

let consoleCanvas = document.getElementById("consoleCanvas")
let consoleCtx = consoleCanvas.getContext("2d")

let gLoop = null
let isPaused = false

let easeingShip = true
let increment = .002


// Called once the HTML document has finished loading.
$(document).ready(function($) {

	init()

})



function init() {
	// Initial console data
	consoleCanvas.width = $("#console").innerWidth()
    consoleCanvas.height = $("#console").innerHeight() 

	// Load Sprites
	// In order to not load the same sprites evey frame, load them from the src once at the start.
	// Once the stars are loaded, it starts to load the ship.
	let srcs = gameData.src
	for (var i = 0; i < srcs.sprites.stars.srcs.length; i++) {
		let img = new Image()
		img.src = srcs.sprites.stars.srcs[i]
		img.i = i

		img.onload = function() {
			gameData.src.sprites.stars.images[this.i] = img

			let allStarsLoaded = false

			for (let j = 0; j < gameData.src.sprites.stars.srcs.length; j++) {

				if (typeof gameData.src.sprites.stars.images[j] !== 'undefined' && gameData.src.sprites.stars.images[j] != null) {
					allStarsLoaded = true
				} else {
					allStarsLoaded = false
					break
				}
			}
			if (allStarsLoaded) {

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

		loadConsole()
	}
}

function loadConsole(){
	let c = gameData.src.sprites.console
	for (let k in c){
		let img = new Image()
		img.src = c[k].src
		img.k = k

		img.onload = function() {
			c[this.k].image = img
			let allLoaded = false

			for (x in c){
				if (typeof c[x].image === 'undefined' || c[x].image == null) {
					allLoaded = false
					break
				} else {
					allLoaded = true
				}
			}

			if (allLoaded) {
				loadCanvas()
			}
		}
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

        gameData.consts.isConsoleLoaded = false
        renderConsole()

        gLoop = setInterval(gameLoop, framerate)
    }
    resizeCanvas()
}




// --------------- Game Loop --------------- //

function gameLoop() {
	loopCanvas()
	
	// Decrement turbo
	if (gameData.consts.turbo > 0) {
		if (gameData.consts.turbo > 75) {
			gameData.consts.turbo -= 2
		} else {
			gameData.consts.turbo -= 1
		}
		
	}
}






// --------------- Renderer --------------- //

function renderConsole(){
	consoleCanvas.width = $("#console").innerWidth()
    consoleCanvas.height = $("#console").innerHeight()

	consoleCtx.clearRect(0, 0, consoleCanvas.width, consoleCanvas.height)

	let w = consoleCanvas.width
	let h = consoleCanvas.height

	let q = gameData.consts.turbo
	// So that it doesn't divide by zero
	if (q == 0) { q = 0.1 }

	// ----- This is ran once -----

	if (!gameData.consts.isConsoleLoaded) {
		gameData.consts.isConsoleLoaded = true

		let c = gameData.canvas.console
		for(k in c){
			c[k].image = gameData.src.sprites.console[k].image
			c[k].h = c[k].image.height
			c[k].w = c[k].image.width
		}

		c.display.x = 12
		c.display.y = 20

		c.boosterBarBackground.x = (w/2) - c.boosterBarBackground.image.width/2
    	c.boosterBarBackground.y = h - c.boosterBarBackground.image.height - 4	

    	c.btnTurbo.x = (w/2) - (c.btnTurbo.image.width/2)
   		c.btnTurbo.y = (h/2) - (c.btnTurbo.image.height/2) - 12

    	c.boosterBarFull.clip.sw = c.boosterBarFull.image.width / (100/q)
    	c.boosterBarFull.clip.sh = c.boosterBarFull.image.height
    	
    	c.boosterBarFull.x = (w/2) - (c.boosterBarFull.image.width/2),
    	c.boosterBarFull.y = h - c.boosterBarFull.image.height - 4,
    	c.boosterBarFull.w = c.boosterBarFull.image.width / (100/q),
    	c.boosterBarFull.h = c.boosterBarFull.image.height

    	c.slider.x = w - c.slider.image.width - c.slider.image.width/6
    	c.slider.y = h/2 - c.slider.image.height/2 - c.slider.image.height/12

    	c.sliderSelector.x = c.slider.x - (c.sliderSelector.image.width/2) + 3
    	c.sliderSelector.y = (c.slider.y/2) + c.slider.image.height/6


		consoleCanvas.objects = c
	}
	
	// ------------------------

	let c = consoleCanvas.objects

	for(k in c){
		if (c[k].visible) {
			if (k == "background") {
				consoleCtx.drawImage(c[k].image, c[k].x, c[k].y, w, h)
			} else if (k == "boosterBarFull") {
				consoleCtx.drawImage(c[k].image,
			    	c[k].clip.sx, c[k].clip.sy,
			    	c[k].image.width / (100/q), c[k].clip.sh,
			    	c[k].x, c[k].y,
			    	c[k].image.width / (100/q), c[k].h)
			} else if (c[k].hasOwnProperty("clip")) {
				consoleCtx.drawImage(c[k].image,
			    	c[k].clip.sx, c[k].clip.sy,
			    	c[k].clip.sw, c[k].clip.sh,
			    	c[k].x, c[k].y,
			    	c[k].w, c[k].h)
			} else {
				consoleCtx.drawImage(c[k].image, c[k].x, c[k].y)
			}
		}
	}

   	if (!gameData.consts.isConsoleEventEnabled) {
   		gameData.consts.isConsoleEventEnabled = true
   		addConsoleEvents()
   	}
   	
}



function loopCanvas(){
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height)

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
	renderConsole()
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
	if (gameData.consts.turbo < 100) {
		gameData.consts.turbo += 10
/*
		gameData.consts.starSpeed += 1

		if (gameData.consts.turbo < 50) {
			gameData.consts.starSpawnRate -= 1
		} else {
			gameData.consts.starSpawnRate -= 0.5
		}
		

		for (let i = 0; i < gameData.canvas.stars.length; i++) {
			gameData.canvas.stars[i].speed = gameData.consts.starSpeed
		}*/
	}
}



function addConsoleEvents() {
	consoleCanvas.addEventListener('click', function(e) {
		let k = this.objects.btnTurbo

		// Top offset from the game canvas + the 42px high header
		let y = e.pageY - canvas.height - 42 - 4
		let x = e.layerX

		if (y > k.y &&
			y < k.y + k.h && 
			x > k.x &&
			x < k.x + k.w) {
				hyperdrive()
		}

		
	}, false)
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






/*
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
}*/