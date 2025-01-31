import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function FlowFields(p5, onLoad) {
  const DEFAULT_DENSITY = 3000
  const DEFAULT_NOISE_SCALE = 0.01
  const DEFAULT_MAX_LIFETIME = 100
  const DEFAULT_TRAIL = 0.95

  let nodes = []
  let noiseScale
  let density
  let chosenMaxLifetime
  let trail

  class Node {
    constructor(x, y) {
      this.pos = p5.createVector(x, y)
      this.vel = p5.createVector()
      this.acc = p5.createVector()
      this.angle = 0
      this.lifetime = 0
      this.setMaxLifetime(DEFAULT_MAX_LIFETIME)
    }

    wrap() {
      if (
        this.pos.x < 0 ||
        this.pos.x > DEFAULT_WIDTH ||
        this.pos.y < 0 ||
        this.pos.y > DEFAULT_HEIGHT
      ) {
        this.respawn()
      }
    }

    respawn() {
      this.pos = p5.createVector(p5.random(DEFAULT_WIDTH), p5.random(DEFAULT_HEIGHT))
    }

    live() {
      this.lifetime++
      if (this.lifetime >= this.maxLifetime) {
        this.lifetime = 0
        this.respawn()
      }
    }

    setMaxLifetime(maxLifetime) {
      this.maxLifetime = p5.random(maxLifetime / 2, maxLifetime)
    }

    update() {
      const c = p5.noise(this.pos.x * noiseScale.value(), this.pos.y * noiseScale.value())
      // change angle according to mouse pos (atan2)
      let mouseDirection = 0
      if (
        p5.mouseX <= DEFAULT_WIDTH &&
        p5.mouseY <= DEFAULT_HEIGHT &&
        p5.mouseX >= 0 &&
        p5.mouseY >= 0
      ) {
        mouseDirection = p5.atan2(p5.mouseY - this.pos.y, p5.mouseX - this.pos.x)
      }
      this.angle = p5.map(c, 0, 1, 0, p5.TWO_PI)
      this.acc = p5.createVector(
        p5.cos(this.angle + mouseDirection),
        p5.sin(this.angle + mouseDirection),
      )

      this.vel.add(this.acc)
      this.vel.limit(1)
      this.pos.add(this.vel)
      this.wrap()
      this.live()
    }

    show() {
      const a = p5.map(this.lifetime, 0, this.maxLifetime / 10, 0, 1)
      p5.stroke(120, 80, 100, a)
      p5.point(this.pos.x, this.pos.y)
    }
  }

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.pixelDensity(1)
    p5.colorMode(p5.HSB)
    p5.background(220, 100, 40, 1)
    p5.noFill()
    p5.strokeWeight(1.5)

    p5.createElement('span', 'Mouse over to influence').parent('controls')
    p5.createElement('br').parent('controls')
    p5.createElement('span', 'Press R to randomize pattern').parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Density').parent('controls')
    density = p5.createSlider(1000, 8000, DEFAULT_DENSITY, 100).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Turbulence').parent('controls')
    noiseScale = p5.createSlider(0.0001, 0.025, DEFAULT_NOISE_SCALE, 0.0001).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Lifetime').parent('controls')
    chosenMaxLifetime = p5.createSlider(20, 200, DEFAULT_MAX_LIFETIME, 1).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Trail').parent('controls')
    trail = p5.createSlider(0.9, 0.99, DEFAULT_TRAIL, 0.01).parent('controls')
    p5.createElement('br').parent('controls')

    for (let i = 0; i < density.value(); i++) {
      nodes.push(new Node(p5.random(DEFAULT_WIDTH), p5.random(DEFAULT_HEIGHT)))
    }

    chosenMaxLifetime.elt.addEventListener('input', () => {
      for (let node of nodes) {
        node.setMaxLifetime(chosenMaxLifetime.value())
      }
    })

    density.elt.addEventListener('input', (event) => {
      const newDensity = event.target.value
      let diff = nodes.length - newDensity
      const addNode = diff < 0 ? true : false
      const clampedDiff = diff > 0 ? diff : -diff
      for (let i = 0; i < clampedDiff; i++) {
        if (addNode) {
          nodes.push(new Node(p5.random(DEFAULT_WIDTH), p5.random(DEFAULT_HEIGHT)))
        } else {
          nodes.pop()
        }
      }
    })

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.background(220, 100, 40, 1 - trail.value())
    for (let node of nodes) {
      node.update()
      node.show()
    }
  }

  function reset() {
    p5.noiseSeed(p5.random(1000000))
  }

  p5.keyPressed = () => {
    if (p5.key === 'r') {
      reset()
    }
  }
}
