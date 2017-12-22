// Asteroid Object to be stored in gameData.asteroidsData.
// Contains the information about the resources inside the asteroid
// and other info

class AsteroidObj {
	constructor(ast) {
		this.typeID = parseInt(ast.id)
		this.uniqueID = parseInt(ast.uniqueID)
		this.baseResources = ast.r
		this.src = ast.src
		this.chance = ast.chance
		this.multiplier = ast.multiplier
		this.resources = this.calcResources(this.baseResources, this.multiplier)
		this.currentResources = this.resources	
		this.rotationAmount = this.calcRotation(ast.rotation)
		this.axis = this.calcAxis(ast.axis)
	}
	
	// When created, it calculates the max amount of resources 
	// in the asteroid depending on its type and RNG.
	calcResources(base, mult) {
		let b = {
			titanium : 0,
			copper : 0,
			silicon: 0,
			gold : 0,
			uranium : 0,
		}
		for (k in base) {
			let m = (getRandom(mult[k][0], mult[k][1])).toFixedNumber(1)
			b[k] = (base[k] * m).toFixed() 
		}
		return b
	}

	// Calculates the rotation at which the asteroid revolves (dgr/frame)
	calcRotation(rot) {
		return getRandomFloat(rot[0], rot[1], 2)
	}

	// Calculates a random offset for the axis on which it rotates
	calcAxis(axis) {
		let r = {
			x : getRandomFloat(axis.x[0], axis.x[1], 1),
			y : getRandomFloat(axis.y[0], axis.y[1], 1)
		}

		let sign = getRandom(0, 1)
		if (sign == 0) { r.x = -r.x }

		sign = getRandom(0, 1)
		if (sign == 0) { r.y = -r.y }

		return r
	}



	// Adds the mined resources to the player's inventory
	// -strength (int) is the amount of resource mined per call
	// -priority (obj key) is the resource being prioritized. If the resource is  
	// not present, it mines the rest, rarest first
	mine(strength, priority) {
		//console.log("mining " + priority)
		let _s = gameData._s

		// If priority didn't get declared, get it from the slider slection
		if (priority == null) {
			priority = _s.rPrio[gameData.miningPriority]
		}

		// You can't mine food from asteroids you fool
		if (priority == _s.r.food) {
			return null
		}

		let cr = this.currentResources
		let k = priority

		if (cr[k] > 0) {
			let amountMined = 0
			if (cr[k] >= strength) {
				cr[k] -= strength
				amountMined = strength
			} else if (cr[k] < strength) {	
				amountMined = Math.abs(cr[k] - strength)
				cr[k] = 0
			}

			return { resource : k, n : amountMined }

		} else { // Mine something else, unless it's empty
			let isEmpty = true			
			for (let key in cr) {
				if (key != _s.r['food'] && cr[key] == 0) {
					isEmpty = true
				} else {
					isEmpty = false
					break
				}
			}
			if (isEmpty) {
				this.destroy(this.getAstID())
				return null

			} else { // Mine something else based on priority rarest first
				if (k != _s.r.uranium && cr[_s.r.uranium] > 0) {
					return this.mine(strength, _s.r.uranium)
				} else if (k != _s.r.gold && cr[_s.r.gold] > 0) {
					return this.mine(strength, _s.r.gold)
				} else if (k != _s.r.silicon && cr[_s.r.silicon] > 0) {
					return this.mine(strength, _s.r.silicon)
				} else if (k != _s.r.copper && cr[_s.r.copper] > 0) {
					return this.mine(strength, _s.r.copper)
				} else if (k != _s.r.titanium && cr[_s.r.titanium] > 0) {
					return this.mine(strength, _s.r.titanium)
				} else {
					return null
				}
			}
		}
	}


	// Destroys the asteroid once the resources have been depleated.
	// astID is NOT this.typeID, it is the index of the asteroid in asteroidsData.
	destroy(astID) {
		// Remove the asteroid from gameData.asteroidsData and the canvas
		if (astID > -1 && gameData.asteroidsData.length > 0 && gameData.canvas.asteroids.length > 0) {
			gameData.asteroidsData.splice(astID, 1)
			gameData.canvas.asteroids.splice(astID, 1)

			//Also remove the relative laser, if it was mining
			for (let i = 0; i < gameData.canvas.lasers.length; i++) {
				if (gameData.canvas.lasers[i].uniqueID == this.uniqueID) {
					gameData.canvas.lasers = []
				}
			}


		} else {
			//TODO Throw error
		}


		// Animate explosion TODO
		// ...

		// Remove all relative pointers so CG can clean the memory
	}


	// Getters and Setters
	getTypeID() { return this.typeID }
	getSrc() { return this.src }
	getChance() { return this.chance }
	getResources() { return this.currentResources }
	getRotationAmount() { return this.rotationAmount }
	getAxis() { return this.axis }

	getAstID() { 
		for (let i = 0; i < gameData.canvas.asteroids.length; i++) {
			if (gameData.canvas.asteroids[i].uniqueID == this.uniqueID) {
				return i
			}
		}
		return null
	}
}