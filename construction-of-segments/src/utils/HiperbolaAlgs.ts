import Point, { Color } from "../interfaces/Point";
import { flipVertical, flipHorizontal } from "./Flip";

interface QuadraticEquation {
    a: number;
    b: number;
    c: number;
}

const findQuadraticEquation = (vertex: Point, point: Point): QuadraticEquation => {
    const a = (point.y - vertex.y) / ((point.x - vertex.x) ** 2);
    const b = (2 * a * vertex.x) - (2 * vertex.x * a * point.x) + (Math.pow(vertex.x, 2) * a) - vertex.y + point.y;
    const c = vertex.y - (a * Math.pow(vertex.x, 2)) - (b * vertex.x);
    return { a: a, b: b, c: c };
}

export const hiperbolaAlg = (points: Point[], color: Color): Point[] =>  {
    if (points.length != 2) 
        return [];

    const realVertex = points[0];
    const realPoint = points[1];

    const vertex: Point = {x: 0, y: 0, opacity: 1, color: color}
    const point: Point = {x: realPoint.x - realVertex.x, y: realPoint.y - realVertex.y, opacity: 1, color: color}

    const quadraticEquation = findQuadraticEquation(vertex, point);
    const directionY = Math.sign(quadraticEquation.a);
    
    console.log(realVertex, realPoint)
    console.log(vertex, point)
    console.log(quadraticEquation)

    let currentX = vertex.x;
    let currentY = vertex.y;
    let error = Math.abs(quadraticEquation.a + quadraticEquation.b + quadraticEquation.c  - directionY) - Math.abs(quadraticEquation.a + quadraticEquation.b + quadraticEquation.c);

    const diagonalMove = () => {
        currentX += 1;
        currentY -= 1;
        error = error + 2 * quadraticEquation.a * currentX + quadraticEquation.a + quadraticEquation.b - directionY;
    }

    const horizontalMove = () => {
        currentX += 1;
        error = error + 2 * quadraticEquation.a * currentX + quadraticEquation.a + quadraticEquation.b;
    }

    const verticalMove = () => {
        currentY += directionY;
        error = error - directionY;
    }

    const newPoints: Point[] = [];

    while (-100 < currentX + realVertex.x && currentX + realVertex.x < 100 && -100 < currentY + realVertex.y && currentY + realVertex.y < 100) {
        newPoints.push({x: Math.round(currentX + realVertex.x), y: Math.round(currentY + realVertex.y), opacity: 1, color: color});
        if (error > 0) {
            const sigma = Math.abs(quadraticEquation.a * Math.pow(currentX + 1, 2) + quadraticEquation.b * (currentX + 1) + quadraticEquation.c  - (currentY + directionY)) - Math.abs(quadraticEquation.a * Math.pow(currentX + 1, 2) + quadraticEquation.b * (currentX + 1) + quadraticEquation.c  - currentY);
            if (directionY >= 0)
                sigma <= 0 ? diagonalMove() : horizontalMove();
            else
                sigma > 0 ? diagonalMove() : horizontalMove();
        }
        else if (error < 0) {
            const sigma = Math.abs(quadraticEquation.a * Math.pow(currentX + 1, 2) + quadraticEquation.b * (currentX + 1) + quadraticEquation.c  - (currentY + directionY)) - Math.abs(quadraticEquation.a * Math.pow(currentX, 2) + quadraticEquation.b * currentX + quadraticEquation.c  - (currentY + directionY));
            if (directionY >= 0)
                sigma > 0 ? diagonalMove() : verticalMove();
            else    
                sigma <= 0 ? diagonalMove() : verticalMove();
        }
        else {
            diagonalMove();
        }
    }
    return newPoints.concat(flipHorizontal(flipVertical(newPoints, realVertex.x), realVertex.y));
};

