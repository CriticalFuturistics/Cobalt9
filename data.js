// DataStructure containing the game state. Could be used as a savefile... maybe.
let gameData = {
	canvas : {
		spaceship : null,
		stars : [],
		asteroids : [],
		lasers : [],
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
	lasersData : [],

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
		updateTime : 0,
		isStopped : false,
		isConsoleLoaded : false,
		isConsoleEventEnabled : false,
		isGameEventEnabled : false,

		starSpeed : 0.7,
		asteroidSpeed : 0.9,
		starSpawnRate : 18,	// The lower, the more likely
		asteroidSpawnRate : 120, // The lower, the more likely
		lastAsteroidUniqueID : 0,

		maxConcurrentLasers :  1,

		turbo : 0,

		miningStrength : 2,
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
					gold : [0, 0.6],
					uranium : [0, 0],
				}
			}
		]

	},



	
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
		titanium : 0,
		copper : 0,
		silicon: 0,
		gold : 0,
		uranium : 0,
		food : 0,
	}, 

	resourcesMax : {
		titanium : 100,
		copper : 100,
		silicon: 100,
		gold : 100,
		uranium : 100,
		food : 100,
	}, 

}



let settings = {
	visual : {
		isConsoleBoot : false,
	}
}


let animations = {
	boot : {
		initDelay : 1000,
		finalDelay : 2000,
		cursorBlink : 400,
		textDelay : 50,
		texts : [
			{ t : "> Booting AmigOS...\n", ms : 500},
			{ t : "> Loading Assets\n", ms : 800},
			{ t : "> Waking up AI\n", ms : 1900},
			{ t : "> I said WAKING UP AI\n", ms : 3200},
			
		],
		logoText : [
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhdmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmddhyyyyyyhmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhyyyyyyyyyyyyyydmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmddhyyyyyyyyyyyyyyyyyyyyhdmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhyyyyyyyyyyyyyyyyyyyyyyyyyyyyhmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmddhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyydmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhdmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmddhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhdmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmdhyyyyyyyyyyyyyyyyyyyyysssooo+++++ooossyyyyyyyyyyyyyyyyyyyydmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmddhyyyyyyyyyyyyyyyyyyyyso+/:..````     ```..-/+osyyyyyyyyyyyyyyyyyhdmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmdhyyyyyyyyyyyyyyyyyyyyso/-.`                      `./osyyyyyyyyyyyyyyyyyhdmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmyyyyyyyyyyyyyyyyyyys+:.`            ```              `-+syyyyyyyyyyyyyyyyyyhdmmmmmmmmm\n",
			"mmmmmmmmmmmmmdyyyyyyyyyyyyyyyyso:.        `.-:/++ooooo++/-.`          -osyyyyyyyyyyyso+:.``/dmmmmmmm\n",
			"mmmmmmmmmmmmmyyyyyyyyyyyyyyys+-`      `.:+ossyyyyyyyyyyyyyso+:`        `/syyyyysso/-.`  ``.:/smmmmmm\n",
			"mmmmmmmmmmmmhyyyyyyyyyyyyys+.      `./osyyyyyyyyyyyyyyyyyyyyyys/.        :sso+/-.`  `.-/+syho/+dmmmm\n",
			"mmmmmmmmmmmmyyyyyyyyyyyyso-      `:osyyyyyyyyyyyyyyyyyyyyyyyyyyys:        -.`   `.:/osyyyyhhhy//dmmm\n",
			"mmmmmmmmmmmhyyyyyyyyyyys/`     `:syyyyyyyyyyyyyyyyyyyyyyyyyyyyyyys/        ``-:+osyyyyyyyyhhhhhsmmmm\n",
			"mmmmmmmmmmdyyyyyyyyyyys-      -oyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy:   `.-/osyyyyyyyyyyyyhhhhhhmmmmm\n",
			"mmmmmmmmmmyyyyyyyyyyyo.     `/syyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyys-:+osyyyyyyyyyyyyyyyyhhhhhdmmmmm\n",
			"mmmmmmmmmdyyyyyyyyyyo`     `oyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhmmmmmm\n",
			"mmmmmmmmmyyyyyyyyyys.     `oyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhdmmmmmm\n",
			"mmmmmmmmhyyyyyyyyyy:      /yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhmmmmmmm\n",
			"mmmmmmmmyyyyyyyyyys`     .syyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhmmmmmmmm\n",
			"mmmmmmmhyyyyyyyyyy/      /yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhdmmmmmmmm\n",
			"mmmmmmdyyyyyyyyyyy-      +yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhmmmmmmmmm\n",
			"mmmmmmyyyyyyyyyyyy.      /yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhdmmmmmmmmm\n",
			"mmmmmdyyyyyyyyyyyy-      -yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhmmmmmmmmmm\n",
			"mmmmmyyyyyyyyyyyys:       +yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyssyyyyyyyyyyyyyyyyyyyyhhhhhhdmmmmmmmmmm\n",
			"mmmmhyyyyyyyso+:.``       `oyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyys+.-syyyyyyyyyyyyyyyyyyyhhhhhhmmmmmmmmmmm\n",
			"mmmmyyyys+/-``   `.-       `/syyyyyyyyyyyyyyyyyyyyyyyyyyys/.`  `+yyyyyyyyyyyyyyyyyhhhhhhmmmmmmmmmmmm\n",
			"mmmyo+:.``   .-/osss/        .+syyyyyyyyyyyyyyyyyyyyyso/-`      `oyyyyyyyyyyyyyyyyhhhhhdmmmmmmmmmmmm\n",
			"mms.`   `.:+ossyyyyys+`        `:+osyyyyyyyyyyyysso+:.`       `:osyyyyyyyyyyyyyyyhhhhhhmmmmmmmmmmmmm\n",
			"mmo..-/ossyyyyyyyyyyyyo-`         `.-://++++//:-.``        `-/ssyyyyyyyyyyyyyyyyhhhhhhdmmmmmmmmmmmmm\n",
			"mmmhyyyyyyyyyyyyyyyyyyyso:`                             `-/osyyyyyyyyyyyyyyyyyyyhhhhhhmmmmmmmmmmmmmm\n",
			"mmmmmdhyyyyyyyyyyyyyyyyyyss+-.`                    `.-:+osyyyyyyyyyyyyyyyyyyyyyhhhhhhdmmmmmmmmmmmmmm\n",
			"mmmmmmddhhyyyyyyyyyyyyyyyyyysso+:-..............-/+ossyyyyyyyyyyyyyyyyyyyyyhhhhhhhhhhmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmddhhyyyyyyyyyyyyyyyyyyyysssooooooooosssyyyyyyyyyyyyyyyyyyyyyyyhhhhhhhhhhhhhmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmddhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhhhhhhhhhhhhdmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmdhhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhhhhhhhhhhhddmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmddhhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhhhhhhhhhhhhdmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmddhhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyhhhhhhhhhhhhhhhhddmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmdhhyyyyyyyyyyyyyyyyyyyyyyyhhhhhhhhhhhhhhhhddmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmddhhyyyyyyyyyyyyyyyhhhhhhhhhhhhhhhhddmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmddhhyyyyyyyyhhhhhhhhhhhhhhhhddmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhhhhhhhhhhhhhhhhhhhddmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmddhhhhhhhhhhhhddmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmdhhhhhddmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n",
			"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmddmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n"
		]

	}
}