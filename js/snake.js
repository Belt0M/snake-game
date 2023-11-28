class Snake {
	constructor() {
		this.body = []
		this.direction = 'right'
		this.createSnake()
		this.setupKeyboardControls()
	}

	// Generate snake
	createSnake() {
		for (let i = 0; i < INIT_SNAKE_LENGTH; i++) {
			this.body.push(new PIXI.Graphics())
			this.body[i].beginFill(0x272f17)
			this.body[i].drawRect(0, 0, TILE_SIZE, TILE_SIZE)
			this.body[i].endFill()
			this.body[i].position.set(TILE_SIZE + i * TILE_SIZE, TILE_SIZE)

			app.stage.addChild(this.body[i])
		}
	}

	// Change snake direction on keydown
	setupKeyboardControls() {
		// Handle keyboard input
		window.addEventListener('keydown', e => {
			// Check and restrict opposite direction turns
			if (
				(this.direction === 'left' && e.key === 'ArrowRight') ||
				(this.direction === 'right' && e.key === 'ArrowLeft') ||
				(this.direction === 'up' && e.key === 'ArrowDown') ||
				(this.direction === 'down' && e.key === 'ArrowUp')
			) {
				return
			} else {
				if (e.key.includes('Arrow')) {
					this.direction = e.key.split('Arrow')[1].toLowerCase()
				}
			}
		})
	}

	// Snake movements logic depending on direction
	move() {
		const head = this.body.at(-1)
		const bodyLength = this.body.length
		const currentDirection = this.direction

		for (let i = 0; i < bodyLength - 1; i++) {
			this.body[i].position = this.body[i + 1].position
		}
		if (['down', 'up'].includes(currentDirection)) {
			let mult = currentDirection === 'down' ? 1 : -1
			head.y += TILE_SIZE * mult
		} else {
			let mult = currentDirection === 'right' ? 1 : -1
			head.x += TILE_SIZE * mult
		}
	}

	// Grow snake
	grow() {
		const tail = this.body[0]

		const newPart = new PIXI.Graphics()
		newPart.beginFill(0x272f17)
		newPart.drawRect(0, 0, TILE_SIZE, TILE_SIZE)
		newPart.endFill()
		newPart.position.set(tail.x, tail.y)
		app.stage.addChild(newPart)
		this.body.unshift(newPart)
	}

	// Check canvas borders and itself collision
	checkCollision() {
		const head = this.body.at(-1)
		// Check collision with borders
		if (
			head.x < 0 ||
			head.x >= app.screen.width ||
			head.y < 0 ||
			head.y >= app.screen.height
		) {
			game.stopGame()
			return
		}

		// Check collision with itself
		for (let i = 0; i < this.body.length - 2; i++) {
			if (head.x === this.body[i].x && head.y === this.body[i].y) {
				game.stopGame()
				return
			}
		}
	}

	// Move the snake to the other side on border collision
	checkNoDieCollision() {
		const head = this.body.at(-1)

		// Check collision with walls
		if (head.x < 0) {
			head.x = app.screen.width
		} else if (head.x >= app.screen.width) {
			head.x = 0
		} else if (head.y < 0) {
			head.y = app.screen.height
		} else if (head.y >= app.screen.height) {
			head.y = 0
		}
	}
}
