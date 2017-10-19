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

		/*console : {
			background : "",
		}*/
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
					src : "src/sprite/console.png",
					image : null
				},

				display : {
					src : "src/sprite/spaceTime.png",
					image : null
				}
			}
		}
	},

	consts : {
		starSpeed : 1,
		starSpawnRate : 18	// The lower, the more likely
	},


}