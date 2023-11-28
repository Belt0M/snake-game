class Game {
	constructor() {
		this.snake = new Snake()
		this.tileSize = 20
		this.bestScore = localStorage.getItem('bestScore') || 0
		this.currentScore = 0
		this.gameMode = 'classic' // Default game mode (classic, noDie, walls, portal, speed)
		this.speed = 100
		this.walls = []
		this.updateScores()
	}

	// Set game loop
	startGameLoop() {
		tickerId = setInterval(() => {
			this.update()
		}, this.speed)
	}

	// Show menu on button click
	showMenu() {
		console.log('Showing the menu!')
		clearInterval(tickerId)
	}

	playGame() {
		this.food = new Food(this)
		document.querySelector('.menu-container').style.display = 'none'
		document.querySelector('.game-container').style.display = 'flex'
		setTimeout(() => this.startGameLoop(), 250)
	}

	// Exit to main menu
	exitGame() {
		clearInterval(tickerId)
		document.querySelector('.menu-container').style.display = 'flex'
		document.querySelector('.game-container').style.display = 'none'
		app.stage.children = []
		game = new Game()
	}

	// Pause the game and show Game Over banner
	stopGame() {
		clearInterval(tickerId)
		document.querySelector('.game-over').style.display = 'flex'
	}

	// Reload game and clear canvas after loose
	reloadGame() {
		app.stage.children = []
		this.playGame()
	}

	// Game loop update method
	update() {
		this.snake.move()
		this.gameMode === 'portal'
			? this.checkTwoFoodCollisions()
			: this.checkFoodCollision()
		switch (this.gameMode) {
			case 'noDie':
				this.snake.checkNoDieCollision()
				break
			case 'walls':
				this.checkWallsCollision()
				break
			default:
				this.snake.checkCollision()
				break
		}
	}

	// Check snake collision with food
	checkFoodCollision() {
		const head = this.snake.body.at(-1)
		const foodX = this.food.position.x
		const foodY = this.food.position.y
		if (
			(head.x === foodX || head.x === foodX + TILE_SIZE - 1) &&
			(head.y === foodY || head.y === foodY + TILE_SIZE - 1)
		) {
			this.snake.grow()
			this.food.clear()
			this.food.spawnFood()
			this.updateScores()

			switch (this.gameMode) {
				case 'walls':
					this.generateWall()
					break
				case 'speed':
					clearInterval(tickerId)
					this.speed *= 0.9
					tickerId = setInterval(() => {
						this.update()
					}, this.speed)
					break
				default:
					break
			}
		}
	}

	// Check snake collision with food | Portal mode
	checkTwoFoodCollisions() {
		const head = this.snake.body.at(-1)
		this.food.position.forEach(food => {
			const foodX = food.x
			const foodY = food.y
			if (
				(head.x === foodX || head.x === foodX + TILE_SIZE - 1) &&
				(head.y === foodY || head.y === foodY + TILE_SIZE - 1)
			) {
				this.snake.grow()
				this.food.clearExact(foodX, foodY)
				head.x = this.food.position.at(-1).x
				head.y = this.food.position.at(-1).y
				this.food.clearExact(head.x, head.y)
				// this.handlePortalMode()
				this.food.spawnFood()
				this.food.spawnFood()
				this.updateScores()
			}
		})
	}

	// Update current and best scores
	updateScores() {
		this.currentScore = this.snake.body.length - INIT_SNAKE_LENGTH
		if (this.currentScore > this.bestScore) {
			this.bestScore = this.currentScore
		}
		localStorage.setItem('bestScore', this.bestScore)
		document.querySelector('#currentScore').innerHTML = this.currentScore
		document.querySelector('#bestScore').innerHTML = this.bestScore
	}

	// Set game mode
	setGameMode(mode) {
		this.gameMode = mode
	}

	// Generate wall on the snake collision with food
	generateWall() {
		const wallColor = 0x291410

		const wallX = Math.floor(Math.random() * TILE_SIZE) * TILE_SIZE
		const wallY = Math.floor(Math.random() * TILE_SIZE) * TILE_SIZE

		const wall = new Wall(wallX, wallY, TILE_SIZE, wallColor)

		this.walls.push(wall)
	}

	// Check walls collision
	checkWallsCollision() {
		console.log(this.walls)
		const head = this.snake.body.at(-1)

		for (const wall of this.walls) {
			if (
				head.x < wall.x + wall.width &&
				head.x + TILE_SIZE > wall.x &&
				head.y < wall.y + wall.height &&
				head.y + TILE_SIZE > wall.y
			) {
				this.stopGame()
				// this.reloadGame()

				return
			}
		}
	}
}
