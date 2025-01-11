import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function Starfield(sketch, onLoad) {
  let numNodes = 3000
  let nodes = []

  class Node {
    constructor() {
      this.radius = 5
      this.speed = sketch.createVector()
      this.acceleration = sketch.random(1, 5)
      this.c = sketch.random(180, 320)
      this.s = sketch.random(80, 100)
      this.b = sketch.random(80, 100)
      this.x = sketch.width * 2
      this.y = sketch.height * 2
    }

    update() {
      const ratio = sketch.width / sketch.height
      this.speed.x = (this.x / sketch.width - 0.5) * ratio * 5 * this.acceleration
      this.speed.y = (this.y / sketch.height - 0.5) * 5 * this.acceleration
      this.x += this.speed.x
      this.y += this.speed.y
      if (this.x >= sketch.width || this.x <= 0 || this.y >= sketch.height || this.y <= 0) {
        this.radius = 0.001
        this.resetPosition()
      }
      this.radius += 0.005
    }

    show() {
      sketch.fill(this.c, this.s, this.b)
      sketch.circle(this.x, this.y, 3)
    }

    resetPosition() {
      const angle = sketch.random(360)
      const radius = sketch.random(-sketch.width, sketch.width)
      const x = sketch.cos(angle) * radius
      const y = sketch.sin(angle) * radius
      this.x = sketch.width / 2 + x
      this.y = sketch.height / 2 + y
    }
  }

  sketch.setup = () => {
    sketch.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    sketch.background(0)
    sketch.colorMode(sketch.HSB)
    sketch.noStroke()
    for (let i = 0; i < numNodes; i++) {
      nodes.push(new Node())
    }

    if (onLoad) {
      onLoad()
    }
  }

  sketch.draw = () => {
    sketch.background(0, 0, 0, 0.05)
    for (let node of nodes) {
      node.update()
      node.show()
    }
  }
}
