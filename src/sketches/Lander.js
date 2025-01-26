import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

function createStars(amount) {
  const stars = []
  for (let i = 0; i < amount; i++) {
    stars.push({
      x: Math.random() * DEFAULT_WIDTH,
      y: Math.random() * DEFAULT_HEIGHT,
    })
  }
  return stars
}

export function Lander(p5, onLoad) {
  class Ship {
    constructor(x, y) {
      this.w = 4
      this.h = 12
      this.pos = p5.createVector(x, y)
      this.acc = p5.createVector()
      this.vel = p5.createVector()
    }

    update() {
      // Add gravity to acceleration
      this.acc.add(p5.createVector(0, 0.0001))

      // Add acceleration to velocity
      this.vel.add(this.acc)

      // Add velocity to position
      this.pos.add(this.vel)
    }

    show() {
      p5.fill(0, 0, 100)
      p5.triangle(
        this.pos.x - this.w,
        this.pos.y,
        this.pos.x,
        this.pos.y - this.h,
        this.pos.x + this.w,
        this.pos.y,
      )
      p5.fill(0, 100, 100)
      p5.noStroke()
      p5.rect(this.pos.x - 2, this.pos.y - 1, 4, 2)
    }
  }

  function reset() {
    ship = new Ship(DEFAULT_WIDTH / 2, 20)
  }

  const stars = createStars(100)
  let ship

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.colorMode(p5.HSB)

    reset()

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.background(240, 100, 15)
    // Stars
    p5.stroke(0, 0, 100)
    for (const star of stars) {
      p5.point(star.x, star.y)
    }
    // Ship
    ship.update()
    ship.show(p5)
  }

  p5.keyPressed = () => {
    if (p5.key === 'r') {
      reset()
    }
  }
}
