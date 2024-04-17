import { Point, Color, Edge } from './interfaces';

const blue: Color = {r: 0, g: 0, b: 255, opacity: 1};

const sortByY = (vertices: Point[]): Point[] => {
    return vertices.slice().sort((a, b) => a.y - b.y);
}

export const rasterFill = (vertices: Point[]): Point[] => {
  const sortedVertices = sortByY(vertices);
  const ymin = sortedVertices[0].y;
  const ymax = sortedVertices[sortedVertices.length - 1].y;
  const edges: Point[][] = [];
  for (let y = ymin; y <= ymax; y++) {
    const intersectingEdges: Point[] = [];
    for (let i = 0; i < vertices.length; i++) {
      const currentVertex = vertices[i];
      const nextVertex = vertices[(i + 1) % vertices.length];
      if (
        (currentVertex.y <= y && nextVertex.y > y) ||
        (nextVertex.y <= y && currentVertex.y > y)
      ) {
        const intersectX =
          currentVertex.x +
          ((y - currentVertex.y) / (nextVertex.y - currentVertex.y)) *
            (nextVertex.x - currentVertex.x);
        intersectingEdges.push({ x: Math.floor(intersectX), y, color: blue });
      }
    }
    intersectingEdges.sort((a, b) => a.x - b.x);
    edges.push(intersectingEdges);
  }
  const filledVertices: Point[] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const currentScanline = edges[i];
    for (let j = 0; j < currentScanline.length - 1; j+=2) {
      const currentVertex = currentScanline[j];
      const nextVertex = currentScanline[j + 1];
      if (nextVertex) {
        for (let x = currentVertex.x; x <= nextVertex.x; x++) {
          filledVertices.push({ x, y: currentVertex.y, color: blue });
        }
      }
    }
  }
  return filledVertices;
};




const prepareEdges = (vertices: Point[]): Edge[][] => {
  const sortedVertices = sortByY(vertices);
  const ymin = sortedVertices[0].y;
  const ymax = sortedVertices[sortedVertices.length - 1].y;
  const edges: Edge[][] = new Array(ymax - ymin + 1).fill(null).map(() => []);

  for (let i = 0; i < vertices.length; i++) {
    const currentVertex = vertices[i];
    const nextVertex = vertices[(i + 1) % vertices.length];
    const dy = Math.abs(currentVertex.y - nextVertex.y);
    const dx = (nextVertex.x - currentVertex.x) / dy;
    const minY = Math.min(currentVertex.y, nextVertex.y);
    const maxY = Math.max(currentVertex.y, nextVertex.y);

    for (let y = minY; y < maxY; y++) {
      edges[y - ymin].push({ x: currentVertex.x, dx, dy });
    }
  }
  
  for (let i = 0; i < edges.length; i++) {
    edges[i].sort((a, b) => a.x - b.x);
  }
  console.log(edges)
  return edges;
};


export const rasterFillModified = (vertices: Point[]): Point[] => {
  const ymin = Math.min(...vertices.map(point => point.y));
  const ymax = Math.max(...vertices.map(point => point.y));
  const edges = prepareEdges(vertices);
  const activeEdges: Edge[] = [];

  const filledVertices: Point[] = [];

  for (let y = ymax; y >= ymin; y--) {
    for (let i = 0; i < edges[y - ymin].length; i++) {
      activeEdges.push(edges[y - ymin][i]);
    }
    activeEdges.sort((a, b) => a.x - b.x);

    let pairs: [number, number][] = [];

    for (let i = 0; i < activeEdges.length; i += 2) {
      const start = activeEdges[i];
      const end = activeEdges[i + 1];
      if (start && end) {
        pairs.push([Math.ceil(start.x), Math.floor(end.x)]);
      }
    }

    for (const [startX, endX] of pairs) {
      for (let x = startX; x <= endX; x++) {
        filledVertices.push({ x, y, color: blue });
      }
    }

    activeEdges.forEach(edge => {
      edge.x += edge.dx;
      edge.dy -= 1;
    });

    activeEdges.filter(edge => edge.dy > 0);
  }

  return filledVertices;
};


const isPointInsidePolygon = (vertices: Point[], point: Point): boolean => {
  let inside = false;
  const x = point.x;
  const y = point.y;
  const n = vertices.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = [vertices[i].x, vertices[i].y];
      const [xj, yj] = [vertices[j].x, vertices[j].y];
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
          inside = !inside;
      }
  }
  return inside;
}


export const simpleSeedFill = (vertices: Point[], seed: Point): Point[] => {
  if (!isPointInsidePolygon(vertices, seed)) {
      return [];
  }

  const filledVertices: Point[] = [];
  const visited: Set<string> = new Set();
  const stack: Point[] = [seed];

  while (stack.length > 0) {
      const currentPoint = stack.pop()!;
      const pointKey = `${currentPoint.x},${currentPoint.y}`;
      if (visited.has(pointKey)) {
        continue;
      }

      filledVertices.push(currentPoint);
      visited.add(pointKey);

      const moveLeft: Point = { x: currentPoint.x - 1, y: currentPoint.y, color: currentPoint.color };
      const moveRight: Point = { x: currentPoint.x + 1, y: currentPoint.y, color: currentPoint.color };
      const moveUp: Point = { x: currentPoint.x, y: currentPoint.y - 1, color: currentPoint.color };
      const moveDown: Point = { x: currentPoint.x, y: currentPoint.y + 1, color: currentPoint.color };

      [moveLeft, moveRight, moveUp, moveDown].forEach((point) => {
          if (isPointInsidePolygon(vertices, point)) {
              stack.push(point);
          }
      });
  }

  return filledVertices;
};




