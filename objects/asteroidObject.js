// Asteroid Objeect to be stored in gameData.asteroidsData.
// Contains the information about the resources inside the asteroid
// and other info

class AsteroidObj {
	constructor(ast) {
		this.id = ast.id
		this.baseResources = ast.r
		this.multiplier = ast.multiplier
		this.resources = this.calculateResources(this.baseResources, this.multiplier)
		this.currentResources = this.resources
	}
	
	// Calculates the max amount of resources in the asteroid depending on its type and RNG
	calculateResources(base, mult) {
		for (k in base) {
			let m = (getRandom(mult[k][0], mult[k][1])).toFixed(1)
			base[k] = (base[k] * m).toFixed()
		}
		return base
	}


	// Adds the mined resources to the player's inventory
	// -strength (int) is the amount of resource mined per call
	// -priority (obj key) is the resource being prioritized. If the resource is not 
	// present, it mines the rest, rarest first
	mine(strength, priority) {
		let _s = gameData._s

		// If priority didn't get declared, get it from the slider slection
		if (priority == null) {
			priority = _s.rPrio[gameData.miningPriority]
		}

		// You can't mine food from asteroids you fool
		if (priority == _s.r['food']) {
			return
		}

		let cr = this.currentResources
		let k = priority

		if (cr[k] > 0) {
			let amountMined = 0
			if (cr[k] >= strength) {
				cr[k] -= strength
				amountMined = strength
			} else if (cr[k] < strength) {	
				amountMined = cr[k] - strength
				cr[k] = 0
			}
			// TODO
			//addResource(amountMined, k)

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
				this.destroy(this.id)
			}
			else { // Mine something else based on priority rarest first
				if (k != _s.r['uranium'] && cr[_s.r['uranium']] > 0) {
					this.mine(strength, _s.r['uranium'])
				} else if (k != _s.r['gold'] && cr[_s.r['gold']] > 0) {
					this.mine(strength, _s.r['gold'])
				} else if (k != _s.r['silicon'] && cr[_s.r['silicon']] > 0) {
					this.mine(strength, _s.r['silicon'])
				} else if (k != _s.r['copper'] && cr[_s.r['copper']] > 0) {
					this.mine(strength, _s.r['copper'])
				} else  if (k != _s.r['titanium'] && cr[_s.r['titanium']] > 0) {
					this.mine(strength, _s.r['titanium'])
				}
			}
			
		}
	}


	// Destroys the asteroid once the resources have been depleated
	destroy(astID) {
		// TODO
	}


	// Getters and Setters
	getResources() {
		return this.resources
	}

	getCurrentResources() {
		return this.currentResources
	}

}