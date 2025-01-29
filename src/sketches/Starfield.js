import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function Starfield(p5, onLoad) {
  const DEFAULT_NUM_NODES = 1200
  const DEFAULT_SPEED = 2.5
  const DEFAULT_TRAIL = 0.85

  let trail
  let numNodes
  let speedModifier
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
      this.speed.x = (this.x / p5.width - 0.5) * ratio * speedModifier.value() * this.acceleration
      this.speed.y = (this.y / p5.height - 0.5) * speedModifier.value() * this.acceleration
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

    p5.createElement('span', 'Nodes').parent('controls')
    numNodes = p5.createSlider(100, 5000, DEFAULT_NUM_NODES, 100).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Speed').parent('controls')
    speedModifier = p5.createSlider(1, 5, DEFAULT_SPEED, 0.1).parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Trail').parent('controls')
    trail = p5.createSlider(0.01, 0.95, DEFAULT_TRAIL, 0.01).parent('controls')
    p5.createElement('br').parent('controls')

    for (let i = 0; i < numNodes.value(); i++) {
      nodes.push(new Node())
    }

    numNodes.elt.addEventListener('input', (event) => {
      const newNodeCount = event.target.value
      let diff = nodes.length - newNodeCount
      const addNode = diff < 0 ? true : false
      const clampedDiff = diff > 0 ? diff : -diff
      for (let i = 0; i < clampedDiff; i++) {
        if (addNode) {
          nodes.push(new Node())
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
    p5.background(0, 0, 0, 1 - trail.value())
    for (let node of nodes) {
      node.update()
      node.show()
    }
  }
}
