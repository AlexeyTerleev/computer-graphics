import React, { useEffect, useState } from 'react';
import Point, {Color} from './interfaces/Point';
import DrawingMode from './enums/DrawingMode';
import LineAlgorithm from './enums/LineAlgorithm';

import DrawingModePanel from './components/DrawingModePanel';
import LineAlgorithmSelector from './components/LineAlgorithmSelector';
import CurveAlgorithmSelector from './components/CurveAlgorithmSelector';
import {digitalDifferentialAnalyzer, bresenhamAlgorithm, xiaolinWuAlgorithm} from "./utils/LineAlgs";
import { circleAlg } from './utils/CircleAlgs';
import { ellipseAlg } from './utils/EllipseAlgs';
import { parabolaAlg } from './utils/ParabolaAlgs';
import { hiperbolaAlg } from './utils/HiperbolaAlgs';
import { hermiteAlg, bezierAlg, bSplineAlg } from './utils/CurveAlgs';

import './App.css';
import CurveAlgorithm from './enums/CurveAlgorithm';


const App: React.FC = () => {
  const [segmentEnds, setSegmentEnds] = useState<Point[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [color, setColor] = useState<Color>({r: 255, g: 0, b: 0});
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DrawingMode.Line);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<LineAlgorithm>(LineAlgorithm.DDA);
  const [selectedCurveAlgorithm, setSelectedCurveAlgorithm] = useState<CurveAlgorithm>(CurveAlgorithm.Hermite);

  const [cellSize, setCellSize] = useState(25);
  const [showGrid, setShowGrid] = useState(false);
  const [debug, setDebug] = useState(false);
  const [debugRunning, setDebugRunning] = useState(false);
  const [counter, setCouter] = useState(0);
  
  const width = 500;
  const height = 500;

  
  const handleRun = () => {
    setCouter(0);
    setDebugRunning(debug);
    if (drawingMode === DrawingMode.Line) {
      if (selectedAlgorithm === LineAlgorithm.DDA) {
        setPoints(digitalDifferentialAnalyzer(segmentEnds, color));
      }
      else if (selectedAlgorithm === LineAlgorithm.Bresenham) {
        setPoints(bresenhamAlgorithm(segmentEnds, color));
      }
      else if (selectedAlgorithm === LineAlgorithm.Wu) {
        setPoints(xiaolinWuAlgorithm(segmentEnds, color));
      }
    }
    else if (drawingMode === DrawingMode.Circle) {
      setPoints(circleAlg(segmentEnds, color));
    }
    else if (drawingMode === DrawingMode.Ellipse) {
      setPoints(ellipseAlg(segmentEnds, color));
    }
    else if (drawingMode === DrawingMode.Parabola) {
      setPoints(parabolaAlg(segmentEnds, color));
    }
    else if (drawingMode === DrawingMode.Hiperbola) {
      setPoints(hiperbolaAlg(segmentEnds, color));
    }
    else if (drawingMode === DrawingMode.Curve) {
      if (selectedCurveAlgorithm === CurveAlgorithm.Hermite) {
        setPoints(hermiteAlg(segmentEnds, color));
      }
      else if (selectedCurveAlgorithm === CurveAlgorithm.Bezier) {
        setPoints(bezierAlg(segmentEnds, color));
      }
      else if (selectedCurveAlgorithm === CurveAlgorithm.BSpline) {
        setPoints(bSplineAlg(segmentEnds, color));
      }
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

  useEffect( 
    () => {
      handleReset();
    }, [drawingMode]
  );

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
    const cursorPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const point: Point = {
      x: Math.floor(cursorPt.x / cellSize), 
      y: Math.floor(cursorPt.y / cellSize),
      opacity: 1,
      color: {r: 0, b: 0, g: 255},
    }
    console.log(drawingMode);
    if (drawingMode != DrawingMode.Curve && segmentEnds.length === 2) {
      handleReset();
      setSegmentEnds([point]);
    }
    else {
      setSegmentEnds([...segmentEnds, point]);
    }
  };
  
  return (
    <div className="Wrapper">
      <div className="MainArea">
        <DrawingModePanel onSelectMode={setDrawingMode}/>
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
          {drawingMode == DrawingMode.Line && <LineAlgorithmSelector selectedAlgorithm={selectedAlgorithm} setSelectedAlgorithm={setSelectedAlgorithm} />}
          {drawingMode == DrawingMode.Curve && <CurveAlgorithmSelector selectedAlgorithm={selectedCurveAlgorithm} setSelectedAlgorithm={setSelectedCurveAlgorithm} />}
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