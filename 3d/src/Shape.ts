interface Point {
    x: number;
    y: number;
    z: number;
  }
  
export class Shape {
    public points: Point[] = [];

    constructor(points: Point[] = []) {
        this.points = points;
    }

    public move(distance: number, axis: 'x' | 'y' | 'z'): Shape {
        const newPoints = this.points.map(point => {
            if (axis === 'x') {
                return { x: point.x + distance, y: point.y, z: point.z };
            } else if (axis === 'y') {
                return { x: point.x, y: point.y + distance, z: point.z };
            } else if (axis === 'z') {
                const perspectiveFactor = 1 / (1 - distance / 100);
                return { x: point.x * perspectiveFactor, y: point.y * perspectiveFactor, z: point.z + distance };
            }
            return point;
        });
        return new Shape(newPoints);
    }

    public rotate(rotationMatrix: number[][]): Shape {
        const center = this.getCenter();
        const translatedPoints = this.points.map(point => ({
            x: point.x - center.x,
            y: point.y - center.y,
            z: point.z - center.z
        }));
        const newPoints = translatedPoints.map(point => ({
            x: rotationMatrix[0][0] * point.x + rotationMatrix[0][1] * point.y + rotationMatrix[0][2] * point.z,
            y: rotationMatrix[1][0] * point.x + rotationMatrix[1][1] * point.y + rotationMatrix[1][2] * point.z,
            z: rotationMatrix[2][0] * point.x + rotationMatrix[2][1] * point.y + rotationMatrix[2][2] * point.z
        }));
        const finalPoints = newPoints.map(point => ({
            x: point.x + center.x,
            y: point.y + center.y,
            z: point.z + center.z
        }));

        return new Shape(finalPoints);
    }

    public rotateX() : Shape {
        const rotationMatrix: number[][] = [
            [1, 0, 0],
            [0, Math.cos(Math.PI / 12), -Math.sin(Math.PI / 12)],
            [0, Math.sin(Math.PI / 12), Math.cos(Math.PI / 12)]
        ];
        return this.rotate(rotationMatrix)
    }

    public rotateY() : Shape {
        const rotationMatrix: number[][] = [
            [Math.cos(Math.PI / 12), 0, Math.sin(Math.PI / 12)],
            [0, 1, 0],
            [-Math.sin(Math.PI / 12), 0, Math.cos(Math.PI / 12)]
        ];
        return this.rotate(rotationMatrix)
    }

    public rotateZ() : Shape {
        const rotationMatrix: number[][] = [
            [Math.cos(Math.PI / 12), -Math.sin(Math.PI / 12), 0],
            [Math.sin(Math.PI / 12), Math.cos(Math.PI / 12), 0],
            [0, 0, 1]
        ];
        return this.rotate(rotationMatrix)
    }

    public scale(scaleFactor: number): Shape {
        const center: Point = this.getCenter();
        const newPoints = this.points.map(point => {
            const { x, y, z } = point;
            const newX = (x - center.x) * scaleFactor + center.x;
            const newY = (y - center.y) * scaleFactor + center.y;
            const newZ = (z - center.z) * scaleFactor + center.z;
            return { x: newX, y: newY, z: newZ };
        });
        return new Shape(newPoints)
    }

    public showPoints(pointsFrame: HTMLElement): void {
        this.clearPoints(pointsFrame);
        this.points.forEach((point, i) => {
            const roundedPoint = { 
                x: Math.round(point.x * 10) / 10, 
                y: Math.round(point.y * 10) / 10, 
                z: Math.round(point.z * 10) / 10 
            };
            const pointLabel = document.createElement('div');
            pointLabel.textContent = `Точка ${i + 1}: (${roundedPoint.x}, ${roundedPoint.y}, ${roundedPoint.z})`;
            pointsFrame.appendChild(pointLabel);
        });
    }

    private clearPoints(pointsFrame: HTMLElement): void {
        while (pointsFrame.firstChild) {
            pointsFrame.removeChild(pointsFrame.firstChild);
        }
    }

    private getCenter(): Point {
        const sum = this.points.reduce((acc, curr) => ({
            x: acc.x + curr.x,
            y: acc.y + curr.y,
            z: acc.z + curr.z
        }), { x: 0, y: 0, z: 0 });
    
        return {
            x: sum.x / this.points.length,
            y: sum.y / this.points.length,
            z: sum.z / this.points.length
        };
    }
}
  