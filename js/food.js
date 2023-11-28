class Food {
	constructor(game) {
		this.game = game
		if (this.game.gameMode === 'portal') {
			this.position = []
			this.foodSprite = []
			this.spawnFood()
		} else {
			this.position = null
			this.foodSprite = null
		}
		this.spawnFood()
	}

	// Clear the food from the canvas
	clear() {
		app.stage.removeChild(this.foodSprite)
	}

	// Clear the exact food from the canvas | Portal Mode
	clearExact(x, y) {
		let toDelete = this.foodSprite.find(food => {
			return food.x === x && food.y === y
		})
		this.foodSprite = this.foodSprite.filter(
			food => food.x !== x || food.y !== y
		)
		this.game.food.position = this.game.food.position.filter(
			food => food.x !== x || food.y !== y
		)

		toDelete.destroy()
	}

	//  Generate food
	spawnFood() {
		// Generate random position for food
		const x = Math.floor(Math.random() * TILE_SIZE) * TILE_SIZE
		const y = Math.floor(Math.random() * TILE_SIZE) * TILE_SIZE

		// Check if food doesn't spawn on the snake
		const snakePositions = this.game.snake.body.map(part => ({
			x: part.x,
			y: part.y,
		}))
		const isFoodOnSnake = snakePositions.some(
			pos =>
				(pos.x === x || pos.x === x + TILE_SIZE) &&
				(pos.y === y || pos.y === y + TILE_SIZE)
		)

		if (isFoodOnSnake) {
			// If food is on the snake, recursively call spawnFood until it's in a valid position
			this.spawnFood()
		} else {
			let foodSprite
			if (this.game.gameMode === 'portal') {
				this.position.push({ x, y })
				this.foodSprite.push(new PIXI.Graphics())
				foodSprite = this.foodSprite.at(-1)
			} else {
				this.position = { x, y }
				this.foodSprite = new PIXI.Graphics()
				foodSprite = this.foodSprite
			}

			// Draw food on the screen

			foodSprite.beginFill(0xff0000)
			foodSprite.drawRect(0, 0, TILE_SIZE, TILE_SIZE)
			foodSprite.endFill()
			foodSprite.position.set(x, y)
			app.stage.addChild(foodSprite)
		}
	}
}
