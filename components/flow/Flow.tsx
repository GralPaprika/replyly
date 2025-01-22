import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, Connection, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from './config/FlowTypes';
import { initialNodes } from './config/initialNodes';
import { initialEdges } from './config/initialEdges';
import CustomEdge from './CustomEdge';

import ContextManagementCard from './cards/ContextManagement/ContextManagementCard';
import ActionCard from './cards/Action/ActionCard';
import NewFlowCard from './cards/NewFlow/NewFlowCard';

const edgeTypes = {
    custom: CustomEdge,
};

const Flow = forwardRef((_, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeDrag = useCallback((event: React.MouseEvent, node: any) => {
    console.log(`Node position - X: ${node.position.x.toFixed(2)}, Y: ${node.position.y.toFixed(2)}`);
  }, []);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'custom',
            data: { onDelete: handleDeleteEdge },
            style: { stroke: '#00e785', strokeWidth: 2 },
            animated: true,
          },
          eds
      )
    ), [setEdges]
  );

  const handleDeleteEdge = (id: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== id));
  };

  const addNode = (type: string) => {
    let newNode;
    switch (type) {
      case 'contextManagementCard':
        newNode = {
          id: `node-${Date.now()}`,
          type: 'contextManagementCard',
          position: { x: -400 + Math.random() * 200, y: -500 + Math.random() * 50 },
          data: {
            label: <ContextManagementCard />,
            items: [],
          },
        };
        break;
      case 'actionCard':
        newNode = {
          id: `node-${Date.now()}`,
          type: 'actionCard',
          position: { x: -400 + Math.random() * 200, y: -500 + Math.random() * 40 },
          data: {
            label: <ActionCard />,
            items: [],
          },
        };
        break;
      case 'newFlowCard':
        newNode = {
          id: `node-${Date.now()}`,
          type: 'newFlowCard',
          position: { x: -400 + Math.random() * 200, y: -500 + Math.random() * 60 },
          data: {
            label: <NewFlowCard />,
            items: [],
          },
        };
        break;
      default:
        console.error(`Unknown node type: ${type}`);
        return;
    }

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  useImperativeHandle(ref, () => ({
    addNode,
  }));

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeDrag={onNodeDrag}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Background />
    </ReactFlow>
  );
});

export default Flow;
