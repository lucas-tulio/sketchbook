import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function Flock(p5, onLoad) {
  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.background(0, 0, 0)
    p5.fill(255, 255, 255)
    p5.rect(10, 10, 10, 10)
  }
}
