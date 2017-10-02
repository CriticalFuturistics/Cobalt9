// Canvas Object to be stored in the gameData object.
// Contains the information about the position and the state of an element on the canvas

class canvasObject {
	constructor(x, y, src) {
		this.x = x
		this.y = y
		this.img = new Image()
		this.src = src
		this.img.src = this.src

		this.width = this.img.width
		this.height = this.img.height
		this.ticksLeft = null
		this.speed = 1
	}

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

	moveDown(){
		this.y += this.speed
	}


}