/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { type ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  keyField,
  onRowClick,
  emptyMessage = "No data found",
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                style={{ width: col.width }}
                className={clsx(
                  "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase",
                  col.className,
                )}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {data.map((row, index) => {
            const rowKey =
              keyField && row[keyField]
                ? String(row[keyField])
                : index.toString();

            return (
              <tr
                key={rowKey}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  "border-b border-gray-100",
                  onRowClick && "cursor-pointer hover:bg-gray-50",
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={clsx(
                      "px-4 py-3 text-sm text-gray-700",
                      col.className,
                    )}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
