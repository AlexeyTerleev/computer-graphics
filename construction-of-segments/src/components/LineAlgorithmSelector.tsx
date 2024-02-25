import React from 'react';
import LineAlgorithm from '../enums/LineAlgorithm'

interface LineAlgorithmSelectorProps {
  selectedAlgorithm: LineAlgorithm;
  setSelectedAlgorithm: (React.Dispatch<React.SetStateAction<LineAlgorithm>>);
}

const LineAlgorithmSelector: React.FC<LineAlgorithmSelectorProps> = ({ selectedAlgorithm, setSelectedAlgorithm }) => {

  const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedAlgorithm(selectedValue as LineAlgorithm);
  };
  
  return (
    <div className="Input">
        <label>Algorithm: </label>
        <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
            <option value="digitalDifferentialAnalyzer">Digital Differential Analyzer</option>
            <option value="bresenhamAlgorithm">Bresenham Algorithm</option>
            <option value="xiaolinWuAlgorithm">Wu Algorithm</option>
        </select>
    </div>
  );
};

export default LineAlgorithmSelector;
