import React, { useState } from 'react';
import Point, {Color} from './pointInterface';
import {digitalDifferentialAnalyzer, bresenhamAlgorithm, xiaolinWuAlgorithm} from "./algs"

import './App.css';


const App: React.FC = () => {
  const [segmentEnds, setSegmentEnds] = useState<Point[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [color, setColor] = useState<Color>({r: 255, g: 0, b: 0});

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("digitalDifferentialAnalyzer");
  const [cellSize, setCellSize] = useState(25);
  const [showGrid, setShowGrid] = useState(false);
  const [debug, setDebug] = useState(false);
  const [debugRunning, setDebugRunning] = useState(false);
  const [counter, setCouter] = useState(0);
  
  const width = 500;
  const height = 500;

  const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedAlgorithm(selectedValue);
  };

  const handleRun = () => {
    setCouter(0);
    setDebugRunning(debug);

    if (selectedAlgorithm === "digitalDifferentialAnalyzer") {
      setPoints(digitalDifferentialAnalyzer(segmentEnds, color));
    }
    else if (selectedAlgorithm === "bresenhamAlgorithm") {
      setPoints(bresenhamAlgorithm(segmentEnds, color));
    }
    else if (selectedAlgorithm === "xiaolinWuAlgorithm") {
      setPoints(xiaolinWuAlgorithm(segmentEnds, color));
    }
  }

  const handleStep = () => {
    if (counter === points.length) {
      setDebugRunning(false);
      return;
    }
    setCouter(counter + 1);
  }

  const handleReset = () => {
    setCouter(0);
    setPoints([]);
    setSegmentEnds([]);
    setDebugRunning(false);
  }

  const toggleGrid = () => {
    if (!showGrid && cellSize < 10) {
      alert("Grid only for cell size > 10");
      return;
    }
    setShowGrid(!showGrid);
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
      y: Math.floor(cursorPt.y / cellSize),
      opacity: 1,
      color: {r: 0, b: 0, g: 255},
    }

    if (segmentEnds.length === 2) {
      handleReset();
      setSegmentEnds([point]);
    } else {
      setSegmentEnds([...segmentEnds, point]);
    }
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
          {segmentEnds.map((point, index) => (
            <rect 
            key={index} 
            x={point.x * cellSize} y={point.y * cellSize} 
            width={cellSize} height={cellSize} 
            fill={`rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${point.opacity})`} 
          />
          ))}
          {(debug ? points.slice(0, counter) : points).map((point, index) => (
            <rect 
            key={index} 
            x={point.x * cellSize} y={point.y * cellSize} 
            width={cellSize} height={cellSize} 
            fill={`rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${point.opacity})`} 
          />
          ))}
        </svg>
        <div className="Menu">
          <div className="Input">
            <label>Algorithm: </label>
            <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
              <option value="digitalDifferentialAnalyzer">Digital Differential Analyzer</option>
              <option value="bresenhamAlgorithm">Bresenham Algorithm</option>
              <option value="xiaolinWuAlgorithm">Wu Algorithm</option>
            </select>
          </div>
          <div className="Input">
            <label>Cell size: </label>
            <input type="text" value={cellSize} onChange={handleCellSizeChange} />
          </div>
          <div className="debugSettings">
            <div className="debugCheckbox">
              <label>Show Grid: </label>
              <input type="checkbox" checked={showGrid} onChange={toggleGrid} />
            </div>
            <div>
              <label>Debug: </label>
              <input type="checkbox" checked={debug} onChange={() => {setDebug(!debug)}} />
            </div>
          </div>
          <div className="Buttons">
            {!debugRunning && <button className="Run" onClick={handleRun}>Run</button>}
            {debugRunning && <button className="Step" onClick={handleStep}>Next</button>}
            <button className="Reset" onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;