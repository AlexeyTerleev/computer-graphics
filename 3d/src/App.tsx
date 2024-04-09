import React, { useEffect, useRef, useState } from 'react';
import { Shape } from './Shape'; // Assuming Shape class is defined in Shape.ts
import './App.css';


const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<Shape | null>(null);
  const [file, setFile] = useState<File | undefined>();

  useEffect(() => {
    const loadShapeFromFile = async () => {
        if (file) {
            try {
                const fileContents = await file.text(); // Read file contents as text
                const data = JSON.parse(fileContents); // Parse JSON data
                const shape = new Shape(data.points);
                const centerX = canvasRef.current ?  canvasRef.current.width / 2 : 0;
                const centerY = canvasRef.current ?  canvasRef.current.height / 2 : 0;
                setShape(shape.move(centerX, "x").move(centerY, "y"))
            } catch (error) {
                console.error('Error loading shape from file:', error);
            }
        }
    };
    loadShapeFromFile();
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || undefined);
  };
  

  useEffect(() => {
    if (!canvasRef.current || !shape) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw x-axis
    ctx.beginPath();
    ctx.moveTo(0, canvasRef.current.height / 2);
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height / 2);
    ctx.strokeStyle = 'red'; // Color for x-axis
    ctx.stroke();

    // Draw y-axis
    ctx.beginPath();
    ctx.moveTo(canvasRef.current.width / 2, 0);
    ctx.lineTo(canvasRef.current.width / 2, canvasRef.current.height);
    ctx.strokeStyle = 'green'; // Color for y-axis
    ctx.stroke();

    // Draw z-axis
    // Assuming z-axis as a line coming out of the canvas towards the viewer
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasRef.current.width, canvasRef.current.height);
    ctx.strokeStyle = 'blue'; // Color for z-axis
    ctx.stroke();

    // Draw shape
    ctx.beginPath();
    shape.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.strokeStyle = 'white';
    ctx.stroke();
  }, [shape]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!shape) return;
      switch (event.key) {
        case 'w':
          setShape(shape.move(-5, "y")); // Rotate around X-axis
          break;
        case 's':
          setShape(shape.move(5, "y")); // Rotate around X-axis in the opposite direction
          break;
        case 'a':
          setShape(shape.move(-5, "x")); // Rotate around Y-axis
          break;
        case 'd':
          setShape(shape.move(5, "x")); // Rotate around Y-axis in the opposite direction
          break;
        case 'e':
          setShape(shape.move(5, "z")); // Rotate around Y-axis in the opposite direction
          break;
        case 'q':
          setShape(shape.move(-5, "z")); // Rotate around Y-axis in the opposite direction
          break;
        case 'z':
          setShape(shape.rotateX()); 
          break;
        case 'x':
          setShape(shape.rotateY()); 
          break;
        case 'c':
          setShape(shape.rotateZ()); 
          break;
        case '+':
          setShape(shape.scale(1.1)); 
          break;
        case '-':
          setShape(shape.scale(0.9)); 
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shape]);

  return (
    <div className='Wrapper'>
      <canvas className='Canvas' ref={canvasRef} width={800} height={800} />
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default App;
