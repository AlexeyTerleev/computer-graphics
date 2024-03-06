import Point, { Color } from "../interfaces/Point";
import { flipHorizontal, flipVertical } from "./Flip";

export const ellipseAlg = (points: Point[], color: Color): Point[] =>  {
    if (points.length != 2) 
        return [];

    const left_upper = points[0];
    const right_lower = points[1];

    const radiusX = Math.floor(Math.abs(left_upper.x - right_lower.x) / 2);
    const radiusY = Math.floor(Math.abs(left_upper.y - right_lower.y) / 2);

    const center: Point = {x: left_upper.x + radiusX, y: left_upper.y + radiusY, opacity: 1, color: color} 

    let currentX = 0;
    let currentY = radiusY;
    let error = 2 - (radiusX + radiusY);

    const diagonalMove = () => {
        currentX += 1;
        currentY -= 1;
        error = error + (2 * currentX  + 1) * Math.pow(radiusY, 2)  + (-2 * currentY + 1) * Math.pow(radiusX, 2);
    }

    const horizontalMove = () => {
        currentX += 1;
        error = error + (2 * currentX + 1) * Math.pow(radiusY, 2);
    }

    const verticalMove = () => {
        currentY -= 1;
        error = error + (-2 * currentY + 1) * Math.pow(radiusX, 2);
    }

    const newPoints: Point[] = [];

    while (currentY >= 0) {
        newPoints.push({x: currentX + center.x, y: currentY + center.y, opacity: 1, color: color});
        if (error > 0) {
          const sigma = (2 * currentY - 1) *  Math.pow(radiusX, 2);
          sigma <= 0 ? diagonalMove() : verticalMove();
        }
        else if (error < 0) {
          const sigma = -(2 * currentY + 1) * Math.pow(radiusY, 2);
          sigma > 0 ? diagonalMove() : horizontalMove();
        }
        else {
          diagonalMove();
        }
    }
    const half = newPoints.concat(flipHorizontal(newPoints, center.y));
    const ellipse = half.concat(flipVertical(half, center.x));

    let result = ellipse;
    if (left_upper.x > right_lower.x) {
        result = flipVertical(result, left_upper.x);
    }
    if (left_upper.y > right_lower.y) {
        result = flipHorizontal(result, left_upper.y);
    }
    return result;
};
