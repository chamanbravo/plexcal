import { Trash2Icon } from "lucide-react";
import Table, { type Column } from "../../components/table/Table";
import {
  useDeleteClassSchedule,
  useGetClassSchedules,
} from "../../hooks/queries/useCreateClass";

interface ClassSchedule {
  id: string;
  title: string;
  isRecurring: string;
  recurrenceType: string;
}

export default function ClassScheduleTable() {
  const { data, isLoading, isError } = useGetClassSchedules({
    page: 0,
    limit: 10,
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
      render: (row) => <span>{row.isRecurring ? "✅" : "❌"}</span>,
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
            className="bg-red-500 text-white px-2 py-1 rounded hover:cursor-pointer"
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
    <Table
      columns={columns}
      data={data?.data || []}
      keyField="id"
      onRowClick={(row) => console.log(row)}
    />
  );
}
