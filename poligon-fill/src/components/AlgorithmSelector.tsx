import React from 'react';
import Algorithm from '../enums/Algorithm'

interface LineAlgorithmSelectorProps {
  algorithm: Algorithm;
  setAlgorithm: (React.Dispatch<React.SetStateAction<Algorithm>>);
}

const AlgorithmSelector: React.FC<LineAlgorithmSelectorProps> = ({ algorithm, setAlgorithm }) => {

  const handleAlgorithmChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setAlgorithm(selectedValue as Algorithm);
  };
  
  return (
    <div className="Input">
        <label>Algorithm: </label>
        <select value={algorithm} onChange={handleAlgorithmChange}>
            <option value={Algorithm.first}>{Algorithm.first}</option>
            <option value={Algorithm.second}>{Algorithm.second}</option>
            <option value={Algorithm.third}>{Algorithm.third}</option>
            <option value={Algorithm.fourth}>{Algorithm.fourth}</option>
        </select>
    </div>
  );
};

export default AlgorithmSelector;
