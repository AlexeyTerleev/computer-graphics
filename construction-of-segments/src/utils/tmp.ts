const bezierAlgorithm = () => {
    const svg = svgRef.current;
    console.log("bezier");
    if (svg) {
        if (segmentEnds.length >= 4 && (segmentEnds.length - 1) % 3 === 0) {
            clearSvg();
            for (let i = 0; i < segmentEnds.length - 1; i += 3) {
                const p0 = segmentEnds[i];
                const p1 = segmentEnds[i + 1];
                const p2 = segmentEnds[i + 2];
                const p3 = segmentEnds[i + 3];

                const iterations = 10000;
                let d = "";
                for (let j = 0; j <= iterations; j++) {
                    const t = j / iterations;

                    const x =
                        Math.pow(1 - t, 3) * p0.x +
                        3 * Math.pow(1 - t, 2) * t * p1.x +
                        3 * (1 - t) * Math.pow(t, 2) * p2.x +
                        Math.pow(t, 3) * p3.x;
                    const y =
                        Math.pow(1 - t, 3) * p0.y +
                        3 * Math.pow(1 - t, 2) * t * p1.y +
                        3 * (1 - t) * Math.pow(t, 2) * p2.y +
                        Math.pow(t, 3) * p3.y;

                    if (t === 0) {
                        d += `M ${x} ${y}`;
                    } else {
                        d += ` L ${x} ${y}`;
                    }
                }

                const path = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                );
                path.setAttribute("d", d);
                path.setAttribute("stroke", "blue");
                path.setAttribute("fill", "none");
                svg.appendChild(path);
            }
        }
    }
};