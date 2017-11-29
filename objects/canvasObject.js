// Canvas Object to be stored in the gameData object.
// Contains the information about the position and the state of an element on the canvas

class CanvasObj {
	constructor(x, y, img, speed) {
		this.x = x
		this.y = y
		this.scale = 1
		this.img = img

		if (!this.img || !img) {
			this.width = 0
			this.height = 0
		} else {
			this.width = this.img.width
			this.height = this.img.height
		}
		
		this.ticksLeft = null
		if (speed == null) speed = 0
		this.speed = speed
	}

	moveDown(){
		this.y += this.speed
	}

	moveUp(){
		this.y -= this.speed
	}

	moveTo(x, y){
		this.x = x
		this.y = y
	}

	// Getters and Setters

	getX(){
		return this.x
	}

	getY(){
		return this.y
	}

	getWidth(){
		return this.width
	}

	getHeight(){
		return this.height
	}

	getTicksLeft(){
		return this.ticksLeft
	}
}