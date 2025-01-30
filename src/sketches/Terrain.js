import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function Terrain(p5, onLoad) {
  const spans = {
    water: 3,
    sand: 1,
    grass: 5,
    mountain: 3,
    snow: 12,
  }
  const colors = [
    // Water (buncha colors so we can simulate depth)
    { span: spans.water, color: [5, 20, 60] },
    { span: spans.water, color: [10, 30, 80] },
    { span: spans.water, color: [15, 40, 100] },
    { span: spans.water, color: [20, 50, 120] },
    { span: spans.water, color: [25, 60, 140] },
    { span: spans.water, color: [30, 70, 160] },
    { span: spans.water, color: [35, 80, 180] },
    { span: spans.water, color: [40, 90, 200] },
    { span: spans.water, color: [45, 100, 220] },
    { span: spans.water, color: [50, 110, 240] },

    // Sand
    { span: spans.sand, color: [230, 210, 160] },
    { span: spans.sand, color: [240, 220, 170] },

    // Grass
    { span: spans.grass, color: [80, 140, 80] },

    // Mountains
    { span: spans.mountain, color: [120, 80, 60] },
    { span: spans.mountain, color: [110, 80, 60] },
    { span: spans.mountain, color: [100, 80, 50] },
    { span: spans.mountain, color: [90, 80, 80] },

    // Snow
    { span: spans.snow, color: [255, 255, 255] },
  ]

  let noiseLevel = colors.reduce((acc, { span }) => acc + span, 0)
  const DEFAULT_NOISE_SCALE = 0.01 // idk seems right
  let noiseScale

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.pixelDensity(1)

    p5.createElement('span', 'Press R to regen').parent('controls')
    p5.createElement('br').parent('controls')

    p5.createElement('span', 'Scale').parent('controls')
    noiseScale = p5.createSlider(0.001, 0.02, DEFAULT_NOISE_SCALE, 0.001).parent('controls')
    p5.createElement('br').parent('controls')

    noiseScale.elt.addEventListener('input', () => {
      p5.draw()
    })

    if (onLoad) {
      onLoad()
    }
  }

  p5.draw = () => {
    p5.loadPixels()
    for (let y = 0; y < DEFAULT_HEIGHT; y++) {
      for (let x = 0; x < DEFAULT_WIDTH; x++) {
        let nx = noiseScale.value() * x
        let ny = noiseScale.value() * y

        let c = Math.floor(p5.noise(nx, ny) * noiseLevel)

        // Here we get the color based on how far into the span we're in
        // That way we can proportinally distribute the colors
        let accumulatedSpan = 0
        let selectedColor
        for (let i = 0; i < colors.length; i++) {
          accumulatedSpan += colors[i].span
          if (c < accumulatedSpan) {
            selectedColor = colors[i].color
            break
          }
        }

        const pixelIndex = (x + y * DEFAULT_WIDTH) * 4
        p5.pixels[pixelIndex + 0] = selectedColor[0]
        p5.pixels[pixelIndex + 1] = selectedColor[1]
        p5.pixels[pixelIndex + 2] = selectedColor[2]
        p5.pixels[pixelIndex + 3] = 255
      }
    }
    p5.updatePixels()
    p5.noLoop()
  }

  function reset() {
    p5.noiseSeed(p5.random(1000000))
    p5.draw()
  }

  p5.keyPressed = () => {
    if (p5.key === 'r') {
      reset()
    }
  }
}
