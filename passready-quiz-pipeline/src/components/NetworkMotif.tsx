import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND} from '../brand';

type Node = {x: number; y: number; r: number};

/** A small polygon cluster: thin emerald lines between dots. */
const cluster = (nodes: Node[], edges: [number, number][], key: string) => (
  <g key={key}>
    {edges.map(([a, b], i) => (
      <line
        key={`e-${i}`}
        x1={nodes[a].x}
        y1={nodes[a].y}
        x2={nodes[b].x}
        y2={nodes[b].y}
        stroke={BRAND.emerald}
        strokeWidth={1.6}
      />
    ))}
    {nodes.map((n, i) => (
      <circle key={`n-${i}`} cx={n.x} cy={n.y} r={n.r} fill={BRAND.emerald} />
    ))}
  </g>
);

const CORNER_NODES: Node[] = [
  {x: 18, y: 26, r: 5},
  {x: 132, y: 12, r: 3.5},
  {x: 96, y: 122, r: 6},
  {x: 8, y: 148, r: 3},
  {x: 186, y: 96, r: 4},
  {x: 62, y: 66, r: 3},
];

const CORNER_EDGES: [number, number][] = [
  [0, 1],
  [0, 5],
  [5, 2],
  [1, 4],
  [4, 2],
  [2, 3],
  [3, 0],
  [5, 1],
];

/**
 * Subtle emerald network-polygon motif, pinned to the frame corners only.
 * Corner boxes are deliberately sized well outside the text safe area so the
 * motif never sits behind copy.
 */
export const NetworkMotif: React.FC<{
  width: number;
  height: number;
  /** Corner box edge length in px. */
  size?: number;
  opacity?: number;
}> = ({width, height, size = 260, opacity = 0.17}) => {
  const corners = [
    {t: `translate(0, 0)`},
    {t: `translate(${width}, 0) scale(-1, 1)`},
    {t: `translate(0, ${height}) scale(1, -1)`},
    {t: `translate(${width}, ${height}) scale(-1, -1)`},
  ];

  return (
    <AbsoluteFill style={{opacity}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {corners.map((c, i) => (
          <g key={i} transform={`${c.t} scale(${size / 200})`}>
            {cluster(CORNER_NODES, CORNER_EDGES, `c-${i}`)}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
