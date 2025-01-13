import { useEffect, useRef, useState } from "preact/hooks";

import Header from "~/components/Header.tsx";
import FileUpload from "~/islands/FileUpload.tsx";
import LoadingSpinner from "~/components/LoadingSpinner.tsx";
import Graph from "~/islands/Graph.tsx";

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
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/dataset.csv").then((response) => response.text()).then((data) => {
      const [, ...rows] = data.split("\n").map((row) => row.split(","));
      rows.sort(([idxA], [idxB]) => parseInt(idxA) - parseInt(idxB));

      setSourceData(rows);
    });
  }, []);

  useEffect(() => {
    if (fileData && sourceData) {
      const processedData = processUserSubmission(fileData.data, sourceData);
      setGraphData(processedData);
    }
  }, [fileData, sourceData]);

  useEffect(() => {
    if (graphData && graphRef.current) {
      graphRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [graphData]);

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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Header />
        {!graphData && <FileUpload onFileUpload={handleFileUpload} />}

        {isLoading && <LoadingSpinner />}

        {graphData && !isLoading && (
          <div className="mt-8" ref={graphRef}>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Project Weights</h2>
              <div className="aspect-w-16 aspect-h-16 border flex items-center justify-center rounded-lg overflow-hidden">
                <Graph data={graphData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
