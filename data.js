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
			spaceship : {
				srcs : "src/sprite/testShip.png",
			},
			stars : {
				srcs : ["src/sprite/s1.png", "src/sprite/s2.png", "src/sprite/s3.png", "src/sprite/s4.png"],
				images : [],
				chances : [50, 30, 15, 5]	// Chnces MUST be in decremental order
			}
		}
	},

	consts : {
		starSpeed : 1,
		starSpawnRate : 18	// The lower, the more likely
	}
}