import React, { useState } from 'react';
import DrawingMode from '../enums/DrawingMode';

interface DrawingModePanelProps {
  onSelectMode: (mode: DrawingMode) => void;
}

const DrawingModePanel: React.FC<DrawingModePanelProps> = ({ onSelectMode }) => {
  const [activeMode, setActiveMode] = useState<DrawingMode>(DrawingMode.Line);

  const handleModeChange = (mode: DrawingMode) => {
    setActiveMode(mode);
    onSelectMode(mode);
  };

  return (
    <div className="drawing-mode-panel">
      <button
        className={activeMode === 'line' ? 'active' : ''}
        onClick={() => handleModeChange(DrawingMode.Line)}
      >
        <img src="/path/to/line-icon.png" alt="Line" />
      </button>
      <button
        className={activeMode === 'circle' ? 'active' : ''}
        onClick={() => handleModeChange(DrawingMode.Circle)}
      >
        <img src="/path/to/circle-icon.png" alt="Circle" />
      </button>
      <button
        className={activeMode === 'ellipse' ? 'active' : ''}
        onClick={() => handleModeChange(DrawingMode.Ellipse)}
      >
        <img src="/path/to/ellipse-icon.png" alt="Ellipse" />
      </button>
      <button
        className={activeMode === 'parabola' ? 'active' : ''}
        onClick={() => handleModeChange(DrawingMode.Parabola)}
      >
        <img src="/path/to/parabola-icon.png" alt="Parabola" />
      </button>
      <button
        className={activeMode === 'hiperbola' ? 'active' : ''}
        onClick={() => handleModeChange(DrawingMode.Hiperbola)}
      >
        <img src="/path/to/parabola-icon.png" alt="Hiperbola" />
      </button>
    </div>
  );
};

export default DrawingModePanel;
