// Asteroid Object to be stored in data.asteroidsData.
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
		for (let k in base) {
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
		let _s = data._s

		// If priority didn't get declared, get it from the slider slection
		if (priority == null) {
			priority = _s.rPrio[data.miningPriority]
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
				this.destroy(this.getAstID(ast.uniqueID, data.canvas.asteroids))
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
		// Remove the asteroid from data.asteroidsData and the canvas
		if (astID >= 0 && data.asteroidsData.length > 0 && data.canvas.asteroids.length > 0) {
			data.asteroidsData.splice(astID, 1)
			data.canvas.asteroids.splice(astID, 1)

			//Also remove the relative laser, if it was mining
			for (let i = 0; i < data.canvas.lasers.length; i++) {
				if (data.canvas.lasers[i].uniqueID == this.uniqueID) {
					data.canvas.lasers = []
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
		for (let i = 0; i < data.canvas.asteroids.length; i++) {
			if (data.canvas.asteroids[i].uniqueID == this.uniqueID) {
				return i
			}
		}
		return null
	}


	// Static Getters and Setters
	
	static getTypeID(ast) { return ast.typeID }
	static getSrc(ast) { return ast.src }
	static getChance(ast) { return ast.chance }
	static getCurrentResources(ast) { return ast.currentResources }
	static getRotationAmount(ast) { return ast.rotationAmount }
	static getAxis(ast) { return ast.axis }

	static getAstID(uniqueID, astArray) {
		console.log("getID: ", uniqueID, astArray.length) 
		for (let i = 0; i < astArray.length; i++) {
			if (astArray[i].uniqueID == uniqueID) {
				console.log("found " + i)
				return i
			}
		}
		console.log("not found")
		return null
	}


	static mine(ast, strength, priority, _s) {
		// You can't mine food from asteroids you fool
		if (priority == _s.r.food) return null

		let cr = this.getCurrentResources(ast)
		let k = priority
		let nextP = _s.rPrio.indexOf(priority)

		if (cr[k] > 0) {
			let amountMined = 0
			if (cr[k] >= strength) {
				cr[k] -= strength
				amountMined = strength
			} else if (cr[k] < strength) {	
				amountMined = Math.abs(cr[k] - strength)
				cr[k] = 0
				nextP = getNextPrio(cr, k, _s.r)
			}

			return { resource : k, n : amountMined, nextP : nextP}

		} else { // Mine something else, unless it's empty


			if (this.isEmpty(k, cr, _s)) {
				//this.destroy(ast, this.getAstID(ast.uniqueID, astArray), astArray)
				return null

			} else { // Mine something else based on priority rarest first
				if (k != _s.r.uranium && cr[_s.r.uranium] > 0) {
					return this.mine(ast, strength, _s.r.uranium, _s)
				} else if (k != _s.r.gold && cr[_s.r.gold] > 0) {
					return this.mine(ast, strength, _s.r.gold, _s)
				} else if (k != _s.r.silicon && cr[_s.r.silicon] > 0) {
					return this.mine(ast, strength, _s.r.silicon, _s)
				} else if (k != _s.r.copper && cr[_s.r.copper] > 0) {
					return this.mine(ast, strength, _s.r.copper, _s)
				} else if (k != _s.r.titanium && cr[_s.r.titanium] > 0) {
					return this.mine(ast, strength, _s.r.titanium, _s)
				} else {
					//this.destroy(ast, this.getAstID(ast.uniqueID, astArray), astArray)
					return null
				}
			}
		}
	}


	static destroy(ast, astID) {
		// Remove the asteroid from game.asteroidsData and the canvas
		if (astID >= 0) {
			if (game.asteroidsData.length > 0 && data.canvas.asteroids.length > 0) {
				//Also remove the relative laser, if it was mining
				for (let i = 0; i < data.canvas.lasers.length; i++) {
					if (data.canvas.lasers[i].uniqueID == ast.uniqueID) {
						data.canvas.lasers = [] // TODO splice when we have more lasers
						break
					}
				}

				game.asteroidsData.splice(astID, 1)
				data.canvas.asteroids.splice(astID, 1)
			}
		} else {
			throw "Error: null asteroid ID."
		}


		// Animate explosion TODO
		// ...

		// Remove all relative pointers for the CG
	}


	static isEmpty(key, cr, _s) {	
		for (let key in cr) {
			if (key != _s.r['food']) {
				if (cr[key] != 0) {
					return false
				}
			}
		}
		return true
	}

	static getNextPrio(cr, k, _r) {
		return 0

	}

}

/*
let isEmpty = true			
		for (let key in cr) {
			if (key != _s.r['food'] && cr[key] == 0) {
				isEmpty = true
			} else {
				return false
			}
		}
		return isEmpty
*/