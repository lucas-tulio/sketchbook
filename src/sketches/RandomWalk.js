import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function RandomWalk(p5, onLoad) {
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
      const direction = p5.random(['up', 'right', 'down', 'left'])
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

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.colorMode(p5.HSB)
    p5.rectMode(p5.CENTER)
    p5.strokeWeight(size)
    p5.frameRate(60)
    p5.background(0)

    p5.createElement('span', 'Click and drag').parent('controls')

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.background(0, 0, 0, 0.1)
    for (let i = 0; i < walkers.length; i++) {
      walkers[i].show()
    }
    if (p5.mouseIsPressed) {
      for (let i = 0; i < brushSize; i++) {
        walkers.push(
          new Walker(
            p5.mouseX - (p5.mouseX % size),
            p5.mouseY - (p5.mouseY % size),
          ),
        )
      }
    }
    cleanUp()
  }
}
