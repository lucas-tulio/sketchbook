import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function RandomWalk(sketch, onLoad) {
  const size = 4
  const brushSize = 5
  const spread = 1 // how many times it will move

  const walkers = []

  function Walker(x, y) {
    this.x = x
    this.y = y
    this.age = 0
    this.maxAge = 720
    this.removeFromList = false

    this.move = function () {
      const direction = sketch.random(['up', 'right', 'down', 'left'])
      if (direction === 'up') {
        this.y -= size
      } else if (direction === 'right') {
        this.x += size
      } else if (direction === 'down') {
        this.y += size
      } else if (direction === 'left') {
        this.x -= size
      }
    }

    this.show = function () {
      const a = 1 / this.age
      const normalizedAlpha = Math.max(a, 0.05)
      sketch.stroke((this.age * 0.5) % 360, 100, 100, 1)
      sketch.point(this.x, this.y)
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

  sketch.setup = () => {
    sketch.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    sketch.colorMode(sketch.HSB)
    sketch.rectMode(sketch.CENTER)
    sketch.strokeWeight(size)
    sketch.frameRate(60)
    sketch.background(0)

    sketch.createElement('span', 'Click and drag').parent('controls')

    if (onLoad) {
      onLoad()
    }
  }

  sketch.draw = () => {
    sketch.background(0, 0, 0, 0.1)
    for (let i = 0; i < walkers.length; i++) {
      walkers[i].show()
    }
    if (sketch.mouseIsPressed) {
      for (let i = 0; i < brushSize; i++) {
        walkers.push(
          new Walker(
            sketch.mouseX - (sketch.mouseX % size),
            sketch.mouseY - (sketch.mouseY % size),
          ),
        )
      }
    }
    cleanUp()
  }
}
