import React, { useEffect, useState } from 'react';
import { Delaunay } from 'd3-delaunay';

import { Point, Color } from './interfaces';

import './App.css';

const App: React.FC = () => {
  const [vertices, setVertices] = useState<Point[]>([]);
  const [triangles, setTriangles] = useState<number[][]>([]); // Array of indices for each triangle

  const cellSize = 5;
  const width = 500;
  const height = 500;

  const red: Color = { r: 255, g: 0, b: 0, opacity: 1 };
  const green: Color = { r: 0, g: 255, b: 0, opacity: 1 };
  const yellow: Color = { r: 255, g: 255, b: 0, opacity: 1 };

  const createSegment = (event: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    const point: Point = {
      x: Math.floor(cursorPt.x / cellSize),
      y: Math.floor(cursorPt.y / cellSize),
      color: yellow,
    }
    setVertices([...vertices, point]);
  };

  const handleReset = () => {
    setVertices([]);
    setTriangles([]);
  }

  const handleDraw = () => {
    if (vertices.length > 2) {
      // Perform Delaunay triangulation
      const delaunay = Delaunay.from(vertices.map(point => [point.x * cellSize, point.y * cellSize]));
      const triangulatedIndices = delaunay.triangles;
      setTriangles(triangulatedIndices);
    }
  };

  return (
    <div className="Wrapper">
      <div className="MainArea">
        <svg className="Svg" onClick={createSegment} xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          {triangles.map(triangle => (
            <polygon
              key={`${triangle[0]}-${triangle[1]}-${triangle[2]}`}
              points={triangle.map(index => `${vertices[index].x * cellSize},${vertices[index].y * cellSize}`).join(' ')}
              fill="none"
              stroke="black"
            />
          ))}
          {vertices.map((point, index) => (
            <rect
              key={`vertex_${index}`}
              x={point.x * cellSize} y={point.y * cellSize}
              width={cellSize} height={cellSize}
              fill={`rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${point.color.opacity})`}
            />
          ))}
        </svg>
        <div className="Menu">
          <div className="Buttons">
            <button className="Run" onClick={handleDraw}>Draw</button>
            <button className="Reset" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
