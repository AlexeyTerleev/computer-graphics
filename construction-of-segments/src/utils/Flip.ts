import Point from "../interfaces/Point";

export const flipHorizontal = (points: Point[], axiosY: number): Point[] =>  {
  const newPoints: Point[] = points.map(
    (point) => ({
      x: point.x, 
      y: - point.y + 2 * axiosY,
      opacity: point.opacity, 
      color: point.color,
    })
  );
  return newPoints;
};
  
export const flipVertical = (points: Point[], axiosX: number): Point[] =>  {
  const newPoints: Point[] = points.map(
    (point) => ({
      x: -point.x + 2 * axiosX, 
      y: point.y,
      opacity: point.opacity, 
      color: point.color,
    })
  );
  return newPoints;
};