import Table, { type Column } from "../../components/table/Table";

interface ClassType {
  _id: string;
  name: string;
  description?: string;
  color?: string;
}

const columns: Column<ClassType>[] = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "description",
    title: "Description",
    render: (row) => row.description || "—",
  },
];

const classTypes = [
  {
    _id: "ct-1",
    name: "Yoga",
    description: "Mind and body wellness sessions",
    isActive: true,
  },
  {
    _id: "ct-2",
    name: "Pilates",
    description: "Core strength and flexibility training",
    isActive: true,
  },
  {
    _id: "ct-3",
    name: "Strength Training",
    description: "Muscle building and resistance workouts",
    isActive: true,
  },
  {
    _id: "ct-4",
    name: "HIIT",
    description: "High intensity interval training",
    isActive: true,
  },
  {
    _id: "ct-5",
    name: "Meditation",
    description: "Guided mindfulness and relaxation sessions",
    isActive: false,
  },
];

export default function ClassTypeTable() {
  return (
    <Table
      columns={columns}
      data={classTypes}
      keyField="_id"
      onRowClick={(row) => console.log(row)}
    />
  );
}
