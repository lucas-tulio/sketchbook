import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from '@/sketches/constants'

export function MazeGenerator(p5, onLoad) {
  let rows, cols
  let cellSize
  let maze = []

  let index = 0
  const open = 0
  const wall = 1
  let tone = 70
  let c = Math.random() * 360

  let visited

  p5.setup = () => {
    p5.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT)
    p5.colorMode(p5.HSB)
    p5.frameRate(60)
    p5.noStroke()
    reset()

    if (onLoad) {
      onLoad()
    }
  }

  function reset() {
    p5.noStroke()
    p5.background(0, 0, 0)
    visited = [{ x: 1, y: 1 }]
    maze = []
    rows = p5.floor(p5.height / 20) - 1
    cols = p5.floor(p5.width / 20) - 1
    index = 0
    cellSize = p5.width / cols

    for (let y = 0; y < rows; y++) {
      maze.push([])
      for (let x = 0; x < cols; x++) {
        maze[y].push(wall)
      }
    }

    const noiseScale = 0.1

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (p5.floor(p5.random(2)) === 0) {
          p5.fill(
            0,
            0,
            p5.noise(x * noiseScale, y * noiseScale) * 20 + p5.random(0, 10),
          )
          p5.triangle(
            x * cellSize,
            y * cellSize,
            x * cellSize + cellSize,
            y * cellSize + cellSize,
            x * cellSize,
            y * cellSize + cellSize,
          )
          p5.fill(
            0,
            0,
            p5.noise(x * noiseScale, y * noiseScale) * 20 + p5.random(0, 10),
          )
          p5.triangle(
            x * cellSize,
            y * cellSize,
            x * cellSize + cellSize,
            y * cellSize,
            x * cellSize + cellSize,
            y * cellSize + cellSize,
          )
        } else {
          p5.fill(
            0,
            0,
            p5.noise(x * noiseScale, y * noiseScale) * 20 + p5.random(0, 10),
          )
          p5.triangle(
            x * cellSize,
            y * cellSize,
            x * cellSize + cellSize,
            y * cellSize,
            x * cellSize,
            y * cellSize + cellSize,
          )
          p5.fill(
            0,
            0,
            p5.noise(x * noiseScale, y * noiseScale) * 20 + p5.random(0, 10),
          )
          p5.triangle(
            x * cellSize,
            y * cellSize + cellSize,
            x * cellSize + cellSize,
            y * cellSize,
            x * cellSize + cellSize,
            y * cellSize + cellSize,
          )
        }
      }
    }
    // Open up at 1, 1
    maze[1][1] = open
  }

  function getPossible(x, y) {
    let possibleDir = []
    const top = { x, y: y - 1 }
    const bottom = { x, y: y + 1 }
    const left = { x: x - 1, y }
    const right = { x: x + 1, y }
    if (isPassable(top.x, top.y)) {
      possibleDir.push(top)
    }
    if (isPassable(bottom.x, bottom.y)) {
      possibleDir.push(bottom)
    }
    if (isPassable(left.x, left.y)) {
      possibleDir.push(left)
    }
    if (isPassable(right.x, right.y)) {
      possibleDir.push(right)
    }
    return p5.random(possibleDir)
  }

  function isVisited(x, y) {
    for (let i = 0; i < visited.length; i++) {
      if (visited[i].x === x && visited[i].y === y) {
        return true
      }
    }
    return false
  }

  function isPassable(x, y) {
    if (x === 0 || y === 0 || x === cols - 1 || y === rows - 1) {
      return false
    }
    if (x % 2 === 0 && y % 2 === 0) {
      return false
    }
    if (maze[y][x] === open) {
      return false
    }
    if (isVisited(x, y)) {
      return false
    }
    // Has open neighbs
    let openNeihbors = 0
    if (maze[y - 1][x] === open) {
      openNeihbors++
    }
    if (maze[y + 1][x] === open) {
      openNeihbors++
    }
    if (maze[y][x + 1] === open) {
      openNeihbors++
    }
    if (maze[y][x - 1] === open) {
      openNeihbors++
    }
    if (openNeihbors >= 2) {
      return false
    }
    return true
  }

  p5.draw = () => {
    for (let i = 0; i < 1; i++) {
      tone += p5.random([-2, 0, 2])
      if (tone > 80) {
        tone = 80
      } else if (tone < 60) {
        tone = 60
      }
      const pos = visited[index]
      const next = getPossible(pos.x, pos.y)

      c += p5.random([0, 1])
      if (maze[pos.y][pos.x] === open) {
        if (p5.floor(p5.random(2)) === 0) {
          p5.fill(c % 360, tone + p5.random(-20, 20), 100)
          p5.triangle(
            pos.x * cellSize,
            pos.y * cellSize,
            pos.x * cellSize + cellSize,
            pos.y * cellSize + cellSize,
            pos.x * cellSize,
            pos.y * cellSize + cellSize,
          )
          p5.fill(c % 360, tone + p5.random(-20, 20), 100)
          p5.triangle(
            pos.x * cellSize,
            pos.y * cellSize,
            pos.x * cellSize + cellSize,
            pos.y * cellSize,
            pos.x * cellSize + cellSize,
            pos.y * cellSize + cellSize,
          )
        } else {
          p5.fill(c % 360, tone + p5.random(-20, 20), 100)
          p5.triangle(
            pos.x * cellSize,
            pos.y * cellSize,
            pos.x * cellSize + cellSize,
            pos.y * cellSize,
            pos.x * cellSize,
            pos.y * cellSize + cellSize,
          )
          p5.fill(c % 360, tone + p5.random(-20, 20), 100)
          p5.triangle(
            pos.x * cellSize,
            pos.y * cellSize + cellSize,
            pos.x * cellSize + cellSize,
            pos.y * cellSize,
            pos.x * cellSize + cellSize,
            pos.y * cellSize + cellSize,
          )
        }
      }

      if (next) {
        visited.push({ x: next.x, y: next.y })
        maze[next.y][next.x] = open
        index++
      } else {
        // Position is not valid, go back
        visited.pop()
        index--
      }

      if (index === 0) {
        reset()
        break
      }
    }
  }
}
