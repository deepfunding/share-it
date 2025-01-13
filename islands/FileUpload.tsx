import { useState } from "preact/hooks";
import { TargetedEvent } from "preact/compat";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCSV = async (file: File) => {
    const text = await file.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    if (headers.length !== 2 || headers[0] !== "id" || headers[1] !== "pred") {
      throw new Error("CSV must have exactly two columns: 'id' and 'pred'.");
    }

    for (let i = 1; i < lines.length; i++) {
      const [idStr, predStr] = lines[i].split(",").map((v) => v.trim());
      const id = Number(idStr);
      const pred = Number(predStr);
      if (!Number.isInteger(id) || id < 0) {
        throw new Error(
          `Invalid id at line ${i + 1}: must be a non-negative integer.`,
        );
      }
      if (isNaN(pred) || pred < 0 || pred > 1) {
        throw new Error(
          `Invalid pred at line ${i + 1}: must be a float between 0 and 1.`,
        );
      }
    }
  };

  const handleFileChange = async (
    e: TargetedEvent<HTMLInputElement, Event>,
  ) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        await validateCSV(file);
        setError(null);
        onFileUpload(file);
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files[0];
    if (file && file.type === "text/csv") {
      try {
        await validateCSV(file);
        setError(null);
        onFileUpload(file);
      } catch (err) {
        setError((err as Error).message);
      }
    } else {
      setError("Only CSV files are allowed.");
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-center w-full ${
          isDragging ? "bg-gray-100" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV files only</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".csv"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
