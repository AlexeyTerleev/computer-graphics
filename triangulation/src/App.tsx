import React, { useEffect, useState } from 'react';
import { Delaunay, Voronoi } from 'd3-delaunay'; // Import Voronoi
import { Point, Color } from './interfaces';
import './App.css';

const App: React.FC = () => {
  const [vertices, setVertices] = useState<Point[]>([]);
  const [triangles, setTriangles] = useState<Point[][]>([]); // Array of triangles with vertices represented as Point
  const [voronoiCells, setVoronoiCells] = useState<number[][]>([]); // Array of Voronoi cell indices for each point

  const cellSize = 5;
  const width = 500;
  const height = 500;

  const yellow: Color = { r: 255, g: 255, b: 0, opacity: 1 };
  const blue: Color = { r: 0, g: 0, b: 255, opacity: 1 };
  const orange: Color = { r: 255, g: 165, b: 0, opacity: 1 }; 

  const asString = (color: Color) => {
    return`rgba(${color.r}, ${color.g}, ${color.b}, ${color.opacity})`;
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
      color: yellow,
    };
    setVertices([...vertices, point]);
  };

  const handleReset = () => {
    setVertices([]);
    setTriangles([]);
    setVoronoiCells([]);
  };

  const handleDraw = () => {
    if (vertices.length > 2) {
      const delaunay = Delaunay.from(vertices.map(point => [point.x, point.y]));
      const triangleIndices: Point[][] = Array.from(delaunay.trianglePolygons(), triangle =>
        triangle.map(point => ({ x: point[0], y: point[1], color: yellow }))
      );
      setTriangles(triangleIndices);

      // Compute Voronoi diagram
      const voronoi = delaunay.voronoi([0, 0, width, height]);
      const voronoiCells: number[][] = Array.from({ length: vertices.length }, (_, i) => voronoi.cellPolygon(i));
      setVoronoiCells(voronoiCells);
    }
  };
  
  return (
    <div className="Wrapper">
      <div className="MainArea">
        <svg className="Svg" onClick={createSegment} xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          {/* Render Voronoi cells */}
          {voronoiCells.map((cell, index) => (
            <polygon
              key={`cell_${index}`}
              points={cell.map((point) => `${point[0] * cellSize + cellSize / 2},${point[1] * cellSize + cellSize / 2}`).join(" ")}
              stroke={asString(orange)} strokeWidth={cellSize} fill="none"
            />
          ))}
          {/* Render triangles */}
          {triangles.map((triangle, index) => (
            <polygon
              key={`triangle_${index}`}
              points={triangle.map((point) => `${point.x * cellSize + cellSize / 2},${point.y * cellSize + cellSize / 2}`).join(" ")}
              stroke={asString(blue)} strokeWidth={cellSize} fill="none"
            />
          ))}
          {/* Render vertices */}
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
