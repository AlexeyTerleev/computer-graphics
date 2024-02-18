import React, { useState } from 'react';
import './App.css';

interface Point {
  x: number;
  y: number;
}

function App() {
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState<Point>({ x: 0, y: 0 });
  const [currentPoint, setCurrentPoint] = useState<'start' | 'end'>('start');

  const setSomePoint = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void => {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (currentPoint === 'start') {
      setStartPoint({ x, y });
      setCurrentPoint('end');
    } else {
      setEndPoint({ x, y });
      setCurrentPoint('start');
    }
  };

  return (
    <>
      <canvas className="Canvas" onClick={setSomePoint}></canvas>
      <p>Start Point: {startPoint.x}, {startPoint.y}</p>
      <p>End Point: {endPoint.x}, {endPoint.y}</p>
    </>
  );
}

export default App;
