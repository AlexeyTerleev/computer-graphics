import Point, { Color } from "../interfaces/Point";

export const hermiteAlg = (points: Point[], color: Color): Point[] =>  {
    if (points.length < 2) 
        return [];

    const newPoints: Point[] = [];
    for (let i = 0; i < points.length - 1; i++) {
        const currentPoint = points[i];
        const nextPoint = points[i + 1];
        const tangentStart = i > 0 ? (nextPoint.x - points[i - 1].x) / 2 : 0;
        const tangentEnd = i < points.length - 2 ? (points[i + 2].x - currentPoint.x) / 2 : 0;

        for (let t = 0; t <= 1; t += 0.01) {
            const h1 = 2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1;
            const h2 = -2 * Math.pow(t, 3) + 3 * Math.pow(t, 2);
            const h3 = Math.pow(t, 3) - 2 * Math.pow(t, 2) + t;
            const h4 = Math.pow(t, 3) - Math.pow(t, 2);

            const x = Math.round(h1 * currentPoint.x + h2 * nextPoint.x + h3 * tangentStart + h4 * tangentEnd);
            const y = Math.round(h1 * currentPoint.y + h2 * nextPoint.y + h3 * tangentStart + h4 * tangentEnd);

            newPoints.push({x: x, y: y, color: color, opacity: currentPoint.opacity});
        }
    }
    
    return newPoints;
};


export const bezierAlg = (points: Point[], color: Color): Point[] =>  {
    if (points.length < 4 || (points.length - 1) % 3 !== 0)
        return []; 

    const newPoints: Point[] = [];
    
    for (let i = 0; i < points.length - 1; i += 3) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const p2 = points[i + 2];
        const p3 = points[i + 3];

        const iterations = 100;
        for (let j = 0; j <= iterations; j++) {
            const t = j / iterations;

            const x = Math.round(
                Math.pow(1 - t, 3) * p0.x +
                3 * Math.pow(1 - t, 2) * t * p1.x +
                3 * (1 - t) * Math.pow(t, 2) * p2.x +
                Math.pow(t, 3) * p3.x);
            const y = Math.round(
                Math.pow(1 - t, 3) * p0.y +
                3 * Math.pow(1 - t, 2) * t * p1.y +
                3 * (1 - t) * Math.pow(t, 2) * p2.y +
                Math.pow(t, 3) * p3.y);

            newPoints.push({x: x, y: y, color: color, opacity: p0.opacity});
        }
    }
    
    return newPoints;
};


export const bSplineAlg = (points: Point[], color: Color): Point[] =>  {
    if (points.length < 2)
        return [];

    const newPoints: Point[] = [];

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];

        const t0 = i > 0 ? (p1.x - points[i - 1].x) / 2 : 0;
        const t1 =
            i < points.length - 2
                ? (points[i + 2].x - p0.x) / 2
                : 0;

        for (let t = 0; t <= 1; t += 0.01) {
            const h1 = 2 * Math.pow(t, 3) - 3 * Math.pow(t, 2) + 1;
            const h2 = -2 * Math.pow(t, 3) + 3 * Math.pow(t, 2);
            const h3 = Math.pow(t, 3) - 2 * Math.pow(t, 2) + t;
            const h4 = Math.pow(t, 3) - Math.pow(t, 2);

            const x = Math.round(h1 * p0.x + h2 * p1.x + h3 * t0 + h4 * t1);
            const y = Math.round(h1 * p0.y + h2 * p1.y + h3 * t0 + h4 * t1);

            newPoints.push({x: x, y: y, color: color, opacity: 1});
        }
    }

    return newPoints;
};

