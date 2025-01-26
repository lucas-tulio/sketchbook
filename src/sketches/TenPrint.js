import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function TenPrint(p5, onLoad) {
  const margin = 80
  let x = margin
  let y = margin
  const size = 40

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.colorMode(p5.HSB)
    p5.frameRate(60)
    p5.strokeWeight(4)
    p5.background(0)
    p5.noFill()

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.stroke(((x + y) * 0.5) % 360, 60, 100)
    p5.strokeWeight(size / 4)
    if (p5.random() >= 0.5) {
      p5.line(x, y, x + size, y + size)
    } else {
      p5.line(x, y + size, x + size, y)
    }

    if (p5.random() >= 0.5) {
      p5.strokeWeight(size / 2)
      p5.point(x, y)
    }

    x += size
    if (x + margin >= p5.width) {
      x = margin
      y += size
    }
    if (y + margin >= p5.height) {
      p5.noLoop()
    }
  }
}
