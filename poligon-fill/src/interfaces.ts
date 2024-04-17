export interface Point {
    x: number,
    y: number,
    color: Color
};
  
export interface Line {
    start: Point,
    end: Point,
    color: Color
};

export interface Color {
    r: number,
    g: number,
    b: number,
    opacity: number,
}

export interface Edge {
    x: number;
    dx: number;
    dy: number;
}