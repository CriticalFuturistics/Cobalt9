// DataStructure containing the game state. Could be used as a savefile... maybe.
let gameData = {
	canvas : {
		spaceship : null,
		stars : [],
		asteroids : [],
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

	asteroidsData : [],

	src : {
		sprites : {
			spaceship : {
				srcs : "src/sprite/testShip.png",
			},
			stars : {
				srcs : ["src/sprite/s1.png", "src/sprite/s2.png", "src/sprite/s3.png", "src/sprite/s4.png"],
				images : [],
				chances : [60, 25, 10, 5]	// Chnces MUST be in decremental order and sum to 100
			},
			asteroids : {
				srcs : ["src/sprite/a1.png", "src/sprite/a1.png", "src/sprite/a1.png", "src/sprite/a1.png", "src/sprite/a1.png"],
				images : [],
				chances : [50, 30, 12, 6, 2]	// Chnces MUST be in decremental order
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
		asteroidSpeed : 1,
		starSpawnRate : 18,	// The lower, the more likely
		asteroidSpawnRate : 800, // The lower, the more likely
		
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
		},


		asteroidTypes : [
			{ 
				id : 0,
				src : "src/sprite/a1.png",

				// Base resources amound held
				r : {
					titanium : 10,
					copper : 7,
					silicon: 1,
					gold : 0,
					uranium : 0,
				},
				
				/* Resources multiplier
				The value is decided by randoming a number between [Min, Max],
				then it is multiplied by the base number and floored (meaning that
				the final value	needs to be >0.9 to be 1)
				*/
				multiplier : {
					titanium : [1, 1], // Always the base amount
					copper : [1, 1.7],
					silicon: [1, 1.2],
					gold : [0, 0],	// Always 0
					uranium : [0, 0],
				}
			},
			{ 
				id : 1,
				src : "src/sprite/a1.png",
				r : {
					titanium : 7,
					copper : 12,
					silicon: 2,
					gold : 1,
					uranium : 0,
				},
				multiplier : {
					titanium : [0.8, 1.2],
					copper : [1, 1.3],
					silicon: [1, 3],
					gold : [0, 0.2],
					uranium : [0, 0],
				}
			}
		]

	},

	updateTime : 0,
	isStopped : false,

	
	_s : { // Strings

		qbits : "qbits",
		energy : "energy",

		r : { // Resources
			titanium : "titanium",
			copper : "copper",
			silicon : "silicon",
			gold : "gold",
			uranium : "uranium",
			food : "food"
		},

		rPrio : ["uranium", "gold", "silicon", "copper", "titanium"]
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