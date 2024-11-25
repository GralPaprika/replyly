import React, { useCallback } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from './config/FlowTypes';
import { initialNodes } from './config/initialNodes';
import { initialEdges } from './config/initialEdges';

export default function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeDrag = useCallback((event: React.MouseEvent, node: any) => {
    console.log(`Node position - X: ${node.position.x.toFixed(2)}, Y: ${node.position.y.toFixed(2)}`);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeDrag={onNodeDrag}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      {/* <Controls /> */}
      <Background />
    </ReactFlow>
  );
}

