class Wall {
	constructor(x, y, size, color) {
		this.graphics = new PIXI.Graphics()
		this.graphics.beginFill(color)
		this.graphics.drawRect(0, 0, size, size)
		this.graphics.endFill()
		this.graphics.position.set(x, y)
		app.stage.addChild(this.graphics)
	}
	// Wall parameters getters
	get x() {
		return this.graphics.x
	}

	get y() {
		return this.graphics.y
	}

	get width() {
		return this.graphics.width
	}

	get height() {
		return this.graphics.height
	}
}
