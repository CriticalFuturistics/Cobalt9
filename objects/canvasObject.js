// Canvas Object to be stored in the gameData object.
// Contains the information about the position and the state of an element on the canvas

class canvasObject {
	constructor(x, y, img) {
		this.x = x
		this.y = y
		this.img = img
		this.scale = 1

		if (!this.img || !img) {
			this.width = 0
			this.height = 0
		} else {
			this.width = this.img.width
			this.height = this.img.height
		}
		
		this.ticksLeft = null
		this.state = null
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

	moveUp(){
		this.y -= this.speed
	}

	moveTo(x, y){
		this.x = x
		this.y = y
	}


}