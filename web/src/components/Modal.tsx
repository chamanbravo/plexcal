import { X } from "lucide-react";
import { type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-lg overflow-x-auto">
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-[1rem] font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md transition-all hover:bg-gray-200 hover:text-black hover:cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
