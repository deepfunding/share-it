import Graph from "~/islands/Graph.tsx";
import { GraphData } from "~/islands/Home.tsx";
import ZoomControl from "~/islands/ZoomControl.tsx";

interface GraphContainerProps {
  graphRef: React.RefObject<HTMLDivElement>;
  graphData: GraphData;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSave: () => void;
}

export default function GraphContainer({
  graphRef,
  graphData,
  zoom,
  onZoomChange,
  onSave,
}: GraphContainerProps) {
  return (
    <div className="mt-8 relative" ref={graphRef}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-4">
            Predicted Weights
          </h2>
          <div className="flex-1 aspect-w-16 aspect-h-16 border flex items-center justify-center rounded-lg overflow-hidden">
            <Graph data={graphData} zoom={zoom} />
          </div>
          <div className="flex items-center justify-between mt-4 space-x-2">
            <ZoomControl
              zoom={zoom}
              onZoomChange={onZoomChange}
            />
            <button
              onClick={onSave}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
