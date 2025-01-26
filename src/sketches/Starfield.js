import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function Starfield(p5, onLoad) {
  let numNodes = 3000
  let nodes = []

  class Node {
    constructor() {
      this.radius = 5
      this.speed = p5.createVector()
      this.acceleration = p5.random(1, 5)
      this.c = p5.random(180, 320)
      this.s = p5.random(80, 100)
      this.b = p5.random(80, 100)
      this.x = p5.width * 2
      this.y = p5.height * 2
    }

    update() {
      const ratio = p5.width / p5.height
      this.speed.x = (this.x / p5.width - 0.5) * ratio * 5 * this.acceleration
      this.speed.y = (this.y / p5.height - 0.5) * 5 * this.acceleration
      this.x += this.speed.x
      this.y += this.speed.y
      if (this.x >= p5.width || this.x <= 0 || this.y >= p5.height || this.y <= 0) {
        this.radius = 0.001
        this.resetPosition()
      }
      this.radius += 0.005
    }

    show() {
      p5.fill(this.c, this.s, this.b)
      p5.circle(this.x, this.y, 3)
    }

    resetPosition() {
      const angle = p5.random(360)
      const radius = p5.random(-p5.width, p5.width)
      const x = p5.cos(angle) * radius
      const y = p5.sin(angle) * radius
      this.x = p5.width / 2 + x
      this.y = p5.height / 2 + y
    }
  }

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.background(0)
    p5.colorMode(p5.HSB)
    p5.noStroke()
    for (let i = 0; i < numNodes; i++) {
      nodes.push(new Node())
    }

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.background(0, 0, 0, 0.05)
    for (let node of nodes) {
      node.update()
      node.show()
    }
  }
}
