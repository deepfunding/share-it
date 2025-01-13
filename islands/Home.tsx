import { useEffect, useRef, useState } from "preact/hooks";

import Header from "~/components/Header.tsx";
import FileUpload from "~/islands/FileUpload.tsx";
import LoadingSpinner from "~/components/LoadingSpinner.tsx";
import GraphContainer from "~/islands/GraphContainer.tsx";

interface Node {
  id: string;
  label: string;
  size: number;
}

interface Link {
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

const processUserSubmission = (
  data: string[][],
  sourceData: string[][],
): GraphData => {
  const nodes = new Map<string, Node>();
  const links: Link[] = [];

  const rows = data[0][0].toLowerCase() === "id" ? data.slice(1) : data;

  rows.forEach(([id, weight]) => {
    const numericWeight = parseFloat(weight);

    if (isNaN(numericWeight)) return;

    const [, project_a, project_b] = sourceData[parseInt(id)];

    const nodeA = `Project A (${id})`;
    const nodeB = `Project B (${id})`;

    nodes.set(nodeA, {
      id: nodeA,
      label: project_a,
      size: numericWeight * 10,
    });

    nodes.set(nodeB, {
      id: nodeB,
      label: project_b,
      size: numericWeight * 10,
    });

    links.push({
      source: nodeA,
      target: nodeB,
      weight: numericWeight * 10,
      value: numericWeight,
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
