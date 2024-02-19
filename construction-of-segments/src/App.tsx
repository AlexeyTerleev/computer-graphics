import React, { useState } from 'react';
import './App.css';

interface Point {
  x: number;
  y: number;
}

const App: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [cellSize, setCellSize] = useState(25);
  const [showGrid, setShowGrid] = useState(true);
  const width = 500;
  const height = 500;

  const toggleGrid = () => {
    if (!showGrid && cellSize < 10) {
      alert("Grid only for cell size > 10");
    }
    else {
      setShowGrid(!showGrid);
    }
  }

  const handleCellSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCellSize = parseInt(e.target.value);
    if (newCellSize < 10 && showGrid) {
      setShowGrid(false);
      alert("Grid only for cell size > 10")
    }
    setCellSize(newCellSize ? newCellSize : 0);
  }

  const createSegment = (event: React.MouseEvent<SVGSVGElement, MouseEvent>): void => {
    const svg = event.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());

    const point: Point = {
      x: Math.floor(cursorPt.x / cellSize), 
      y: Math.floor(cursorPt.y / cellSize)
    }

    if (points.length >= 2) {
      setPoints([point]);
    } else {
      setPoints([...points, point]);
    }
  };

  const digitalDifferentialAnalyzer = () => {
    if (points.length != 2) return;

    const start = points[0];
    const end = points[1];

    const length = Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y));

    const deltaX = -(start.x - end.x) / length;
    const deltaY = -(start.y - end.y) / length;

    const newPoints = [start];
    for (let i = 1; i < length; i++) {
      const currentPoint: Point = {
        x: Math.round(start.x + i * deltaX),
        y: Math.round(start.y + i * deltaY),
      };
      newPoints.push(currentPoint);
    }
    newPoints.push(end);
    setPoints(newPoints);
  };

  const bresenhamAlgorithm = () => {
    if (points.length !== 2) return;
  
    const start = points[0];
    const end = points[1];
  
    let currentX = start.x;
    let currentY = start.y;
  
    const deltaX = Math.abs(end.x - start.x);
    const deltaY = Math.abs(end.y - start.y);
  
    const stepX = start.x < end.x ? 1 : -1;
    const stepY = start.y < end.y ? 1 : -1;
  
    let error = deltaX - deltaY;
    const newPoints: Point[] = [];
    while (currentX !== end.x || currentY !== end.y) {
      newPoints.push({ x: currentX, y: currentY });
  
      const doubleError = error * 2;
  
      if (doubleError > -deltaY) {
        error -= deltaY;
        currentX += stepX;
      }
      if (doubleError < deltaX) {
        error += deltaX;
        currentY += stepY;
      }
    }
    newPoints.push(end);
    setPoints(newPoints);
  };
  

  return (
    <div className="Wrapper">
      <div className="MainArea">
        <svg className="Svg" onClick={createSegment} xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          {showGrid && Array.from({ length: Math.ceil(width / cellSize) }).map((_, indexX) => (
            Array.from({ length: Math.ceil(height / cellSize) }).map((_, indexY) => (
              <rect
                className="GridCell"
                key={`${indexX}-${indexY}`}
                x={indexX * cellSize}
                y={indexY * cellSize}
                width={cellSize}
                height={cellSize}
              />
            ))
          ))}
          {points.map((point, index) => (
            <rect key={index} x={point.x * cellSize} y={point.y * cellSize} width={cellSize} height={cellSize} fill="red" />
          ))}
        </svg>
        <div className="Menu">
          <div>
            <label>Show Grid: </label>
            <input type="checkbox" checked={showGrid} onChange={toggleGrid} />
          </div>
          <div>
            <label>Cell size: </label>
            <input type="text" value={cellSize} onChange={handleCellSizeChange} />
          </div>
          <button onClick={digitalDifferentialAnalyzer}>Digital Differential Analyzer</button>
          <button onClick={bresenhamAlgorithm}>Bresenham Algorithm</button>
        </div>
      </div>
      <ul className="PointList">
        {points.map((point, index) => (
          <li key={index}>
            Point {index + 1}: ({point.x}, {point.y})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;