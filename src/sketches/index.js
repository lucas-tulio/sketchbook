import { Collisions } from '@/sketches/Collisions'
import { TenPrint } from '@/sketches/TenPrint'
import { Starfield } from '@/sketches/Starfield'
import { MazeGenerator } from '@/sketches/MazeGenerator'
import { RandomWalk } from '@/sketches/RandomWalk'
import { Flock } from '@/sketches/Flock'
import { Lander } from '@/sketches/Lander'
import { Terrain } from '@/sketches/Terrain'

export default [
  { name: 'Terrain', sketch: Terrain },
  { name: 'Lander', sketch: Lander },
  { name: 'Collisions', sketch: Collisions },
  { name: '10 Print', slug: 'TenPrint', sketch: TenPrint },
  { name: 'Starfield', sketch: Starfield },
  { name: 'Maze Generator', slug: 'MazeGenerator', sketch: MazeGenerator },
  { name: 'Random Walk', slug: 'RandomWalk', sketch: RandomWalk },
]
