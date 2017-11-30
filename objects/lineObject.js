// Line Object, used only for stroke lines in the canvas
// such as the mining lasers

class LineObject {
	constructor(startX, startY, endX, endY, stroke, color) {
		this.uniqueID = 0

		this.startX = Math.round(startX)
		this.startY = Math.round(startY)
		this.endX = Math.round(endX)
		this.endY = Math.round(endY)

		this.scale = 1

		this.length = this.setLength()
		this.width = this.length
		this.stroke = stroke
		this.color = color
	}

	// Simply replaces the position of the line with a new one
	reposition(newStartX, newStartY, newEndX, newEndY) {
		this.startX = newStartX
		this.startY = newStartY
		this.endX = newEndX
		this.endY = newEndY

		this.length = this.getLength()
		this.width = this.length
	}

	setLength() {
		let h = Math.abs(this.startX - this.endX)
		let v = Math.abs(this.startY - this.endY)
		return Math.round(Math.hypot(h, v))
	}

	
	// Getters and Setters

	getStartX(){ return this.startX }

	getStartY(){ return this.startY }

	getEndX(){ return this.endX }

	getEndY(){ return this.endY }

	getLength(){ return this.length }

	getStroke(){ return this.stroke }

	getColor(){ return this.color }
}