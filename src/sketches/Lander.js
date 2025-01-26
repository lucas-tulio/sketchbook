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

window.addEventListener('keydown', (e) => {
  e.preventDefault() // prevent page scrolling
})

export function Lander(p5, onLoad) {
  const stars = createStars(100)
  let ship
  const gravity = p5.createVector(0, 0.01)
  const thrust = p5.createVector(0, -0.05)

  class Ship {
    constructor(x, y) {
      this.w = 4
      this.h = 12
      this.pos = p5.createVector(x, y)
      this.vel = p5.createVector()
    }

    update() {
      const acc = p5.createVector()
      if (p5.keyIsDown(p5.UP_ARROW)) {
        acc.add(thrust)
      }
      acc.add(gravity)
      this.vel.add(acc)
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
    ship.show()
  }

  p5.keyPressed = (event) => {
    if (p5.key === 'r') {
      reset()
    }
  }
}
