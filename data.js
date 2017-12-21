// DataStructure containing the game state. Could be used as a savefile... maybe.
// The aim is to use gameData for the constants the game is based one,
// while 'game' should be used for the variables. 
// TODO move stuff around for concistency
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
				srcs : [],
				images : [],
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
		},

		defaults : {
			// Chip's index corresponds to its rarity.
			chips : [
				"src/sprite/chipCommon.png", 
				"src/sprite/chipUncommon.png",
				"src/sprite/chipRare.png",
				"src/sprite/chipEpic.png",
				"src/sprite/chipLegendary.png",
				"src/sprite/chipImmortal.png"
			],
			upgrade : {
				btnSrc : "src/sprite/btnUpgrade.png",
				prsSrc : "src/sprite/prsUpgrade.png",
			},
		},
	},

	consts : {
		updateTime : 0,
		isStopped : false,
		isConsoleLoaded : false,
		isConsoleEventEnabled : false,
		isGameEventEnabled : false,

		baseStarSpeed : 0.6,
		starSpeed : 0.6,

		baseAsteroidSpeed : 0.8,
		asteroidSpeed : 0.8,
		
		baseStarSpawnRate : 18,
		starSpawnRate : 18,	// The lower, the more likely
		
		baseAsteroidSpawnRate : 400,
		asteroidSpawnRate : 400, // The lower, the more likely
		lastAsteroidUniqueID : 0, // Max 99
		baseMaxAsteroids : 7,
		maxAsteroids : 7,

		maxConcurrentLasers :  1,

		turbo : 0,

		miningStrength : 1,
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
				chance : 50,
				rotation : [0, 0.2],
				axis : {
					x : [1, 2.5],
					y : [1, 3]
				},

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
				chance : 30,
				rotation : [0.1, 0.3],
				axis : {
					x : [1, 2],
					y : [1, 2]
				},

				r : {
					titanium : 4,
					copper : 12,
					silicon: 2,
					gold : 1,
					uranium : 0,
				},
				multiplier : {
					titanium : [0.7, 1.1],
					copper : [1, 1.3],
					silicon: [1, 3],
					gold : [0, 0.6],
					uranium : [0, 0],
				}
			},
			{ 
				id : 2,
				src : "src/sprite/a1.png",
				chance : 6,
				rotation : [0.1, 0.5],
				axis : {
					x : [1, 1],
					y : [1, 2]
				},

				r : {
					titanium : 5,
					copper : 4,
					silicon: 0,
					gold : 1,
					uranium : 1,
				},
				multiplier : {
					titanium : [0.4, 1.5],
					copper : [1.6, 2.9],
					silicon: [0, 0],
					gold : [0.2, 1.3],
					uranium : [1, 2.3],
				}
			},
			{ 
				id : 3,
				src : "src/sprite/a2.png",
				chance : 12,
				rotation : [0, 0.6],
				axis : {
					x : [1, 2],
					y : [1, 2]
				},

				r : {
					titanium : 0,
					copper : 0,
					silicon: 0,
					gold : 0,
					uranium : 7,
				},
				multiplier : {
					titanium : [0.5, 1],
					copper : [1.4, 2.6],
					silicon: [0, 0],
					gold : [0, 1],
					uranium : [1.2, 2.7],
				}
			},
			{ 
				id : 4,
				src : "src/sprite/a3.png",
				chance : 3,
				rotation : [0.1, 0.3],
				axis : {
					x : [0, 0],
					y : [0, 0]
				},

				r : {
					titanium : 0,
					copper : 0,
					silicon: 0,
					gold : 10,
					uranium : 0,
				},
				multiplier : {
					titanium : [0, 0],
					copper : [0, 0],
					silicon: [0, 0],
					gold : [1, 3.7],
					uranium : [0, 0],
				}
			}
		],

		upgrades : [
			{
				id : 0,
				level : 1,
				name : "Basic Ship Upgrade",
				dex : "+15 Storage",
				fx : {
					type : "storage",
					mod : "bonus",
					data : 15,
					dataType : "n", //n -> number, % -> percentage
				},
				cost : {
					qb : 100,
					// Other resources
				},
				btnSrc : "src/sprite/btnUpgrade.png",
				prsSrc : "src/sprite/prsUpgrade.png",
			},
			{
				id : 1,
				level : 1,
				name : "Laser Upgrade",
				dex : "+4 resources/s",
				fx : {
					type : "laser",
					mod : "bonus",
					data : 4,
					dataType : "n",
				},
				cost : {
					qb : 150,
					// Other resources
				},
				btnSrc : "src/sprite/btnUpgrade.png",
				prsSrc : "src/sprite/prsUpgrade.png",
			},
			{
				id : 2,
				level : 1,
				name : "Booster Capacitor Upgrade",
				dex : "+5% turbo",
				fx : {
					type : "turbo",
					mod : "bonus",
					data : 5,
					dataType : "%",
				},
				cost : {
					qb : 150,
				},
				btnSrc : "src/sprite/btnUpgrade.png",
				prsSrc : "src/sprite/prsUpgrade.png",
			},
			{
				id : 3,
				level : 1,
				name : "Solar Panel Upgrade",
				dex : "+10 energy/s",
				fx : {
					type : "energy",
					mod : "bonus",
					data : 10,
					dataType : "n",
				},
				cost : {
					qb : 150,
					// Other resources
				},
				btnSrc : "src/sprite/btnUpgrade.png",
				prsSrc : "src/sprite/prsUpgrade.png",
			},
		],

		chips : [
			{
				id : 0,
				name : "Energy Chip",
				dex : "+300 Energy Storage",
				compatibility : ["mobo", "energyStorage"],
				rarity : 0,
				//src : "", TODO

				fx : {
					type : "energyStorage",
					mod : "bonus",
					data : 300,
					dataType : "n",
				},
			},
			{
				id : 1,
				name : "Laser Intensifier Chip",
				dex : "+1 Laser Strength (+4 resources/s)",
				compatibility : ["laser"],
				rarity : 0,
				//src : "",

				fx : {
					type : "miningStrength",
					mod : "bonus",
					data : 1,
					dataType : "n",
				},
			},
		],

		chipSlots : [
			{
				id : 0,
				name : "mobo",
				fullName : "Motherboard",
			},
			{
				id : 1,
				name : "laser",
				fullName : "Laser",
			},
			{
				id : 2,
				name : "energyStorage",
				fullName : "Energy Storage",
			},
		],


	},


	// Strings
	_s : { 
		qbits : "qbits",
		qb : "qbits",
		energy : "energy",
		e : "energy",

		r : { // Resources
			titanium : "titanium",
			copper : "copper",
			silicon : "silicon",
			gold : "gold",
			uranium : "uranium",
			food : "food"
		},

		// Decresing order of default priority
		rPrio : ["uranium", "gold", "silicon", "copper", "titanium"],



	}
}




// Contains the data that varies during the game
let game = {

	qbits : 0,
	energy : 368,
	energyMax : 500,

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

	// Array of IDs of the chips available (updates when needed)
	availableChips : [0, 1]

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