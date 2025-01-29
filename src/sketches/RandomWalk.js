import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function RandomWalk(p5, onLoad) {
  const DEFAULT_SPEED = 10
  const DEFAULT_SIZE = 20
  const DEFAULT_TRAIL = 0.5

  let size
  let speed
  let trail
  const spread = 1 // how many times it will move

  const walkers = []

  function Walker(x, y) {
    this.x = x
    this.y = y
    this.age = 0
    this.maxAge = 720
    this.removeFromList = false

    this.move = function () {
      const direction = p5.random(['up', 'right', 'down', 'left'])
      if (direction === 'up') {
        this.y -= size.value()
      } else if (direction === 'right') {
        this.x += size.value()
      } else if (direction === 'down') {
        this.y += size.value()
      } else if (direction === 'left') {
        this.x -= size.value()
      }
    }

    this.show = function () {
      const a = 1 / this.age
      const normalizedAlpha = Math.max(a, 0.05)
      p5.stroke((this.age * 0.5) % 360, 100, 100, 1)
      p5.point(this.x, this.y)
      for (let i = 0; i < spread; i++) {
        this.move()
      }
      this.age++
      if (this.age >= this.maxAge) {
        this.removeFromList = true
      }
    }
  }

  function cleanUp() {
    for (let i = walkers.length - 1; i >= 0; i--) {
      if (walkers[i].removeFromList) {
        walkers.splice(i, 1)
      }
    }
  }

  function reset() {
    walkers.splice(0, walkers.length)
    walkers.push(new Walker(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2))
  }

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.colorMode(p5.HSB)
    p5.rectMode(p5.CENTER)
    p5.strokeWeight(DEFAULT_SIZE)
    p5.frameRate(DEFAULT_SPEED)
    p5.background(0)

    p5.createElement('span', 'Click and drag').parent('controls')
    p5.createElement('br').parent('controls')
    p5.createElement('span', 'Press R to reset').parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Size').parent('controls')
    size = p5.createSlider(1, 30, DEFAULT_SIZE, 1).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Speed').parent('controls')
    speed = p5.createSlider(1, 60, DEFAULT_SPEED, 1).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Trail').parent('controls')
    trail = p5.createSlider(0.01, 0.95, DEFAULT_TRAIL, 0.01).parent('controls')
    p5.createElement('br').parent('controls')

    size.elt.addEventListener('input', (event) => {
      p5.strokeWeight(event.target.value)
    })

    speed.elt.addEventListener('input', (event) => {
      const speed = parseInt(event.target.value)
      p5.frameRate(speed)
    })

    walkers.push(new Walker(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2))

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.background(0, 0, 0, 1 - trail.value())
    for (let i = 0; i < walkers.length; i++) {
      walkers[i].show()
    }
    if (p5.mouseIsPressed) {
      if (
        p5.mouseX < DEFAULT_WIDTH &&
        p5.mouseY < DEFAULT_HEIGHT &&
        p5.mouseX > 0 &&
        p5.mouseY > 0
      ) {
        walkers.push(
          new Walker(
            p5.mouseX - (p5.mouseX % size.value()),
            p5.mouseY - (p5.mouseY % size.value()),
          ),
        )
      }
    }
    cleanUp()
  }

  p5.keyPressed = () => {
    if (p5.key === 'r') {
      reset()
    }
  }
}
