import Point, { Color } from "../interfaces/Point";
import { flipHorizontal, flipVertical } from "./Flip";

export const circleAlg = (points: Point[], color: Color): Point[] =>  {
    if (points.length != 2) 
        return [];

    const left_upper = points[0];
    const right_lower = points[1];

    const deltaX = Math.abs(left_upper.x - right_lower.x);
    const deltaY = Math.abs(left_upper.y - right_lower.y);

    const radius = Math.floor(Math.min(deltaX, deltaY) / 2);

    const center: Point = {x: left_upper.x + radius, y: left_upper.y + radius, opacity: 1, color: color} 

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
        error = error - 2 * currentY + 1;
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
    const half = newPoints.concat(flipHorizontal(newPoints, center.y));
    const circle = half.concat(flipVertical(half, center.x));
    
    let result = circle;
    if (left_upper.x > right_lower.x) {
        result = flipVertical(result, left_upper.x);
    }
    if (left_upper.y > right_lower.y) {
        result = flipHorizontal(result, left_upper.y);
    }
    return result;
};


