import Loader from "./Loader";

type ModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  type?: "loading" | "error" | "success" | "info";
  onClose?: () => void;
};

export default function Modal({ open, title, message, type = "info", onClose }: ModalProps) {
  if (!open) return null;

  const color = type === "error" ? "red" : type === "success" ? "green" : "blue";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 text-gray-100 rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div className={`p-6 border-b border-gray-700 flex items-center gap-4`}>
          {type === "loading" ? (
            <Loader />
          ) : (
            <div className={`h-8 w-8 rounded-full bg-${color}-500/90 flex items-center justify-center text-white font-bold`}>{type === 'error' ? '!' : type === 'success' ? '✓' : 'i'}</div>
          )}
          <div>
            <div className="font-semibold text-lg">{title}</div>
            {message && <div className="text-sm text-gray-300 mt-1">{message}</div>}
          </div>
        </div>
        {type !== "loading" && (
          <div className="p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
