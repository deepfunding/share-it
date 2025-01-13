import { Cosmograph } from "@cosmograph/react";
import { type GraphData } from "~/islands/Home.tsx";

const Graph: React.FC<{ data: GraphData; zoom: number }> = ({ data, zoom }) => {
  return (
    <Cosmograph
      nodes={data.nodes}
      links={data.links}
      nodeColor={(node) => {
        const value = node.size / 10;
        const r = Math.round(100 + (70 * value));
        const g = Math.round(149 - (100 * value));
        const b = Math.round(237 - (100 * value));
        return `rgb(${r}, ${g}, ${b})`;
      }}
      nodeLabelAccessor={(node) => node.label}
      nodeLabelColor={`rgb(255, 255, 255)`}
      hoveredNodeLabelColor={`rgb(255, 255, 255)`}
      nodeSize={(node) => node.size}
      linkWidth={(link) => link.value}
      linkColor={() => `rgb(128, 128, 128)`}
      initialZoomLevel={zoom}
      nodeSizeScale={1 + zoom / 10}
      showDynamicLabels={false}
      useQuadtree={true}
      backgroundColor="rgb(255, 255, 255)"
    />
  );
};

export default Graph;
