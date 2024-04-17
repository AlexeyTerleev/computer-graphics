import React, { useEffect, useState } from 'react';

import Algorithm from './enums/Algorithm';
import AlgorithmSelector from './components/AlgorithmSelector';
import { Point, Line, Color } from './interfaces';
import { rasterFill, rasterFillModified, simpleSeedFill } from './algorithms';


import './App.css';

const App: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.first);
  const [vertices, setVertices] = useState<Point[]>([]);
  const [filling, setFilling] = useState<Point[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const[choosePoints, setChoosePoints] = useState<boolean>(true);
  const[seed, setSeed] = useState<Point | undefined>();
  const [debug, setDebug] = useState(false);

  const cellSize = 5;
  const width = 500;
  const height = 500;

  const red: Color = {r: 255, g: 0, b: 0, opacity: 1};
  const green: Color = {r: 0, g: 255, b: 0, opacity: 1};
  const yellow: Color = {r: 255, g: 255, b: 0, opacity: 1};

  const handleReset = () => {
    setVertices([]);
    setLines([]);
    setFilling([]);
    setSeed(undefined);
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
      color: choosePoints ? green: yellow,
    }
    choosePoints ? setVertices([...vertices, point]) : setSeed(point);
  };

  const drawPolygon = () => {
    const newLines: Line[] = [];
    for (let i = 1; i < vertices.length; i++) {
      newLines.push({start: vertices[i - 1], end: vertices[i], color: red});
    }
    newLines.push({start: vertices[vertices.length - 1], end: vertices[0], color: red});
    setLines(newLines);
    
  };

  const fillPolygon = () => {
    const fill: Point[] = [];
    switch (algorithm) {
      case Algorithm.first:
        fill.push(...rasterFill(vertices));
        break;
      case Algorithm.second:
        fill.push(...rasterFill(vertices));
        break;
      case Algorithm.third:
        seed && fill.push(...simpleSeedFill(vertices, seed));
        break;
      case Algorithm.fourth:
        break;
    }
    console.log(fill)

    if (debug) {
      let index = 0;
      const delay = 1; // Adjust the delay time as needed
  
      const intervalId = setInterval(() => {
        setFilling(fill.slice(0, index));
        index++;
        if (index === fill.length) {
          clearInterval(intervalId);
        }
      }, delay);
    } else {
      setFilling(fill);
    }
  }

  return (
    <div className="Wrapper">
      <div className="MainArea">
        <svg className="Svg" onClick={createSegment} xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          {filling.map((point, index) => (
            <rect 
              key={`filling_${index}`} 
              x={point.x * cellSize} y={point.y * cellSize} 
              width={cellSize} height={cellSize} 
              fill={`rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${point.color.opacity})`} 
            />
          ))}
          {seed &&
            <rect 
              key={`seed`} 
              x={seed.x * cellSize} y={seed.y * cellSize} 
              width={cellSize} height={cellSize} 
              fill={`rgba(${seed.color.r}, ${seed.color.g}, ${seed.color.b}, ${seed.color.opacity})`} 
            />
          }
          
          {vertices.map((point, index) => (
            <rect 
              key={`vertix_${index}`}
              x={point.x * cellSize} y={point.y * cellSize} 
              width={cellSize} height={cellSize} 
              fill={`rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${point.color.opacity})`} 
            />
          ))}
          {lines.map((line, index) => (
            <line
              key={`line_${index}`}
              x1={line.start.x * cellSize + cellSize / 2}
              y1={line.start.y * cellSize + cellSize / 2}
              x2={line.end.x * cellSize + cellSize / 2}
              y2={line.end.y * cellSize + cellSize / 2}
              stroke={`rgba(${line.color.r}, ${line.color.g}, ${line.color.b}, ${line.color.opacity})`}
              strokeWidth="2"
            />
          ))}
        </svg>
        <div className="Menu">
          <AlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm} />
          {
          (algorithm == Algorithm.third) && 
          <div className="seedSettings">
            <div>
              <label htmlFor="showGridOn">Set vertices:</label> 
              <input type="radio" id="showGridOn" name="showGrid" checked={choosePoints} onChange={() => setChoosePoints(true)} />
              <label htmlFor="showGridOff">Set seed:</label>
              <input type="radio" id="showGridOff" name="showGrid" checked={!choosePoints} onChange={() => setChoosePoints(false)} />
            </div>
          </div>
          }
          <div>
            <label>Debug: </label>
            <input type="checkbox" checked={debug} onChange={() => {setDebug(!debug)}} />
          </div>
          <div className="Buttons">
            <button className="Run" onClick={drawPolygon}>Draw</button>
            <button className="Step" onClick={fillPolygon}>Fill</button>
            <button className="Reset" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;