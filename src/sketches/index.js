import { Collisions } from '@/sketches/Collisions'
import { TenPrint } from '@/sketches/TenPrint'
import { Starfield } from '@/sketches/Starfield'
import { MazeGenerator } from '@/sketches/MazeGenerator'
import { RandomWalk } from '@/sketches/RandomWalk'
import { Flock } from '@/sketches/Flock'
import { Lander } from '@/sketches/Lander'

export default [
  { name: 'Lander', sketch: Lander },
  { name: 'Collisions', sketch: Collisions },
  { name: '10 Print', sketch: TenPrint },
  { name: 'Starfield', sketch: Starfield },
  { name: 'Maze Generator', sketch: MazeGenerator },
  { name: 'Random Walk', sketch: RandomWalk },
]
