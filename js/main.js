const gameField = document.querySelector('.game-field')

let tickerId

let app = new PIXI.Application({
	width: gameField.clientWidth,
	height: gameField.clientHeight,
	backgroundColor: '#9bba5a',
})
gameField.appendChild(app.view)

// Inside snake.js

class Game {
	constructor() {
		this.snake = new Snake()
		this.food = new Food(this)
		this.bestScore = 0
		this.currentScore = 0
		this.gameMode = 'Classic' // Default game mode
		// this.setupGUI()
	}

	// setupGUI() {
	// 	const guiContainer = new PIXI.Container()
	// 	app.stage.addChild(guiContainer)

	// 	// Labels
	// 	const bestScoreLabel = new PIXI.Text('Best Score: 0', { fill: 0xffffff })
	// 	bestScoreLabel.position.set(10, 10)
	// 	guiContainer.addChild(bestScoreLabel)

	// 	const currentScoreLabel = new PIXI.Text('Current Score: 0', {
	// 		fill: 0xffffff,
	// 	})
	// 	currentScoreLabel.position.set(10, 30)
	// 	guiContainer.addChild(currentScoreLabel)

	// 	// Buttons and Radio List
	// 	const playButton = new PIXI.Text('Play', { fill: 0xffffff })
	// 	playButton.position.set(10, 70)
	// 	playButton.interactive = true
	// 	playButton.buttonMode = true
	// 	playButton.on('pointerdown', () => this.playGame())
	// 	guiContainer.addChild(playButton)

	// 	const exitButton = new PIXI.Text('Exit', { fill: 0xffffff })
	// 	exitButton.position.set(80, 70)
	// 	exitButton.interactive = true
	// 	exitButton.buttonMode = true
	// 	exitButton.on('pointerdown', () => this.exitGame())
	// 	guiContainer.addChild(exitButton)

	// 	const menuButton = new PIXI.Text('Menu', { fill: 0xffffff })
	// 	menuButton.position.set(150, 70)
	// 	menuButton.interactive = true
	// 	menuButton.buttonMode = true
	// 	menuButton.on('pointerdown', () => this.showMenu())
	// 	guiContainer.addChild(menuButton)

	// 	const gameModes = ['Classic', 'No Die', 'Walls', 'Portal', 'Speed']
	// 	const radioList = new PIXI.Text('Game Modes: ', { fill: 0xffffff })
	// 	radioList.position.set(10, 100)
	// 	guiContainer.addChild(radioList)

	// 	gameModes.forEach((mode, index) => {
	// 		const radioItem = new PIXI.Text(mode, { fill: 0xffffff })
	// 		radioItem.position.set(10 + index * 70, 120)
	// 		radioItem.interactive = true
	// 		radioItem.buttonMode = true
	// 		radioItem.on('pointerdown', () => this.setGameMode(mode))
	// 		guiContainer.addChild(radioItem)
	// 	})
	// }

	update() {
		this.snake.move()
		this.checkFoodCollision()
		// this.updateScores()
	}

	checkFoodCollision() {
		const head = this.snake.body[0]

		if (head.x === this.food.position.x && head.y === this.food.position.y) {
			this.snake.grow()
			this.food.spawnFood()
			// this.updateScores()
		}
	}

	// updateScores() {
	// 	this.currentScore = this.snake.body.length - 3
	// 	if (this.currentScore > this.bestScore) {
	// 		this.bestScore = this.currentScore
	// 	}

	// 	// Update GUI
	// 	const guiContainer = app.stage.children[0]

	// 	// Find bestScoreLabel and currentScoreLabel
	// 	const bestScoreLabel = guiContainer.children.find(
	// 		child => child.text && child.text.startsWith('Best Score')
	// 	)
	// 	const currentScoreLabel = guiContainer.children.find(
	// 		child => child.text && child.text.startsWith('Current Score')
	// 	)

	// 	// Check if labels are found before updating
	// 	if (bestScoreLabel) {
	// 		bestScoreLabel.text = `Best Score: ${this.bestScore}`
	// 	}

	// 	if (currentScoreLabel) {
	// 		currentScoreLabel.text = `Current Score: ${this.currentScore}`
	// 	}
	// }

	playGame() {
		// Implement logic to start the game
		console.log('Playing the game!')
	}

	exitGame() {
		// Implement logic to exit the game
		console.log('Exiting the game!')
	}

	showMenu() {
		// Implement logic to show the menu
		console.log('Showing the menu!')
	}

	setGameMode(mode) {
		// Implement logic to set the game mode
		console.log(`Setting game mode to ${mode}`)
		this.gameMode = mode
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
			this.body[i].drawRect(0, 0, 20, 20)
			this.body[i].endFill()
			this.body[i].position.set(20 + i * 20, 20)

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
			head.y += 20 * mult
		} else {
			let mult = currentDirection === 'right' ? 1 : -1
			head.x += 20 * mult
		}
	}

	grow() {
		const tail = this.body[this.body.length - 1]
		const newPart = new PIXI.Graphics()
		newPart.beginFill(0x272f17)
		newPart.drawRect(tail.x, tail.y, 20, 20)
		newPart.endFill()
		app.stage.addChild(newPart)
		this.body.push(newPart)
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
			clearInterval(tickerId)
			alert('Game Over - Hit the wall!')
			return
		}

		// Check collision with itself
		for (let i = 0; i < this.body.length - 2; i++) {
			console.log(head.x)
			if (head.x === this.body[i].x && head.y === this.body[i].y) {
				// Handle game over logic here
				clearInterval(tickerId)
				alert('Game Over - Hit yourself!')
				return
			}
		}
	}
}

class Food {
	constructor(game) {
		this.game = game
		this.position = { x: 0, y: 0 }
		this.spawnFood()
	}

	spawnFood() {
		// Generate random position for food
		const x = Math.floor(Math.random() * 20) * 20
		const y = Math.floor(Math.random() * 20) * 20

		// Check if food doesn't spawn on the snake
		const snakePositions = this.game.snake.body.map(part => ({
			x: part.x,
			y: part.y,
		}))
		const isFoodOnSnake = snakePositions.some(pos => pos.x === x && pos.y === y)

		if (isFoodOnSnake) {
			// If food is on the snake, recursively call spawnFood until it's in a valid position
			this.spawnFood()
		} else {
			this.position = { x, y }

			// Draw food on the screen
			const graphics = new PIXI.Graphics()
			graphics.beginFill(0xff0000)
			graphics.drawRect(this.position.x, this.position.y, 20, 20)
			graphics.endFill()
			app.stage.addChild(graphics)
		}
	}
}

const game = new Game()

tickerId = setInterval(() => {
	game.update()
	game.snake.checkCollision()
}, 75)

// app.ticker.add(() => {
// 	game.update()
// 	game.snake.checkCollision()
// })
