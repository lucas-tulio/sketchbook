import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function Collisions(p5, onLoad) {
  const DEFAULT_BALL_COUNT = 300
  const DEFAULT_BALL_SIZE = 10
  const DEFAULT_WIGGLE = 0.1
  const DEFAULT_HUE = 220
  const MAX_SPEED = 5
  const ATTRITION = -0.1

  const balls = []

  let gravityCheckbox
  let gravity = 0.0001
  let ballSize
  let ballCount
  let vibration
  let hue

  function createBall(x, y) {
    if (x && y) {
      return new Ball(x, y)
    }
    return new Ball(p5.random(p5.width), p5.random(p5.height))
  }

  function Ball(x, y) {
    this.x = x
    this.y = y
    this.acceleration = p5.createVector(0, 0)
    this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 1))
    this.velocity.setMag(1)
    this.radius = ballSize.value()

    this.draw = function () {
      p5.circle(this.x, this.y, this.radius)
    }

    this.applyGravity = function () {
      if (gravityCheckbox.checked()) {
        this.acceleration.y += gravity
      } else {
        this.acceleration.y = 0
      }
    }

    this.applyVibration = function () {
      this.velocity.x = this.velocity.x + p5.random(-vibration.value(), vibration.value())
      this.velocity.y = this.velocity.y + p5.random(-vibration.value(), vibration.value())
    }

    this.applyMaxSpeed = function () {
      if (this.velocity.x >= MAX_SPEED) {
        this.velocity.x = MAX_SPEED
      } else if (this.velocity.x <= -MAX_SPEED) {
        this.velocity.x = -MAX_SPEED
      }
      if (this.velocity.y >= MAX_SPEED) {
        this.velocity.y = MAX_SPEED
      } else if (this.velocity.y <= -MAX_SPEED) {
        this.velocity.y = -MAX_SPEED
      }
    }

    this.bounceOnEdges = function () {
      if (this.x - this.radius / 2 < 0 || this.x + this.radius / 2 > p5.width) {
        this.velocity.x = -this.velocity.x
        this.velocity.x += this.velocity.x * ATTRITION
      }
      if (this.y - this.radius / 2 < 0 || this.y + this.radius / 2 > p5.height) {
        this.velocity.y = -this.velocity.y
        this.velocity.y += this.velocity.y * ATTRITION
      }
      // Avoid going thru walls
      if (this.x < this.radius / 2) {
        this.x = this.radius / 2
      } else if (this.x > p5.width - this.radius / 2) {
        this.x = p5.width - this.radius / 2
      }
      if (this.y < this.radius / 2) {
        this.y = this.radius / 2
      } else if (this.y > p5.height - this.radius / 2) {
        this.y = p5.height - this.radius / 2
      }
    }

    this.bounceOnIntersect = function () {
      for (let i = 0; i < balls.length; i++) {
        if (this === balls[i]) {
          continue // Skip self
        }

        let dx = this.x - balls[i].x
        let dy = this.y - balls[i].y
        let distanceSquared = dx * dx + dy * dy

        let radiiSumSquared = this.radius * this.radius
        if (distanceSquared < radiiSumSquared) {
          // Collision detected
          let vx = this.velocity.x - balls[i].velocity.x
          let vy = this.velocity.y - balls[i].velocity.y

          // Check if the balls are moving towards each other
          if (vx * dx + vy * dy < 0) {
            let factor = (vx * dx + vy * dy) / distanceSquared
            let dvx = factor * dx
            let dvy = factor * dy

            // Adjust velocities
            this.velocity.x -= dvx
            this.velocity.y -= dvy
            balls[i].velocity.x += dvx
            balls[i].velocity.y += dvy

            // Apply attrition
            this.velocity.x += this.velocity.x * ATTRITION
            this.velocity.y += this.velocity.y * ATTRITION
            balls[i].velocity.x += balls[i].velocity.x * ATTRITION
            balls[i].velocity.y += balls[i].velocity.y * ATTRITION
          }
        }
      }
    }

    this.update = function () {
      this.radius = ballSize.value()
      this.applyGravity()

      this.velocity.x += this.acceleration.x
      this.velocity.y += this.acceleration.y

      this.applyVibration()
      this.bounceOnEdges()
      this.bounceOnIntersect()
      this.applyMaxSpeed()

      this.x = this.x + this.velocity.x
      this.y = this.y + this.velocity.y
    }
  }

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.background(15, 0, 30, 255)
    p5.noStroke()

    p5.createElement('span', 'Size').parent('controls')
    ballSize = p5.createSlider(1, 50, DEFAULT_BALL_SIZE, 0.5).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Density').parent('controls')
    ballCount = p5.createSlider(0, 2000, DEFAULT_BALL_COUNT, 1).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Wiggle').parent('controls')
    vibration = p5.createSlider(0.01, 1, DEFAULT_WIGGLE, 0.01).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Hue').parent('controls')
    hue = p5.createSlider(0, 360, DEFAULT_HUE, 1).parent('controls')
    p5.createElement('br').parent('controls')

    gravityCheckbox = p5.createCheckbox('Gravity').parent('controls')

    for (let i = 0; i < DEFAULT_BALL_COUNT; i++) {
      balls.push(createBall())
    }

    ballCount.elt.addEventListener('input', (event) => {
      const newBallCount = event.target.value
      let diff = balls.length - newBallCount
      const addBall = diff < 0 ? true : false
      const clampedDiff = diff > 0 ? diff : -diff
      for (let i = 0; i < clampedDiff; i++) {
        if (addBall) {
          balls.push(createBall())
        } else {
          balls.pop()
        }
      }
    })

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.colorMode(p5.RGB)
    p5.background(0, 0, 30, 50)
    for (let i = 0; i < balls.length; i++) {
      p5.colorMode(p5.HSB)
      p5.fill(hue.value(), 100, 100)
      balls[i].update()
      balls[i].draw()
    }
  }

  p5.isMouseInBounds = () => {
    return (
      p5.mouseX >= 0 &&
      p5.mouseX <= p5.width &&
      p5.mouseY >= 0 &&
      p5.mouseY <= p5.height
    )
  }
}
