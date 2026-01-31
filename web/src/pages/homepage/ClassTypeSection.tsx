import { Plus } from "lucide-react";
import Button from "../../components/Button";
import ClassTypeTable from "./ClassTypeTable";
import { useState } from "react";
import ClassTypeModal from "./ClassTypeModal";

export function ClassTypesSection() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>
          <Plus size={16} />
          Add Class Type
        </Button>
      </div>

      <ClassTypeModal open={isOpen} onClose={() => setIsOpen(false)} />

      <ClassTypeTable />
    </div>
  );
}
