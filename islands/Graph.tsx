import { type RefObject } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import { Cosmograph, type CosmographRef } from "@cosmograph/react";
import {
  type GraphData,
  type Link,
  type Node,
  ROOT_NODE,
  ROOT_NODE_COLOR,
} from "~/islands/Home.tsx";

const COLOR_WHITE = "rgb(255, 255, 255)";

const clickNode = (
  ref: RefObject<CosmographRef<Node, Link>>,
  node: Node | undefined,
) => {
  if (!ref.current || !node) {
    return;
  }

  const { current: graph } = ref;
  const adjacentNodes = graph.getAdjacentNodes(node.id);
  if (!adjacentNodes) {
    return;
  }

  const selectedNodes = graph.getSelectedNodes();
  if (selectedNodes && selectedNodes.includes(node)) {
    return graph.unselectNodes();
  }

  graph.selectNodes([...adjacentNodes, node]);
};

const getNodeColor = (node: Node) => {
  const value = node.size / 10;
  const r = Math.round(100 + (70 * value));
  const g = Math.round(149 - (100 * value));
  const b = Math.round(237 - (100 * value));

  return node.color ?? `rgb(${r}, ${g}, ${b})`;
};

const Graph: React.FC<{ data: GraphData; zoom: number }> = ({ data }) => {
  const ref = useRef<CosmographRef<Node, Link>>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.zoomToNode(data.nodes.find(({ id }) => id === ROOT_NODE)!);
  }, [ref]);

  const handler = clickNode.bind(null, ref);

  return (
    <Cosmograph
      ref={ref}
      nodes={data.nodes}
      links={data.links}
      nodeColor={getNodeColor}
      nodeLabelAccessor={(node) => node.label}
      nodeLabelColor={COLOR_WHITE}
      hoveredNodeLabelColor={COLOR_WHITE}
      nodeSize={(node) => node.size}
      linkWidth={(link) => link.weight}
      linkColor={`rgba(${ROOT_NODE_COLOR.join(", ")}, 0.5)`}
      showDynamicLabels={false}
      useQuadtree
      backgroundColor={COLOR_WHITE}
      spaceSize={2048}
      fitViewOnInit
      simulationRepulsion={0.005}
      simulationRepulsionTheta={0.01}
      simulationCenter={0.5}
      linkArrows={false}
      simulationGravity={0.01}
      curvedLinks
      onClick={handler}
      simulationLinkDistance={3}
      simulationLinkDistRandomVariationRange={[0.8, 1.5]}
    />
  );
};

export default Graph;
