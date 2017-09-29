// Canvas Object to be stored in the gameData object.
// Contains the information about the position and the state of an element on the canvas

class canvasObject {
	constructor(x, y, src) {
		this.x = x
		this.y = y
		this.src = src

		let img = new Image()
		img.src = this.src

		this.width = img.width
		this.height = img.height
		this.ticksLeft = null
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


}