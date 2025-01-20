import { useEffect, useRef, useState } from "preact/hooks";

import Header from "~/components/Header.tsx";
import FileUpload from "~/islands/FileUpload.tsx";
import LoadingSpinner from "~/components/LoadingSpinner.tsx";
import GraphContainer from "~/islands/GraphContainer.tsx";

export interface Node {
  id: string;
  label: string;
  size: number;
  color?: string;
}

export interface Link {
  source: string;
  target: string;
  weight: number;
  value: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface FileData {
  fileName: string;
  data: string[][];
}

export const ROOT_NODE = "deepfunding_root";
export const ROOT_NODE_COLOR = [159, 58, 188];

const processUserSubmission = (
  data: string[][],
  sourceData: string[][],
): GraphData => {
  const nodes = new Map<string, Node>();
  const links: Link[] = [];

  const rows = data[0][0].toLowerCase() === "id" ? data.slice(1) : data;

  rows.forEach(([id, weight], idx) => {
    const numericWeight = parseFloat(weight);

    if (isNaN(numericWeight)) return;

    const [, project_a, project_b] = sourceData[parseInt(id) - 1];
    const childId = `${project_b}_${idx}`;

    if (!nodes.has(project_a)) {
      nodes.set(project_a, {
        id: project_a,
        label: project_a,
        size: numericWeight,
        color: `rgb(${ROOT_NODE_COLOR.join(", ")})`,
      });
    }

    if (!nodes.has(childId)) {
      nodes.set(childId, {
        id: childId,
        label: project_b,
        size: numericWeight,
      });
    }

    links.push({
      source: project_a,
      target: childId,
      weight: numericWeight * 1,
      value: numericWeight,
    });

    links.push({
      source: ROOT_NODE,
      target: project_a,
      weight: 1,
      value: 1,
    });
  });

  return {
    nodes: Array.from(nodes.values()),
    links,
  };
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [sourceData, setSourceData] = useState<string[][] | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const graphRef = useRef<HTMLDivElement>(null);

  const ZOOM_LEVELS = [
    "max-w-xl",
    "max-w-2xl",
    "max-w-3xl",
    "max-w-4xl",
    "max-w-5xl",
    "max-w-6xl",
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const csvUrl = urlParams.get("url");

    fetch("/dataset.csv").then((response) => response.text()).then((data) => {
      const [, ...rows] = data.split("\n").map((row) => row.split(","));
      rows.sort(([idxA], [idxB]) => parseInt(idxA) - parseInt(idxB));
      setSourceData(rows);
    });

    if (csvUrl) {
      setIsLoading(true);
      fetch(csvUrl)
        .then((response) => response.text())
        .then((csvData) => {
          const rows = csvData.split("\n").map((row) => row.split(","));
          setFileData({ fileName: "remote-data.csv", data: rows });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error loading CSV from URL:", error);
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (fileData && sourceData) {
      const processedData = processUserSubmission(fileData.data, sourceData);
      setGraphData(processedData);
    }
  }, [fileData, sourceData]);

  const handleFileUpload = (file: File): void => {
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = () => {
      const csvData = reader.result as string;
      const rows = csvData.split("\n").map((row) => row.split(","));
      setFileData({ fileName: file.name, data: rows });
      setIsLoading(false);
    };

    reader.onerror = () => {
      console.error("Error reading file");
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleSaveCanvas = () => {
    const canvasElements = Array.from(document.getElementsByTagName("canvas"));
    const [canvas] = canvasElements;
    if (!canvas) {
      console.error("No canvas element found");
      return;
    }

    const link = document.createElement("a");
    link.download = "deep_funding_graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className={`${ZOOM_LEVELS[zoom]} mx-auto px-4 py-16`}>
        <Header />
        {!graphData && <FileUpload onFileUpload={handleFileUpload} />}

        {isLoading && <LoadingSpinner />}

        {graphData && !isLoading && (
          <GraphContainer
            graphRef={graphRef}
            graphData={graphData}
            zoom={zoom}
            onZoomChange={setZoom}
            onSave={handleSaveCanvas}
          />
        )}
      </div>
    </main>
  );
}
