// Canvas Object to be stored in the data object.
// Contains the information about the position and the state of an element on the canvas

class CanvasObj {
	constructor(x, y, img, speed, w = 0, h = 0) {
		this.x = parseInt(x)
		this.y = parseInt(y)
		this.parent = {
			width : 0,
			height : 0,
		}
		this.scale = 1
		this.img = img
		this.rotationAmount = 0
		this.rotation = 0
		this.axis = 0

		if (!this.img) {
			this.width = w
			this.height = h
		} else {
			this.width = this.img.width
			this.height = this.img.height
		}
		
		this.ticksLeft = null
		if (speed == null) speed = 1
		this.speed = speed
	}

	moveDown() {
		this.y += this.speed
	}

	moveUp() { 
		this.y -= this.speed
	}

	moveTo(x, y) {
		this.x = x
		this.y = y
	}

	rotate() {
		this.rotation += parseFloat(this.getRotationAmount())
	}

	// Getters and Setters

	// Where dpf is "degrees per frame"
	setRotationAmount(dpf) { this.rotationAmount = dpf }

	getRotationAmount() { return parseFloat(this.rotationAmount).toFixedNumber(1) }

	getRotation() { return parseFloat(this.rotation).toFixedNumber(1) }
	
	setAxis(axis) { this.axis = axis }
	
	getAxis() { return this.axis }

	getX(){ return this.x }

	getY(){ return this.y }

	getWidth(){ return this.width }

	getHeight(){ return this.height }

	getCenterX() { return this.getX() + (this.getWidth() / 2) }

	getCenterY() { return this.getY() + (this.getHeight() / 2) }

	getTicksLeft(){ return this.ticksLeft }



	// Static methods that can be called from CanvasObject.method(), passing the instance as argument

	static getWidth(s) {
		return s.width
	}

	static setX(s, x) {
		s.x = x
	}

	static getX(s) {
		return s.x
	}

	static getY(s) {
		return s.y
	}


	static moveDown(s) { 
		s.y += s.speed
	}

	static moveUp(s) { 
		s.y -= s.speed
	}

	static moveTo(s, x, y) {
		s.x = x
		s.y = y
	}

	static rotate(s) {
		s.rotation += parseFloat(s.rotationAmount).toFixedNumber(1)
	}
}