type Dimensions = {
  width: number;
  height: number;
};

type Coordinates = {
  x: number;
  y: number;
};

type Grid = boolean[][];

class GameOfLife {
  private grid: Grid;

  constructor(dimensions: Dimensions, initialState: Coordinates[]) {
    this.grid = this.createGrid(dimensions);
    this.setState(initialState);
  }

  run(delay = 200): void {
    this.print();

    const intervalId = setInterval(() => {
      const previousState = JSON.stringify(this.grid);
      this.tick();
      this.print();

      if (previousState === JSON.stringify(this.grid)) {
        clearInterval(intervalId);
      }
    }, delay);
  }

  private createGrid({ width, height }: Dimensions): Grid {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => false));
  }

  private setState(state: Coordinates[]): void {
    state.forEach(({ x, y }) => {
      this.checkCoordinatesInGrid({ x, y });
      this.grid[y][x] = true;
    });
  }

  private checkCoordinatesInGrid({ x, y }: Coordinates): void {
    if (this.grid[y]?.[x] === undefined) {
      throw new Error(`Invalid cell coordinates: ${JSON.stringify({ x, y })}`);
    }
  }

  private print(): void {
    console.clear();

    console.log(
      '\n' +
        this.grid
          .map((row) => row.join('').replaceAll('true', '🟥').replaceAll('false', '⬜'))
          .join('\n'),
    );
  }

  private tick(): void {
    const nextGrid = this.grid.map((row, y) =>
      row.map((cell, x) => {
        const livingNeighbors = this.getLivingNeighborsCount({ x, y });

        if (livingNeighbors === 2) {
          return cell;
        } else if (livingNeighbors === 3) {
          return true;
        } else {
          return false;
        }
      }),
    );

    this.grid = nextGrid;
  }

  private getLivingNeighborsCount({ x, y }: Coordinates): number {
    this.checkCoordinatesInGrid({ x, y });

    return [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ].reduce((count, [xOff, yOff]) => count + Number(this.grid[y + yOff]?.[x + xOff] ?? false), 0);
  }
}

const glider = [
  { x: 1, y: 0 },
  { x: 2, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 },
];

const game = new GameOfLife({ width: 10, height: 10 }, glider);

game.run();
