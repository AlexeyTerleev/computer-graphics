import Point, { Color } from "../interfaces/Point";

export const circleAlg = (points: Point[], color: Color): Point[] =>  {
    if (points.length != 2) 
        return [];

    const center = points[0];
    const border = points[1];

    const deltaX = Math.abs(center.x - border.x);
    const deltaY = Math.abs(center.y - border.y);

    const radius = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    let currentX = 0;
    let currentY = radius;
    let error = 2 - 2 * radius;

    const diagonalMove = () => {
        currentX += 1;
        currentY -= 1;
        error = error + 2 * currentX - 2 * currentY + 2;
    }

    const horizontalMove = () => {
        currentX += 1;
        error = error + 2 * currentX + 1;
    }

    const verticalMove = () => {
        currentY -= 1;
        error = error - currentY + 1;
    }

    const newPoints = [];
    while (currentY >= 0) {
      newPoints.push({x: currentX + center.x, y: currentY + center.y, opacity: 1, color: color});
      if (error > 0) {
        const sigma = 2 * error - 2 * currentX - 1;
        sigma <= 0 ? diagonalMove() : verticalMove();
      }
      else if (error < 0) {
        const sigma = 2 * error + 2 * currentY - 1;
        sigma > 0 ? diagonalMove() : horizontalMove();
      }
      else {
        diagonalMove();
      }
    }
    return newPoints;
};
