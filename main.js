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
		starSpawnRate : 16
	}
}


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

        gLoop = setInterval(gameLoop, 25)
    }
    resizeCanvas()
}

function gameLoop() {
	loopCanvas()
	//... TODO
}


function renderStars() {
	for (var i = 0; i < gameData.canvas.stars.length; i++) {
		let s = gameData.canvas.stars[i]
		s.moveDown()

		if (s.y > canvas.height) {
			gameData.canvas.stars.shift()
		}

		ctx.drawImage(s.img, s.x, s.y)
	}	

}

function newStar(){
	let x = getRandomStarPos(canvas.width)
	let lastStarX
	if (gameData.canvas.stars.length > 0) {
		lastStarX = gameData.canvas.stars[gameData.canvas.stars.length - 1].getX()
	} else {
		lastStarX = x + 16
	}

	if (Math.abs(lastStarX - x) < 16) {
		newStar()
	} else {
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
	let offset = 18
	let randomNumber = offset + Math.floor((Math.random() * (mapW - offset * 3)))
		
	return randomNumber
}

function getRandomStarTiming() {
	return Math.floor((Math.random() * gameData.consts.starSpawnRate) + 1)
}


