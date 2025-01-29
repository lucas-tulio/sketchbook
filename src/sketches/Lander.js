import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'
import { lineIntersect } from '@/sketches/util'

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault()
  }
})

export function Lander(p5, onLoad) {
  let stars = null
  let ground = null
  let ship = null
  const groundHeight = 80
  const gravity = p5.createVector(0, 0.01)
  const thrust = p5.createVector(0, -0.05)

  const GROUND_ANGLE_LIMIT = 30
  const LANDING_ANGLE_LIMIT = 20
  const LANDING_VELOCITY_LIMIT = 1.5

  const FUEL_BAR_WIDTH = 180
  const FUEL_BAR_HEIGHT = 20

  class Ship {
    constructor(x, y) {
      this.ps = new ParticleSystem()
      this.w = 8
      this.h = 24
      this.pos = p5.createVector(x, y)
      this.vel = p5.createVector()
      this.heading = 0

      this.landed = false
      this.crashed = false
      this.lost = false
      this.landingVelocity = null
      this.landingAngle = null
      this.groundAngle = null

      this.MAX_FUEL = 3
      this.fuel = this.MAX_FUEL
      this.fuelCost = 0.01
    }

    update() {
      if (this.landed || this.crashed || this.lost) {
        return
      }
      const acc = p5.createVector()
      if (p5.keyIsDown(p5.UP_ARROW) && this.fuel > 0) {
        // Add particles
        this.ps.addParticle(this.pos, this.heading)
        // Thrust in the direction of the heading
        acc.add(thrust)
        acc.rotate(this.heading)
        this.fuel -= this.fuelCost
      }
      if (p5.keyIsDown(p5.LEFT_ARROW)) {
        this.heading -= 0.05
      } else if (p5.keyIsDown(p5.RIGHT_ARROW)) {
        this.heading += 0.05
      }
      acc.add(gravity)
      this.vel.add(acc)
      this.pos.add(this.vel)

      // Check if we're lost in space
      if (this.pos.x < -50 || this.pos.x > DEFAULT_WIDTH + 50 || this.pos.y > DEFAULT_HEIGHT + 50 || this.pos.y < -50) {
        this.lost = true
      }

      // Check if we hit the ground
      // Calculate the position of the lines that form the ship body
      const leftLineP1 = p5
        .createVector(-this.w, -this.h / 2)
        .rotate(this.heading)
        .add(this.pos)
      const leftLineP2 = p5.createVector(0, -this.h).rotate(this.heading).add(this.pos)
      const rightLineP1 = p5
        .createVector(this.w, -this.h / 2)
        .rotate(this.heading)
        .add(this.pos)
      const rightLineP2 = p5.createVector(0, -this.h).rotate(this.heading).add(this.pos)
      const bottomLineP1 = p5
        .createVector(-this.w - 3, 4)
        .rotate(this.heading)
        .add(this.pos)
      const bottomLineP2 = p5
        .createVector(this.w + 3, 4)
        .rotate(this.heading)
        .add(this.pos)
      for (let i = 0; i < ground.length - 1; i++) {
        const a = p5.createVector(ground[i].x, ground[i].y)
        const b = p5.createVector(ground[i + 1].x, ground[i + 1].y)

        // If either side of the ship intersects with the ground, we crashed
        const leftIntersect = lineIntersect(
          a.x,
          a.y,
          b.x,
          b.y,
          leftLineP1.x,
          leftLineP1.y,
          leftLineP2.x,
          leftLineP2.y,
        )
        const rightIntersect = lineIntersect(
          a.x,
          a.y,
          b.x,
          b.y,
          rightLineP1.x,
          rightLineP1.y,
          rightLineP2.x,
          rightLineP2.y,
        )
        if (leftIntersect || rightIntersect) {
          this.crashed = true
          break
        }
        // If the bottom of the ship intersects with the ground, we (probably) landed
        const bottomIntersect = lineIntersect(
          a.x,
          a.y,
          b.x,
          b.y,
          bottomLineP1.x,
          bottomLineP1.y,
          bottomLineP2.x,
          bottomLineP2.y,
        )
        if (bottomIntersect) {
          // Calculate the angle of the landing
          this.groundAngle = p5.abs(
            ((p5.degrees(p5.atan2(b.y - a.y, b.x - a.x)) + 180) % 360) - 180,
          ) // abs of atan2 of the ground line
          this.landingAngle = p5.abs(((p5.degrees(this.heading) + 180) % 360) - 180) // abs of mod of heading, basically
          this.landingVelocity = p5.abs(this.vel.y)

          if (
            this.groundAngle <= GROUND_ANGLE_LIMIT &&
            this.landingVelocity <= LANDING_VELOCITY_LIMIT &&
            this.landingAngle <= LANDING_ANGLE_LIMIT
          ) {
            this.landed = true
          } else if (this.landingVelocity > LANDING_VELOCITY_LIMIT) {
            this.crashed = true
          } else if (this.landingAngle > LANDING_ANGLE_LIMIT) {
            this.crashed = true
          } else if (this.groundAngle > GROUND_ANGLE_LIMIT) {
            this.crashed = true
          }
          break
        }
      }
    }

    show() {
      // Rotate according to heading

      p5.push()
      p5.translate(this.pos.x, this.pos.y)
      p5.rotate(this.heading)

      // Ship body
      p5.noStroke()
      p5.fill(0, 0, 100)
      p5.triangle(0 - this.w, 0, 0, 0 - this.h, 0 + this.w, 0)

      // Two little "feet"
      p5.stroke(0, 0, 100)
      p5.strokeWeight(1)
      p5.line(0 - this.w + 1, 0, 0 - this.w, 0 + 3)
      p5.line(0 + this.w - 1, 0, 0 + this.w, 0 + 3)
      p5.line(0 - this.w, 0 + 3, 0 - this.w - 4, 0 + 3)
      p5.line(0 + this.w, 0 + 3, 0 + this.w + 4, 0 + 3)

      // Window
      p5.noStroke()
      p5.fill(180, 0, 0)
      p5.circle(0, -12, 5)

      // Pop matrix
      p5.pop()

      p5.fill(0, 0, 100)
      p5.noStroke()
      p5.textAlign(p5.LEFT)
      p5.textSize(24)

      // Fuel bar
      p5.text('Fuel', 40, 40)
      p5.stroke(0, 0, 100)
      p5.strokeWeight(2)
      p5.noFill()
      p5.rect(40, 60, FUEL_BAR_WIDTH, FUEL_BAR_HEIGHT)
      p5.fill(0, 0, 100)
      p5.rect(40, 60, (this.fuel * FUEL_BAR_WIDTH) / ship.MAX_FUEL, FUEL_BAR_HEIGHT)
    }
  }

  class ParticleSystem {
    constructor() {
      this.particles = []
      this.hue = 0
    }

    addParticle(location, angle) {
      this.hue += 3
      this.particles.push(new Particle(location, angle, this.hue))
    }

    update() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i]
        p.update()
        if (p.isDead()) {
          this.particles.splice(i, 1)
        }
      }
    }

    show() {
      for (let p of this.particles) {
        p.show()
      }
    }
  }

  class Particle {
    constructor(pos, angle, hue) {
      this.acc = p5.createVector(0, 0)
      this.vel = p5.createVector(p5.random(-0.5, 0.5), p5.random(-0.5, 0.5)).add(0, 2).rotate(angle)
      this.pos = pos.copy().add(0, 4)
      this.lifespan = 128
      this.size = 4
      this.hue = hue
    }

    update() {
      this.vel.add(this.acc)
      this.pos.add(this.vel)
      this.lifespan -= 1
    }

    show() {
      p5.noStroke()
      const a = p5.map(this.lifespan, 0, 128, 0.5, 1)
      p5.fill(this.hue % 360, 100, 100, a)
      p5.ellipse(this.pos.x, this.pos.y, this.size, this.size)
    }

    isDead() {
      return this.lifespan <= 0
    }
  }

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

  function createGround() {
    const ground = []
    const segments = 30
    const peakChance = 0.2
    const segmentWidth = DEFAULT_WIDTH / segments
    for (let i = 0; i < segments + 1; i++) {
      let height = DEFAULT_HEIGHT - groundHeight
      if (Math.random() < peakChance) {
        height -= Math.random() * 140
      } else {
        height -= Math.random() * 20
      }
      ground.push({
        x: i * segmentWidth,
        y: height,
      })
    }
    return ground
  }

  function reset() {
    ship = new Ship(DEFAULT_WIDTH / 2, 20)
    stars = createStars(100)
    ground = createGround()

    // Give the ship a random little initial push and randomzie the initial heading
    ship.vel.x = (Math.random() - 0.5) * 3
    ship.vel.y = Math.random()
    ship.heading = Math.random() * Math.PI * 2
  }

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.colorMode(p5.HSB)
    p5.textAlign(p5.CENTER, p5.CENTER)
    p5.textFont('fixedsys')
    p5.createElement('span', 'Up to accelerate<br/>').parent('controls')
    p5.createElement('span', 'Left and Right to rotate<br/>').parent('controls')
    p5.createElement('span', 'R to reset').parent('controls')

    reset()

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.background(240, 100, 15)
    // Stars
    for (let i = 0; i < stars.length; i++) {
      p5.stroke(0, 0, 100)
      p5.point(stars[i].x, stars[i].y)
    }
    // Ground
    p5.stroke(0, 0, 90)
    p5.fill(0, 0, 10)
    p5.strokeWeight(2)
    p5.beginShape()
    p5.vertex(0, DEFAULT_HEIGHT)
    for (let i = 0; i < ground.length; i++) {
      p5.vertex(ground[i].x, ground[i].y)
    }
    p5.vertex(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.endShape(p5.CLOSE)

    // Ship
    ship.update()
    ship.show()
    ship.ps.update()
    ship.ps.show()

    // UI
    p5.textAlign(p5.CENTER)
    if (ship.crashed) {
      p5.noStroke()
      p5.fill(0, 100, 100)
      p5.text('CRASHED!', DEFAULT_WIDTH / 2, 180)
    } else if (ship.landed) {
      p5.noStroke()
      p5.fill(120, 100, 100)
      p5.text('LANDED!', DEFAULT_WIDTH / 2, 180)
    } else if (ship.lost) {
      p5.noStroke()
      p5.fill(0, 100, 100)
      p5.text('LOST IN SPACE!', DEFAULT_WIDTH / 2, 180)
    }

    // Landing results
    let reason = ``
    if (ship.landingVelocity > LANDING_VELOCITY_LIMIT) {
      reason += 'Too fast!\n'
    }
    if (ship.landingAngle > LANDING_ANGLE_LIMIT) {
      reason += 'Ship too steep!\n'
    }
    if (ship.groundAngle > GROUND_ANGLE_LIMIT) {
      reason += 'Ground too steep!\n'
    }
    p5.text(reason, DEFAULT_WIDTH / 2, 280)
  }

  p5.keyPressed = () => {
    if (p5.key === 'r') {
      reset()
    }
    if (ship.landed || ship.crashed || ship.lost) {
      reset()
    }
  }
}
