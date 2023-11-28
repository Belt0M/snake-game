const TILE_SIZE = 20
const INIT_SNAKE_LENGTH = 3

const gameField = document.querySelector('.game-field')

let tickerId
console.log(gameField.clientWidth, gameField.clientHeight)
let app = new PIXI.Application({
	width: 600,
	height: 400,
	// backgroundColor: '#9bba5a',
	backgroundAlpha: 0,
})
gameField.appendChild(app.view)

// Inside snake.js

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

	startGameLoop() {
		tickerId = setInterval(() => {
			this.update()
		}, this.speed)
	}

	showMenu() {
		// Implement logic to show the menu
		console.log('Showing the menu!')
		clearInterval(tickerId)
	}

	playGame() {
		this.food = new Food(this)
		// Implement logic to start the game
		console.log('Playing the game!')
		document.querySelector('.menu-container').style.display = 'none'
		document.querySelector('.game-container').style.display = 'flex'
		setTimeout(() => this.startGameLoop(), 250)
	}

	exitGame() {
		// Implement logic to exit the game
		console.log('Exiting the game!')
		clearInterval(tickerId)
		document.querySelector('.menu-container').style.display = 'flex'
		document.querySelector('.game-container').style.display = 'none'
		app.stage.children = []
		game = new Game()
	}

	stopGame() {
		console.log('Stop the game!')
		clearInterval(tickerId)
		document.querySelector('.game-over').style.display = 'flex'
	}

	reloadGame() {
		app.stage.children = []
		this.playGame()
	}

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

	updateScores() {
		this.currentScore = this.snake.body.length - INIT_SNAKE_LENGTH
		if (this.currentScore > this.bestScore) {
			this.bestScore = this.currentScore
		}
		localStorage.setItem('bestScore', this.bestScore)
		document.querySelector('#currentScore').innerHTML = this.currentScore
		document.querySelector('#bestScore').innerHTML = this.bestScore
	}

	setGameMode(mode) {
		// Implement logic to set the game mode
		console.log(`Setting game mode to ${mode}`)
		this.gameMode = mode
	}

	generateWall() {
		const wallColor = 0x291410

		const wallX = Math.floor(Math.random() * TILE_SIZE) * TILE_SIZE
		const wallY = Math.floor(Math.random() * TILE_SIZE) * TILE_SIZE

		const wall = new Wall(wallX, wallY, TILE_SIZE, wallColor)

		this.walls.push(wall)
	}

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

// Inside snake.js

class Snake {
	constructor() {
		this.body = []
		this.direction = 'right'
		this.createSnake()
		this.setupKeyboardControls()
	}

	createSnake() {
		// Initial snake length
		const initialLength = 3
		for (let i = 0; i < initialLength; i++) {
			this.body.push(new PIXI.Graphics())
			this.body[i].beginFill(0x272f17)
			this.body[i].drawRect(0, 0, TILE_SIZE, TILE_SIZE)
			this.body[i].endFill()
			this.body[i].position.set(TILE_SIZE + i * TILE_SIZE, TILE_SIZE)

			app.stage.addChild(this.body[i])
		}
	}

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

	// Snake movements logic
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

	checkCollision() {
		const head = this.body.at(-1)
		// Check collision with walls
		if (
			head.x < 0 ||
			head.x >= app.screen.width ||
			head.y < 0 ||
			head.y >= app.screen.height
		) {
			// Handle game over logic here
			game.stopGame()
			// game.reloadGame()
			return
		}

		// Check collision with itself
		for (let i = 0; i < this.body.length - 2; i++) {
			if (head.x === this.body[i].x && head.y === this.body[i].y) {
				// Handle game over logic here
				game.stopGame()
				// game.reloadGame()
				return
			}
		}
	}

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

	clear() {
		// Remove the food sprite from the stage
		app.stage.removeChild(this.foodSprite)
	}

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

class Wall {
	constructor(x, y, size, color) {
		this.graphics = new PIXI.Graphics()
		this.graphics.beginFill(color)
		this.graphics.drawRect(0, 0, size, size)
		this.graphics.endFill()
		this.graphics.position.set(x, y)
		app.stage.addChild(this.graphics)
	}

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

let game = new Game()

// Listeners and other...
window.onload = () => {
	document
		.querySelector('#exitButton')
		.addEventListener('click', () => game.exitGame())
	document.querySelector('#playButton').addEventListener('click', () => {
		game.playGame()
	})
	document.querySelector('.game-menu').addEventListener('click', () => {
		game.exitGame()
	})
	document.querySelector('.game-over').addEventListener('click', function () {
		this.style.display = 'none'
		game.exitGame()
	})

	// Mode buttons toggling
	const radioButtons = document.querySelectorAll('.radio-button')

	radioButtons.forEach(btn => {
		btn.firstElementChild.addEventListener('change', function () {
			radioButtons.forEach(function (rb) {
				rb.classList.remove('active')
			})
			game.setGameMode(this.value)
			this.closest('.radio-button').classList.add('active')
		})
	})
}
// app.ticker.add(() => {
// 	game.update()
// 	game.snake.checkCollision()
// })
