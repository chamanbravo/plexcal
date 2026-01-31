import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-end gap-2 mt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 border border-gray-400  rounded disabled:opacity-50 hover:cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>

      {totalPages > 0 ? (
        <span className="text-sm font-medium text-gray-600">
          Page {page} of {totalPages}
        </span>
      ) : null}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50 hover:cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
