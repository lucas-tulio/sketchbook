import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function TenPrint(sketch, onLoad) {
  const margin = 80
  let x = margin
  let y = margin
  const size = 40

  sketch.setup = () => {
    sketch.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    sketch.colorMode(sketch.HSB)
    sketch.frameRate(60)
    sketch.strokeWeight(4)
    sketch.background(0)
    sketch.noFill()

    if (onLoad) {
      onLoad()
    }
  }

  sketch.draw = () => {
    sketch.stroke(((x + y) * 0.5) % 360, 60, 100)
    sketch.strokeWeight(size / 4)
    if (sketch.random() >= 0.5) {
      sketch.line(x, y, x + size, y + size)
    } else {
      sketch.line(x, y + size, x + size, y)
    }

    if (sketch.random() >= 0.5) {
      sketch.strokeWeight(size / 2)
      sketch.point(x, y)
    }

    x += size
    if (x + margin >= sketch.width) {
      x = margin
      y += size
    }
    if (y + margin >= sketch.height) {
      sketch.noLoop()
    }
  }
}
