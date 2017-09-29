let gameData = {
	canvas : {
		spaceship : null,
		stars : [],
		planets : null,
		enemyShips : [],
		asteroids : [],
		otherProps : []
	},
}

let canvas = document.getElementById("gameCanvas")
let ctx = canvas.getContext("2d")



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

        let gLoop = setInterval(gameLoop(), 25)
    }
    resizeCanvas()
}

function gameLoop() {
	loopCanvas()
	//... TODO
}


function renderStars(w) {

	function sprite(options) {
		let obj = {}

		/*
		obj.qualcosa = qualocas
		*/
	}

	let star = new Image()
	star.src = "src/sprite/s1.png"
	ctx.drawImage(star, w, 20)

	gameData.canvas.push(new canvasObject(w, 0, star.src))

}



function loopCanvas(){
	// clear canvas
	// se canvasObjects nell'array => renderizzali + movimento (e update gameData)
	// se movimento fa uscire la stella, toglila e shifta l'array
	// aggiungi nuove stelle
	// renderizza gli oggetti
	
	function randomizeStar() {

		renderStars(getRandomStarPos(canvas.width))
	}
	
}	


function getRandomStarPos(mapW) {
	// Offset per non clippare le stelle ai lati
	let offset = 32

	let randomNumber = offset + Math.floor((Math.random() * (mapW - offset*2))
	console.log(randomNumber)

	return randomNumber
}

function getRandomStarTiming() {
	return Math.floor((Math.random() * 3) + 1)
}


class canvasObject {
	constructor(x, y, src) {
		this.x = x
		this.y = y
		this.src = src

		let img = new Image()
		img.src = this.src

		this.width = img.width
		this.height = img.height
		this.ticksLeft = null
	}


}