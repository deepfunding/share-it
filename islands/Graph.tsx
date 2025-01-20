import { useEffect, useRef } from "preact/hooks";
import { Cosmograph, type CosmographRef } from "@cosmograph/react";
import {
  type GraphData,
  type Link,
  type Node,
  ROOT_NODE,
  ROOT_NODE_COLOR,
} from "~/islands/Home.tsx";

const Graph: React.FC<{ data: GraphData; zoom: number }> = ({ data }) => {
  const ref = useRef<CosmographRef<Node, Link>>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.zoomToNode(data.nodes.find(({ id }) => id === ROOT_NODE)!);
  }, [ref]);

  return (
    <Cosmograph
      ref={ref}
      nodes={data.nodes}
      links={data.links}
      nodeColor={(node) => {
        const value = node.size / 10;
        const r = Math.round(100 + (70 * value));
        const g = Math.round(149 - (100 * value));
        const b = Math.round(237 - (100 * value));
        return node.color ?? `rgb(${r}, ${g}, ${b})`;
      }}
      nodeLabelAccessor={(node) => node.label}
      nodeLabelColor={`rgb(255, 255, 255)`}
      hoveredNodeLabelColor={`rgb(255, 255, 255)`}
      nodeSize={(node) => node.size}
      linkWidth={(link) => link.weight}
      linkColor={`rgba(${ROOT_NODE_COLOR.join(", ")}, 0.5)`}
      showDynamicLabels={false}
      useQuadtree
      backgroundColor="rgb(255, 255, 255)"
      spaceSize={2048}
      fitViewOnInit
      simulationRepulsion={0.1}
      simulationRepulsionTheta={0.1}
      simulationCenter={0.5}
      linkArrows={false}
      simulationGravity={0.01}
      curvedLinks
      simulationLinkDistance={3}
      simulationLinkDistRandomVariationRange={[0.8, 1.5]}
    />
  );
};

export default Graph;
