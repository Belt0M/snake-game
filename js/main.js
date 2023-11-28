const TILE_SIZE = 20
const INIT_SNAKE_LENGTH = 3

const gameField = document.querySelector('.game-field')

// Game loop set interval id
let tickerId

// Init canvas
let app = new PIXI.Application({
	width: 600,
	height: 400,
	// backgroundColor: '#9bba5a',
	backgroundAlpha: 0,
})
gameField.appendChild(app.view)

let game = new Game()

// Buttons listeners and other...
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
