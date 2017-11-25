// DataStructure containing the game state. Could be used as a savefile... maybe.
let gameData = {
	canvas : {
		spaceship : null,
		stars : [],
		planets : [],
		currentPlanet : null,
		enemyShips : [],
		asteroids : [],
		otherProps : [],

		console : {
			background : {
				image : null,
				x : 0,
				y : 0,
				w : 0,
				h : 0,
				visible : true,
			},

			display : {
				image : null,
				x : 0,
				y : 0,
				w : 0,
				h : 0,
				visible : true
			},

			boosterBarBackground : {
				image : null,
				x : 0,
				y : 0,
				w : 0,
				h : 0,
				visible : true
			},

			boosterBarFull : {
				image : null,
				x : 0,
				y : 0,
				w : 0,
				h : 0,
				clip : {
					sx : 0,
					sy : 0,
					sw : 0,
					sh : 0
				},
				visible : true
			},

			btnTurbo : {
				image : null,
				x : 0,
				y : 0,
				w : 0,
				h : 0,
				visible : true
			},

			prsTurbo : {
				image : null,
				x : 0,
				y : 0,
				w : 0,
				h : 0,
				visible : false
			},

			slider : {
				image : null,
				x : 0,
				y : 0,
				w : 0,
				h : 0,
				visible : true
			},
			
			sliderSelector : {
				image : null,
				x : 0,
				y : 0,
				w : 0,
				h : 0,
				visible : true,
				spacing : 0
			}
		}
	},

	src : {
		sprites : {
			spaceship : {
				srcs : "src/sprite/testShip.png",
			},
			stars : {
				srcs : ["src/sprite/s1.png", "src/sprite/s2.png", "src/sprite/s3.png", "src/sprite/s4.png"],
				images : [],
				chances : [50, 30, 15, 5]	// Chnces MUST be in decremental order
			},

			console : {
				background : {
					src : "src/sprite/console_2.png",
					image : null
				},

				display : {
					//src : "src/sprite/spaceTime.png",
					src : "src/sprite/display.png",
					image : null
				},

				boosterBarBackground : {
					src : "src/sprite/boosterBarEmpty.png",
					image : null
				},

				boosterBarFull : {
					src : "src/sprite/boosterBarFull.png",
					image : null
				},

				btnTurbo : {
					src : "src/sprite/btnTurbo.png",
					image : null
				},

				prsTurbo : {
					src : "src/sprite/prsTurbo.png",
					image : null
				},

				slider : {
					src : "src/sprite/slider.png",
					image : null
				}, 

				sliderSelector : {
					src : "src/sprite/sliderSelector.png",
					image : null
				},
			}
		}
	},

	consts : {
		isConsoleLoaded : false,
		isConsoleEventEnabled : false,

		starSpeed : 1,
		starSpawnRate : 18,	// The lower, the more likely
		
		turbo : 0,

		miningPriority : 0,
		maxMiningPriority : 5,

		distanceUnits : ['KM', 'AU', 'PC'],
		timeUnits : ['--', '--', '--'],
		distanceMax : 999999999,
		
		distance : {
			n : 1000,
			u : 2
		},

		
		time : {
			n : 0,
			u : 0
		},

		speed : {
			n : 0.01,
			u : 2,
		}

	},

	updateTime : 0,
	isStopped : false,

	
	_s : { // Strings

		qbits : "qbits",
		energy : "energy",

		r : { // Resources
			titanium : "titanium",
			copper : "copper",
			silicon: "silicon",
			gold : "gold",
			uranium : "uranium",
			food : "food"
		}
	}
}


let game = {

	qbits : 0,
	energy : 0,

	resources : {
		titanium : 2,
		copper : 30,
		silicon: 19,
		gold : 8,
		uranium : 37,
		food : 44,
	}, 

	resourcesMax : {
		titanium : 50,
		copper : 50,
		silicon: 50,
		gold : 50,
		uranium : 50,
		food : 50,
	}, 

}