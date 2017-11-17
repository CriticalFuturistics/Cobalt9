/* Cobalt9 - 2017 - Critical Futuristics Copyright */

const fps = 40
const framerate = 1000 / fps


let canvas = document.getElementById("gameCanvas")
let ctx = canvas.getContext("2d")

let consoleCanvas = document.getElementById("consoleCanvas")
let consoleCtx = consoleCanvas.getContext("2d")

let sfx = null

let gLoop = null
let isPaused = false

let easeingShip = true
let increment = .002


// Called once the HTML document has finished loading.
$(document).ready(function($) {
	initSound()
	initCSS()
	initHTML()
	init()
})

// Load the sound files into an HTML element.
function initSound() {
	sfx = document.createElement('audio')
    sfx.setAttribute('src', 'src/sfx-hover.mp3')
    sfx.volume = 0.1
}

// Change the initail CSS of some elements.
function initCSS() {
	$("[aria-controls='Crew']").parent().addClass('active')
	$("[aria-controls='Resources']").parent().addClass('active')	
}

function initHTML() {
	// Populate Crew
	let $crew = $('#Crew .tab-html')

	let $crewP = $("<p>").appendTo($crew)
	let $btnPause = $("<a>", {"class" : "btn", "text" : "Pause Game", "onclick" : "pauseGameLoop()"})
	$btnPause.appendTo($crewP)

	let $btnResume = $("<a>", {"class" : "btn", "text" : "Resume Game", "onclick" : "resumeGameLoop()"})
	$btnResume.click(resumeGameLoop())
	$btnResume.appendTo($crewP)

	// Populate Chips

	// Populate Upgrades

	// Populate Settings


	// Populate Resources
	let $resources = $('#Resources .tab-html')
	let $resourcesList = $('#Resources #resourcesList')

	let r = game.resources

	for (k in r){
		let $resourceImg = $("<div>", { "class" : "resourceImg", "id" : ("resourceImg" + k)})
		let $resource = $("<div>", { "class" : "resource"})

		let $resourceB = $("<div>", { "class" : "resourceB", "id" : ("resourceB" + k)})
		let $resourceN = $("<div>", { "class" : "resourceN", "id" : ("resourceN" + k), "text" : (r[k] + "/" + game.resourcesMax[k]) })
	
		$resourceB.css({
			width: getPercent(game.resourcesMax[k], r[k]) + "%",
			"background-color": getColorFromPercent(getPercent(game.resourcesMax[k], r[k]))
		})
		$resource.append($resourceB)
		$resource.append($resourceN)

		$item = $("<div>", { "id" : ("list" + k)})
		$item.append($resourceImg)
		$item.append($resource)

		$resourcesList.append($item)
	}
	


	// Populate Inventory

	// Populate Starmap

	// Populate Encylopedia



}

// General init
function init(){
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

// Loads the ship, then chain-calls loadConsole().
function loadShip() {
	let ship = new Image()
	ship.src = gameData.src.sprites.spaceship.srcs

	ship.onload = function(){
		gameData.src.sprites.spaceship.srcs = ship

		canvas.width = $("#game").innerWidth()
		canvas.height = $("#game").innerWidth()

		let sc = new canvasObject(canvas.width/2 - 64, canvas.height * 1.2, ship, 1)
		sc.height = 128
		sc.width = 128
		gameData.canvas.spaceship = sc

		loadConsole()
	}
}
// Loads the console, then chain-calls loadCanvas().
function loadConsole() {
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
// Loads the canvas, then stars the Gameloop.
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

	if (gameData.updateTime >= 3) {
		gameData.updateTime = 0
		timeToUpdate = true
	} else {
		gameData.updateTime += 1
		timeToUpdate = false
	}

	let m = gameData.consts.turbo/10 + 1
	// Update Distance and Time
	if (timeToUpdate) {
		let d = gameData.consts.distance.n
		if (d >= gameData.consts.distanceMax 
		||  d <= gameData.consts.speed.n * 2
		||  d <= 2
		&& !gameData.consts.isStopped) {
			if (d == 0 && d <= 0) {
				gameData.consts.distance.n = 0
				gameData.consts.speed.n = 0
			} else {			
				updateDistance()
			}
			
		}
		if (gameData.consts.distance.n >= gameData.consts.speed.n * m) {
			gameData.consts.distance.n -= gameData.consts.speed.n * m	
		} else {
			// Arrived at destination
			gameData.consts.distance.n = 0
			gameData.consts.distance.u = 0

			gameData.consts.speed.u = 0
			gameData.consts.speed.n = 0

			gameData.consts.isStopped = true
		}
		

	}


	// Decrement turbo
	if (gameData.consts.turbo > 0) {
		if (gameData.consts.turbo > 750) {
			gameData.consts.starSpeed = 14
			gameData.consts.starSpawnRate = 2
			gameData.consts.turbo -= 12
		} else if (gameData.consts.turbo > 500) {
			gameData.consts.starSpeed = 9
			gameData.consts.starSpawnRate = 4
			gameData.consts.turbo -= 9
		} else if (gameData.consts.turbo > 250) {
			gameData.consts.starSpeed = 4
			gameData.consts.starSpawnRate = 10
			gameData.consts.turbo -= 7
		} else {
			gameData.consts.starSpeed = 2
			gameData.consts.starSpawnRate = 18	
			gameData.consts.turbo -= 6
		}

		for (let i = 0; i < gameData.canvas.stars.length; i++) {
			gameData.canvas.stars[i].speed = gameData.consts.starSpeed
		}
	}
}






// --------------- Renderer --------------- //

function renderConsole() {
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

    	c.btnTurbo.x = Math.floor((w/2) - (c.btnTurbo.image.width/2))
   		c.btnTurbo.y = Math.floor((h/2) - (c.btnTurbo.image.height/2) - 12)

   		c.prsTurbo.x = c.btnTurbo.x 
   		c.prsTurbo.y = c.btnTurbo.y 

    	c.boosterBarFull.clip.sw = c.boosterBarFull.image.width / (1000/q)
    	c.boosterBarFull.clip.sh = c.boosterBarFull.image.height
    	
    	c.boosterBarFull.x = (w/2) - (c.boosterBarFull.image.width/2),
    	c.boosterBarFull.y = h - c.boosterBarFull.image.height - 4,
    	c.boosterBarFull.w = c.boosterBarFull.image.width / (1000/q),
    	c.boosterBarFull.h = c.boosterBarFull.image.height

    	c.slider.x = w - c.slider.image.width - c.slider.image.width/6
    	c.slider.y = h/2 - c.slider.image.height/2 - c.slider.image.height/4
		
		// Mining Priority
    	c.sliderSelector.spacing = gameData.consts.miningPriority * (c.slider.image.width/5 - 1)

    	c.sliderSelector.x = (c.slider.x - (c.sliderSelector.image.width/2) + 3) + c.sliderSelector.spacing
    	c.sliderSelector.y = (c.slider.y/2) + parseInt(c.slider.image.height/16)

    	gameData.canvas.console.sliderSelector.x = c.sliderSelector.x

    	

		consoleCanvas.objects = c
	}
	
	// ----------------------------

	let c = consoleCanvas.objects

	for(k in c){
		if (c[k].visible) {
			if (k == "background") {
				consoleCtx.drawImage(c[k].image, c[k].x, c[k].y, w, h)
			} else if (k == "boosterBarFull") {
				consoleCtx.drawImage(c[k].image,
			    	c[k].clip.sx, c[k].clip.sy,
			    	c[k].image.width / (1000/q), c[k].clip.sh,
			    	c[k].x, c[k].y,
			    	c[k].image.width / (1000/q), c[k].h)
			} else if (k == "sliderSelector") {
				c[k].spacing = gameData.consts.miningPriority * (c.slider.image.width/5 - 1)
				consoleCtx.drawImage(c[k].image, c[k].x + c[k].spacing, c[k].y)			  
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


	// ------- HTML render --------
	// Console Digits

	$("#emptyDistance").html('888888888')
	$("#emptyTime").html('888888888')
	$("#emptyDistanceUnit").html('88')
	$("#emptyTimeUnit").html('88')

	$("#emptyDistance").css({
		position : 'absolute',
		top: parseInt($("#console").position().top + consoleCanvas.objects.display.y - 3) + "px",
		left: 27 + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 3/4,
		"text-align" : "right"
	})
	$("#emptyDistanceUnit").css({
		position : 'absolute',
		top: parseInt($("#console").position().top + consoleCanvas.objects.display.y - 3) + "px",
		left: $("#distance").position().left + parseInt($("#distance").css("width")) + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 1/4,
		"text-align" : "right"
	})
	$("#emptyTime").css({
		position : 'absolute',
		top: parseInt($("#distance").position().top + $("#distance").height() + 3) + "px",
		left: 27 + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 3/4,
		"text-align" : "right"
	})
	$("#emptyTimeUnit").css({
		position : 'absolute',
		top: parseInt($("#distance").position().top + $("#distance").height() + 3) + "px",
		left: $("#distance").position().left + parseInt($("#distance").css("width")) + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 1/4,
		"text-align" : "right"
	})

	let temp = gameData.consts.distance.n
	if (gameData.consts.distance.n > gameData.consts.distanceMax || gameData.consts.distance.n < 0) {
		temp = 0
	}
	$("#distance").html(Math.round(temp))
	$("#distance").css({
		position : 'absolute',
		top: parseInt($("#console").position().top + consoleCanvas.objects.display.y - 3) + "px",
		left: 27 + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 3/4,
		"text-align" : "right"
	})

	$("#distanceUnit").html(gameData.consts.distanceUnits[gameData.consts.distance.u])
	$("#distanceUnit").css({
		position : 'absolute',
		top: parseInt($("#console").position().top + consoleCanvas.objects.display.y - 3) + "px",
		left: $("#distance").position().left + parseInt($("#distance").css("width")) + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 1/4,
		"text-align" : "right"
	})

	$("#time").html(Math.round(gameData.consts.time.n))
	$("#time").css({
		position : 'absolute',
		top: parseInt($("#distance").position().top + $("#distance").height() + 3) + "px",
		left: 27 + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 3/4,
		"text-align" : "right"
	})

	$("#timeUnit").html(gameData.consts.timeUnits[gameData.consts.time.u])
	$("#timeUnit").css({
		position : 'absolute',
		top: parseInt($("#distance").position().top + $("#distance").height() + 3) + "px",
		left: $("#distance").position().left + parseInt($("#distance").css("width")) + "px",
		height : (consoleCanvas.objects.display.image.height - 4)/2 - 2,
		width : (consoleCanvas.objects.display.image.width - 4) * 1/4,
		"text-align" : "right"
	})


	//pauseGameLoop()

	// ----------------------------


   	if (!gameData.consts.isConsoleEventEnabled) {
   		gameData.consts.isConsoleEventEnabled = true
   		addConsoleEvents()
   	}
}



function loopCanvas() {
	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height)


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
function newStar() {
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






function hyperdrive() {
	if (gameData.consts.turbo < 1000) {
		gameData.consts.turbo += 60
	}
}



function addConsoleEvents() {
	//let isMouseDown = false
	let isSliderSelected = false
	let startX
	let sliderDistance = 0

	$("#consoleCanvas").mousedown(function (e) {
		let k = this.objects.sliderSelector

		let rect = consoleCanvas.getBoundingClientRect()
      	let scaleX = consoleCanvas.width / rect.width
      	let scaleY = consoleCanvas.height / rect.height

    	let x = Math.floor((e.clientX - rect.left) * scaleX)
    	let y = Math.floor((e.clientY - rect.top) * scaleY)
    	let w = k.w * scaleX
    	let h = k.h * scaleY

    	let kx = k.x + gameData.consts.miningPriority * (this.objects.slider.image.width/5 - 1)

		if (!isPaused &&
			y > k.y && y < k.y + h && 
			x > kx && x < kx + w) {
			startX = x
			isSliderSelected = true
		}
		
	})

	$("#consoleCanvas").mousemove(function (e) {
		if (!isPaused && isSliderSelected) {
			let rect = consoleCanvas.getBoundingClientRect()
			let scaleX = consoleCanvas.width / rect.width
			let x = Math.floor((e.clientX - rect.left) * scaleX)
			let dx = x - startX
			startX = x

			sliderDistance += dx
			let p = gameData.consts.miningPriority

			if (sliderDistance > this.objects.slider.w/5 - this.objects.sliderSelector.w/5) {
				sliderDistance = 0
				if (p < gameData.consts.maxMiningPriority) { 
					p += 1
					sfx.pause()
					sfx.currentTime = 0
					sfx.play()
				}

			} else if (sliderDistance < -(this.objects.slider.w/5) + this.objects.sliderSelector.w/5) {
				sliderDistance = 0
				if (p > 0) { 
					p -= 1
					sfx.pause()
					sfx.currentTime = 0
					sfx.play()
				}
			}
			gameData.consts.miningPriority = p

		}
	})
	$("#consoleCanvas").mouseup(function (e) {
		if(!isPaused) {
			isSliderSelected = false
		
			consoleCanvas.objects.btnTurbo.visible = true
			consoleCanvas.objects.prsTurbo.visible = false
		}
	})

	$("#consoleCanvas").mouseout(function (e) {
		if(!isPaused) {
			if (isSliderSelected){
				isSliderSelected = false
			}
			consoleCanvas.objects.btnTurbo.visible = true
			consoleCanvas.objects.prsTurbo.visible = false
		}
	})


	consoleCanvas.addEventListener('mouseup', function(e) {
		if(!isPaused) {
			consoleCanvas.objects.btnTurbo.visible = true
			consoleCanvas.objects.prsTurbo.visible = false
		}
	})

	consoleCanvas.addEventListener('mousedown', function(e) {
		if(!isPaused) {
			let k = this.objects.btnTurbo

			let rect = consoleCanvas.getBoundingClientRect()
	      	let scaleX = consoleCanvas.width / rect.width
	      	let scaleY = consoleCanvas.height / rect.height

	    	let x = Math.floor((e.clientX - rect.left) * scaleX)
	    	let y = Math.floor((e.clientY - rect.top) * scaleY)
	    	let w = k.w * scaleX
	    	let h = k.h * scaleY

			let kxc = k.x + (k.w/2)
			let kyc = k.y + (k.h/2)

			let r = w/2

			if (Math.ceil(Math.sqrt(Math.pow(x - kxc, 2) + Math.pow(y - kyc, 2))) < r) {
				this.objects.btnTurbo.visible = false
				this.objects.prsTurbo.visible = true

				hyperdrive()
			}		
		}
	}, false)
}




// --------------------------------- Unit Conversion --------------------------------- //


function updateDistance() {
	if (gameData.consts.distance.n >= gameData.consts.distanceMax || gameData.consts.distance.n <= gameData.consts.speed.n * 2 || gameData.consts.distance.n <= 2) {
		let newVal = unitConversion(gameData.consts.distance.n, gameData.consts.distance.u, 'd')
		gameData.consts.distance.n = newVal.n
		gameData.consts.distance.u = newVal.u
		updateSpeed()
	}
}

function updateSpeed() {
	let newVal = unitConversion(gameData.consts.speed.n, gameData.consts.speed.u, 's')
	gameData.consts.speed.n = newVal.n
	gameData.consts.speed.u = newVal.u
}


function unitConversion(n, u, type) {
	if (type == 'd') {
		if (n >= gameData.consts.distanceMax) {
			if (u == 0)	return convertToAU(n, u)
			if (u == 1)	return convertToPC(n, u)
		} else {
			if (u == 2)	return convertToAU(n, u)
			if (u == 1)	return convertToKM(n, u)
		}
	} else if (type == 's') {
		if (n >= gameData.consts.distanceMax) {
			if (u == 0)	return convertToAU(n, u)
			if (u == 1)	return convertToPC(n, u)
		} else {
			if (u == 2)	return convertToAU(n, u)
			if (u == 1)	return convertToKM(n, u)
		}
	}
	
}

function convertToAU(n, u) {
	// KM --> AU
	if (u == 0) {
		return { u : 1,	n : Math.round((n / 149598000).toFixed(1)) }
	} 
	// PC --> AU
	if (u == 2) {
		return { u : 1, n : parseInt(n * 206265) }
	}
}

function convertToPC(n, u) {
	// AU --> PC
	if (u == 1) {
		return { u : 2,	n : Math.round((n / 206265).toFixed(1)) }
	} 
	// ?? --> PC
	// If we need a higher unit of measurement
}


function convertToKM(n, u) {
	// AU --> KM
	if (u == 1) {
		return { u : 0, n : parseInt(n * 149598000) }
	}
}




























function pauseGameLoop() {
	if (gLoop) {
		clearInterval(gLoop)
		isPaused = true
	}
}

function resumeGameLoop() {
	if (isPaused) {
		gLoop = setInterval(gameLoop, framerate)
		isPaused = false
	}
}
