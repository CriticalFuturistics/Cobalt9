// DataStructure containing the game state. Could be used as a savefile... maybe.
let gameData = {
	canvas : {
		spaceship : null,
		stars : [],
		planets : [],
		currentPlanet : null,
		enemyShips : [],
		asteroids : [],
		otherProps : []
	},

	src : {
		sprites : {
			stars : { 
				srcs : ["src/sprite/s1.png", "src/sprite/s2.png", "src/sprite/s3.png", "src/sprite/s4.png"],
				chances : [50, 30, 15, 5]	// Chnces MUST be in decremental order
			}
		}
	},

	consts : {
		starSpawnRate : 14	// The lower, the more likely
	}
}

const fps = 40
const framerate = 1000 / fps


let canvas = document.getElementById("gameCanvas")
let ctx = canvas.getContext("2d")
let gLoop = null


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
		srcs[i] = img
	}

	// load interface
	// load savefile
	// altro


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

function gameLoop() {
	loopCanvas()
	//... TODO
}

// Loops every star, renders it and moves it at the start of every frame.
function renderStars() {
	for (var i = 0; i < gameData.canvas.stars.length; i++) {
		let s = gameData.canvas.stars[i]
		//console.log("moved " + s.x + " star down.")
		s.moveDown()

		// If the star reaches the end of the screen, remove it and shift the array.
		if (s.y > canvas.height + s.img.height) {
			//console.log("removing star")
			gameData.canvas.stars.shift()
		}

		// Draw the star
		ctx.drawImage(s.img, s.x, s.y)
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
		let s = new canvasObject(x, 0, sprite)
		s.y = -(s.img.height)
		gameData.canvas.stars.push(s)
	}
	
}



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

	return gameData.src.sprites.stars.srcs[n]	
}





function stopGameLoop(){
	if (gLoop) {
		clearInterval(gLoop)
	}
}