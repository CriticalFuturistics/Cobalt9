// DataStructure containing the game state. Could be used as a savefile.
let gameData = {
	canvas : {
		spaceship : null,
		stars : [],
		planets : null,
		enemyShips : [],
		asteroids : [],
		otherProps : []
	},

	consts : {
		starSpawnRate : 10	// The lower, the more likely
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
		s.moveDown()

		// If the star reaches the end of the screen, remove it and shift the array.
		if (s.y > canvas.height + s.img.height) {
			gameData.canvas.stars.shift()
		}

		// Draw the star
		ctx.drawImage(s.img, s.x, s.y)
	}	

}

// Adds a new star with a random X coord to gameData.canvas.stars.
function newStar(){
	let x = getRandomStarPos(canvas.width)
	let minDistance = 18

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
		let s = new canvasObject(x, 0, "src/sprite/s1.png")
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

/*
	if (gameData.canvas.stars.length > 2) {
		clearInterval(gLoop)
	}
	let x
	if (gameData.canvas.stars.length > 0) {
	 	x = gameData.canvas.stars[0].y
		console.log(x)
	}
*/
}	


function getRandomStarPos(mapW) {
	// Offset per non clippare le stelle ai lati
	let offset = 12
	let randomNumber = offset + Math.floor((Math.random() * (mapW - offset * 3)))
		
	return randomNumber
}

function getRandomStarTiming() {
	return Math.floor((Math.random() * gameData.consts.starSpawnRate) + 1)
}


