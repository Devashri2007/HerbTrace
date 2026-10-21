import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  User,
  Sprout,
  FileCheck2,
  Workflow,
  Layers,
  Factory,
  ShieldCheck,
  X,
} from 'lucide-react';

const NODE_CONFIG = {
  Farmer: { bg: '#166534', border: '#14532d', icon: User, label: 'Wild Collector / Farmer' },
  Collection: { bg: '#15803d', border: '#166534', icon: Sprout, label: 'Geo Collection' },
  Batch: { bg: '#047857', border: '#065f46', icon: Sprout, label: 'Herb Batch' },
  Quality: { bg: '#0f766e', border: '#115e59', icon: FileCheck2, label: 'Quality Verification' },
  Processing: { bg: '#0284c7', border: '#0369a1', icon: Workflow, label: 'Processing Stage' },
  Formulation: { bg: '#b45309', border: '#92400e', icon: Layers, label: 'Ayurvedic Formulation' },
  Product: { bg: '#059669', border: '#047857', icon: Factory, label: 'Finished Product' },
  Consumer: { bg: '#4338ca', border: '#3730a3', icon: ShieldCheck, label: 'Consumer Verification' },
};

const BatchGenealogyGraph = ({ graphData }) => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 50, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const svgRef = useRef(null);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-botanical-200 p-8 text-center text-gray-500">
        <Sprout className="w-8 h-8 text-botanical-400 mx-auto mb-2 animate-pulse" />
        <p className="text-sm font-semibold">Generating Batch Genealogy Graph...</p>
      </div>
    );
  }

  const { nodes, edges } = graphData;

  // Layout Algorithm: Arrange nodes in horizontal stages (ranks)
  const stageOrder = ['Farmer', 'Collection', 'Batch', 'Quality', 'Processing', 'Formulation', 'Product', 'Consumer'];

  // Group nodes by type / rank
  const rankGroups = {};
  stageOrder.forEach((stage) => {
    rankGroups[stage] = [];
  });

  nodes.forEach((node) => {
    const type = node.type || 'Batch';
    if (!rankGroups[type]) rankGroups[type] = [];
    rankGroups[type].push(node);
  });

  // Calculate layout coordinates
  const nodePositions = {};
  const stageSpacingX = 220;
  const nodeSpacingY = 110;

  stageOrder.forEach((stage, stageIndex) => {
    const group = rankGroups[stage] || [];
    const totalInGroup = group.length;
    const startY = -(totalInGroup - 1) * (nodeSpacingY / 2);

    group.forEach((node, nodeIndex) => {
      nodePositions[node.id] = {
        x: stageIndex * stageSpacingX,
        y: startY + nodeIndex * nodeSpacingY,
      };
    });
  });

  // Pan controls
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTranslate({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoom = (delta) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 0.4), 2.2));
  };

  const resetView = () => {
    setScale(0.85);
    setTranslate({ x: 80, y: 160 });
  };

  return (
    <div className="bg-white rounded-xl border border-botanical-200 shadow-sm overflow-hidden flex flex-col relative select-none">
      {/* Top Graph Controls Bar */}
      <div className="bg-botanical-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-botanical-800">
        <div>
          <h4 className="text-xs font-bold flex items-center gap-2">
            <span>🔗 Interactive Batch Genealogy Graph</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-300">
              DAG Flow
            </span>
          </h4>
          <p className="text-[10px] text-botanical-300 mt-0.5">
            Click any node to view detailed cryptographic provenance & parameters
          </p>
        </div>

        {/* Zoom & Pan Controls */}
        <div className="flex items-center gap-1.5 bg-botanical-950/80 p-1 rounded-lg border border-botanical-800">
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1 text-botanical-200 hover:text-white rounded hover:bg-botanical-800"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono px-1 text-botanical-300">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1 text-botanical-200 hover:text-white rounded hover:bg-botanical-800"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1 text-botanical-200 hover:text-white rounded hover:bg-botanical-800 ml-1"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        className="w-full h-[450px] bg-[#f9fbf9] relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2ece4" strokeWidth="0.8" />
            </pattern>
            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#69b189" />
            </marker>
          </defs>

          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}>
            {/* Render Edges (Curves with arrows) */}
            {edges.map((edge) => {
              const src = nodePositions[edge.source];
              const tgt = nodePositions[edge.target];
              if (!src || !tgt) return null;

              // Cubic bezier curve
              const dx = (tgt.x - src.x) * 0.5;
              const pathD = `M ${src.x + 80} ${src.y} C ${src.x + 80 + dx} ${src.y}, ${tgt.x - 80 - dx} ${tgt.y}, ${tgt.x - 80} ${tgt.y}`;

              return (
                <g key={edge.id} className="transition-all">
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#8ecba5"
                    strokeWidth="2.2"
                    markerEnd="url(#arrowhead)"
                    strokeDasharray="none"
                  />
                  {edge.label && (
                    <text
                      x={(src.x + tgt.x) / 2}
                      y={(src.y + tgt.y) / 2 - 8}
                      fontSize="9"
                      fill="#4b725b"
                      textAnchor="middle"
                      fontWeight="600"
                      className="bg-white/90 select-none font-sans"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              const config = NODE_CONFIG[node.type] || NODE_CONFIG.Batch;
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Node Capsule */}
                  <rect
                    x="-80"
                    y="-32"
                    width="160"
                    height="64"
                    rx="14"
                    fill={node.color || config.bg}
                    stroke={isSelected ? '#f59e0b' : '#ffffff'}
                    strokeWidth={isSelected ? '3.5' : '2'}
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.12))"
                    className="transition-transform group-hover:scale-105 duration-200"
                  />

                  {/* Node Type Pill */}
                  <rect
                    x="-70"
                    y="-26"
                    width="60"
                    height="14"
                    rx="4"
                    fill="rgba(255,255,255,0.2)"
                  />
                  <text
                    x="-40"
                    y="-16"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="700"
                    textAnchor="middle"
                    className="tracking-wider uppercase"
                  >
                    {node.type}
                  </text>

                  {/* Node Label (2 lines) */}
                  {node.label.split('\n').map((line, idx) => (
                    <text
                      key={idx}
                      x="0"
                      y={idx === 0 ? 5 : 20}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight={idx === 0 ? '700' : '500'}
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {line.length > 22 ? line.slice(0, 20) + '...' : line}
                    </text>
                  ))}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Node Details Inspection Floating Panel */}
        {selectedNode && (
          <div className="absolute top-4 right-4 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-botanical-200 z-10 space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-botanical-100">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedNode.color || '#166534' }}
                />
                <span className="text-xs font-bold text-botanical-950 uppercase tracking-wider">
                  {selectedNode.type} Node Details
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-xs font-bold text-botanical-900 whitespace-pre-line">
              {selectedNode.label}
            </h4>

            {selectedNode.details && (
              <div className="bg-botanical-50/70 p-3 rounded-lg text-[11px] space-y-1.5 border border-botanical-100">
                {Object.entries(selectedNode.details).map(([key, val]) => (
                  <div key={key} className="flex justify-between gap-2">
                    <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-semibold text-botanical-950 text-right">{String(val)}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-gray-400 italic">
              Verified in HerbTrace Immutable Provenance Ledger
            </p>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="bg-botanical-50/90 px-4 py-2.5 border-t border-botanical-100 flex flex-wrap items-center gap-4 text-[10px] text-botanical-800">
        <span className="font-bold text-botanical-950">Genealogy Flow:</span>
        {stageOrder.map((stage) => {
          const cfg = NODE_CONFIG[stage];
          return (
            <div key={stage} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cfg.bg }} />
              <span>{stage}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BatchGenealogyGraph;
