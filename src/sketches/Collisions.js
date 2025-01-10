export function Collisions(sketch, onLoad) {
  const numBalls = 300
  const defaultBallSize = 10
  const defaultWiggle = 0.1
  const balls = []

  const maxSpeed = 5
  const attrition = -0.1

  let gravityCheckbox
  let gravity = 0.0001
  let ballSize
  let ballCount
  let vibration

  function createBall(x, y) {
    if (x && y) {
      return new Ball(x, y)
    }
    return new Ball(sketch.random(sketch.width), sketch.random(sketch.height))
  }

  function Ball(x, y) {
    this.x = x
    this.y = y
    this.acceleration = sketch.createVector(0, 0)
    this.velocity = sketch.createVector(sketch.random(-1, 1), sketch.random(-1, 1))
    this.velocity.setMag(1)
    this.radius = ballSize.value()

    this.draw = function () {
      sketch.circle(this.x, this.y, this.radius)
    }

    this.applyGravity = function () {
      if (gravityCheckbox.checked()) {
        this.acceleration.y += gravity
      } else {
        this.acceleration.y = 0
      }
    }

    this.applyVibration = function () {
      this.velocity.x = this.velocity.x + sketch.random(-vibration.value(), vibration.value())
      this.velocity.y = this.velocity.y + sketch.random(-vibration.value(), vibration.value())
    }

    this.applyMaxSpeed = function () {
      if (this.velocity.x >= maxSpeed) {
        this.velocity.x = maxSpeed
      } else if (this.velocity.x <= -maxSpeed) {
        this.velocity.x = -maxSpeed
      }
      if (this.velocity.y >= maxSpeed) {
        this.velocity.y = maxSpeed
      } else if (this.velocity.y <= -maxSpeed) {
        this.velocity.y = -maxSpeed
      }
    }

    this.bounceOnEdges = function () {
      if (this.x - this.radius / 2 < 0 || this.x + this.radius / 2 > sketch.width) {
        this.velocity.x = -this.velocity.x
        this.velocity.x += this.velocity.x * attrition
      }
      if (this.y - this.radius / 2 < 0 || this.y + this.radius / 2 > sketch.height) {
        this.velocity.y = -this.velocity.y
        this.velocity.y += this.velocity.y * attrition
      }
      // Avoid going thru walls
      if (this.x < this.radius / 2) {
        this.x = this.radius / 2
      } else if (this.x > sketch.width - this.radius / 2) {
        this.x = sketch.width - this.radius / 2
      }
      if (this.y < this.radius / 2) {
        this.y = this.radius / 2
      } else if (this.y > sketch.height - this.radius / 2) {
        this.y = sketch.height - this.radius / 2
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
            this.velocity.x += this.velocity.x * attrition
            this.velocity.y += this.velocity.y * attrition
            balls[i].velocity.x += balls[i].velocity.x * attrition
            balls[i].velocity.y += balls[i].velocity.y * attrition
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

  sketch.setup = () => {
    sketch.createCanvas(800, 800)
    sketch.background(15, 0, 30, 255)

    sketch.createElement('span', 'Size').parent('controls')
    ballSize = sketch.createSlider(1, 50, defaultBallSize, 0.5).parent('controls')
    sketch.createElement('br').parent('controls')
    sketch.createElement('span', 'Density').parent('controls')
    ballCount = sketch.createSlider(0, 2000, numBalls, 1).parent('controls')
    sketch.createElement('br').parent('controls')
    sketch.createElement('span', 'Wiggle').parent('controls')
    vibration = sketch.createSlider(0.01, 1, defaultWiggle, 0.01).parent('controls')
    gravityCheckbox = sketch.createCheckbox('Gravity').parent('controls')

    for (let i = 0; i < numBalls; i++) {
      balls.push(createBall())
    }
    sketch.noStroke()
    sketch.fill(240, 200, 180)
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

  sketch.draw = () => {
    sketch.colorMode(sketch.RGB)
    sketch.background(0, 0, 30, 50)
    for (let i = 0; i < balls.length; i++) {
      sketch.colorMode(sketch.HSB)
      sketch.fill(220, 255, 255)
      balls[i].update()
      balls[i].draw()
    }
  }

  sketch.isMouseInBounds = () => {
    return (
      sketch.mouseX >= 0 &&
      sketch.mouseX <= sketch.width &&
      sketch.mouseY >= 0 &&
      sketch.mouseY <= sketch.height
    )
  }
}
