import React, { useEffect, useState } from 'react';


import './App.css';

export interface Point {
  x: number,
  y: number,
  color: Color
  opacity: number,
};

export interface Color {
  r: number,
  g: number,
  b: number,
}


const App: React.FC = () => {
  const [vertices, setVertices] = useState<Point[]>([]);
  const [lines, setLines] = useState<[Point, Point, Color][]>([]);

  const cellSize = 5;
  const width = 500;
  const height = 500;

  const red: Color = {r: 255, g: 0, b: 0};
  const green: Color = {r: 0, g: 255, b: 0};
  const blue: Color = {r: 0, g: 0, b: 255};

  const getColorName = (color: Color) => {
    if (color.r === red.r && color.g === red.g && color.b === red.b) {
      return "red";
    }
    if (color.r === green.r && color.g === green.g && color.b === green.b) {
      return "green";
    }
    if (color.r === blue.r && color.g === blue.g && color.b === blue.b) {
      return "blue";
    }
  };

  const checkConvexity = () => {
    console.log(vertices)
    if (vertices.length < 3) {
      alert("Minimum number of points to test convexity: 3");
      return;
    }
    const isClockwise = getOrientation(vertices[0], vertices[1], vertices[2]) < 0;
    for (let i = 1; i < vertices.length; i++) {
      const first = vertices[i];
      const second = vertices[(i + 1) % vertices.length];
      const third = vertices[(i + 2) % vertices.length];
  
      const currentOrientation = getOrientation(first, second, third);
      if ((currentOrientation < 0 && !isClockwise) || (currentOrientation > 0 && isClockwise)) {
        alert("The polygon is not convex");
        return;
      }
    }
    alert("The polygon is convex");
  };

  const getOrientation = (first: Point, second: Point, third: Point): number => {
    const val = (second.y - first.y) * (third.x - second.x) - (second.x - first.x) * (third.y - second.y);
    return val === 0 ? 0 : val > 0 ? 1 : -1;
  };

  function handleNormalize() {
    if (vertices.length < 3) {
      alert("Minimum number of points to test convexity: 3");
      return;
    }

    const updatedLines: [Point, Point, Color][] = [];

    for (let i = 0; i < vertices.length; i++) {
      const currPoint = vertices[i];
      const nextPoint = vertices[(i + 1) % vertices.length];

      const normalX: number = nextPoint.y - currPoint.y;
      const normalY: number = currPoint.x - nextPoint.x;

      const normalLength: number = Math.sqrt(normalX * normalX + normalY * normalY);
      const normalizedNormalX: number = normalX / normalLength;
      const normalizedNormalY: number = normalY / normalLength;

      const start: Point = {
        x: currPoint.x + normalizedNormalX * 100,
        y: currPoint.y + normalizedNormalY * 100,
        color: vertices[0].color,
        opacity: vertices[0].opacity,
      };

      const end: Point = {
        x: currPoint.x - normalizedNormalX * 100,
        y: currPoint.y - normalizedNormalY * 100,
        color: vertices[0].color,
        opacity: vertices[0].opacity,
      };

      updatedLines.push([start, end, green]);
    }

    setLines([...lines, ...updatedLines]);
  }

  const computeConvexHullGraham = () => {
      if (vertices.length < 3) {
          alert("Minimum number of points to test convexity: 3");
          return;
      }

      const sortedPoints = vertices.slice().sort((a, b) => {
          return a.y !== b.y ? a.y - b.y : a.x - b.x;
      });

      const hullPoints = [sortedPoints[0], sortedPoints[1]];
      for (let i = 2; i < sortedPoints.length; i++) {
          while (
              hullPoints.length > 1 &&
              getOrientation(
                  hullPoints[hullPoints.length - 2],
                  hullPoints[hullPoints.length - 1],
                  sortedPoints[i]
              ) !== -1
          ) {
              hullPoints.pop();
          }
          hullPoints.push(sortedPoints[i]);
      }
      const updatedLines: [Point, Point, Color][] = [];
      for (let i = 0; i < hullPoints.length; i++) {
          const startPoint = hullPoints[i];
          const endPoint = hullPoints[(i + 1) % hullPoints.length];
          updatedLines.push([startPoint, endPoint, blue]);
      }
      setLines([...lines, ...updatedLines]);
  };

  const computeConvexHullJarvis = () => {
      if (vertices.length < 3) {
          alert("Minimum number of points to test convexity: 3");
          return;
      }
      const leftmostPoint = vertices.reduce((leftmost, point) => point.x < leftmost.x ? point : leftmost);
      const hullPoints = [];
      let p = leftmostPoint;
      let q;
      do {
          hullPoints.push(p);
          q = vertices[0];
          for (let i = 1; i < vertices.length; i++) {
              if (q === p || getOrientation(p, q, vertices[i]) === -1) {
                  q = vertices[i];
              }
          }
          p = q;
      } while (p !== leftmostPoint);

      const updatedLines: [Point, Point, Color][] = [];
      for (let i = 0; i < hullPoints.length; i++) {
          const startPoint = hullPoints[i];
          const endPoint = hullPoints[(i + 1) % hullPoints.length];
          updatedLines.push([startPoint, endPoint, blue]);
      }
      setLines([...lines, ...updatedLines]);
  };

  const handleReset = () => {
    setVertices([]);
    setLines([]);
  }

  const createSegment = (event: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const point: Point = {
      x: Math.floor(cursorPt.x / cellSize), 
      y: Math.floor(cursorPt.y / cellSize),
      opacity: 1,
      color: {r: 0, b: 0, g: 255},
    }
    setVertices([...vertices, point]);
  };

  
  const drawPolygon = () => {
    if (!vertices.length) 
      return;
    const newLines: [Point, Point, Color][] = [];
    for (let i = 1; i < vertices.length; i++) {
      newLines.push([vertices[i - 1], vertices[i], red]);
    }
    newLines.push([vertices[vertices.length - 1], vertices[0], red]);
    setLines(newLines);
  };
  
  
  return (
    <div className="Wrapper">
      <div className="MainArea">
        <svg className="Svg" onClick={createSegment} xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          {vertices.map((point, index) => (
            <rect 
              key={index} 
              x={point.x * cellSize} y={point.y * cellSize} 
              width={cellSize} height={cellSize} 
              fill={`rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${point.opacity})`} 
            />
          ))}
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line[0].x * cellSize + cellSize / 2}
              y1={line[0].y * cellSize + cellSize / 2}
              x2={line[1].x * cellSize + cellSize / 2}
              y2={line[1].y * cellSize + cellSize / 2}
              stroke={getColorName(line[2])}
              strokeWidth="2"
            />
          ))}
        </svg>
        <div className="Menu">
          <div className="Buttons">
            <button className="Run" onClick={drawPolygon}>Draw</button>
            <button className="Run" onClick={checkConvexity}>Check Convexity</button>
            <button className="Run" onClick={computeConvexHullGraham}>Convex Hull Graham</button>
            <button className="Run" onClick={computeConvexHullJarvis}>Convex Hull Jarvis</button>
            <button className="Run" onClick={handleNormalize}>Normal</button>
            <button className="Reset" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;