import { Check, Trash2Icon, X } from "lucide-react";
import Table, { type Column } from "../../components/table/Table";
import {
  useDeleteClassSchedule,
  useGetClassSchedules,
} from "../../hooks/queries";
import { Pagination } from "../../components/table/Pagination";
import { useState } from "react";

interface ClassSchedule {
  id: string;
  title: string;
  isRecurring: string;
  recurrenceType: string;
}

export default function ClassScheduleTable() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isError } = useGetClassSchedules({
    page,
    limit,
  });
  const { mutateAsync: deleteClass } = useDeleteClassSchedule();

  const columns: Column<ClassSchedule>[] = [
    {
      key: "title",
      title: "Title",
    },
    {
      key: "isRecurring",
      title: "Is Recurring",
      render: (row) => (
        <span>
          {row.isRecurring ? (
            <span className="text-green-600">
              <Check size={16} />
            </span>
          ) : (
            <span className="text-red-600">
              <X size={16} />
            </span>
          )}
        </span>
      ),
    },
    {
      key: "recurrenceType",
      title: "Recurrence Type",
      render: (row) => (
        <span>
          {!row.isRecurring
            ? "One-Time Event"
            : row.recurrenceType?.toUpperCase()}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="px-2 py-1 rounded hover:cursor-pointer text-red-400"
            onClick={() => handleDelete(row.id)}
          >
            <Trash2Icon size={18} />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await deleteClass(id);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div>
      <Table columns={columns} data={data?.data || []} keyField="id" />
      <Pagination
        page={page}
        totalPages={data?.pagination?.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
