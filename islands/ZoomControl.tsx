interface ZoomControlProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export default function ZoomControl({
  zoom,
  onZoomChange,
  minZoom = 1,
  maxZoom = 6,
}: ZoomControlProps) {
  return (
    <div className="flex items-center space-x-4">
      <p className="text-gray-700 font-medium">Zoom Level:</p>
      <div className="flex items-center border rounded-lg overflow-hidden">
        <button
          onClick={() => onZoomChange(Math.max(minZoom, zoom - 1))}
          disabled={zoom <= minZoom}
          className={`px-3 py-1 border-r ${
            zoom <= minZoom
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
          }`}
        >
          -
        </button>
        <span className="px-4 py-1">
          {zoom}x
        </span>
        <button
          onClick={() => onZoomChange(Math.min(maxZoom, zoom + 1))}
          disabled={zoom >= maxZoom}
          className={`px-3 py-1 border-l ${
            zoom >= maxZoom
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
}
