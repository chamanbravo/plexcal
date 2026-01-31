import { useState } from "react";
import { Pagination } from "../../components/table/Pagination";
import Table, { type Column } from "../../components/table/Table";
import {
  useDeleteClassType,
  useGetClassTypes,
} from "../../hooks/queries/useCreateClass";
import { Trash2Icon } from "lucide-react";

interface ClassType {
  _id: string;
  name: string;
  description: string;
}

export default function ClassTypeTable() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isError } = useGetClassTypes({
    page,
    limit,
  });
  const { mutateAsync: deleteClass } = useDeleteClassType();

  const columns: Column<ClassType>[] = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "description",
      title: "Description",
      render: (row) => row.description || "-",
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="bg-red-500 text-white px-2 py-1 rounded hover:cursor-pointer"
            onClick={() => handleDelete(row._id)}
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
      <Table columns={columns} data={data?.data || []} keyField="_id" />
      <Pagination
        page={page}
        totalPages={data?.pagination?.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
