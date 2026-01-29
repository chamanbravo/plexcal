import { Plus } from "lucide-react";
import Button from "../../components/Button";

export function ClassTypesSection({
  onAddClassType,
}: {
  onAddClassType: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={onAddClassType}>
          <Plus size={16} />
          Add Class Type
        </Button>
      </div>
      <div className="rounded-md border p-4 text-gray-600">WIP</div>
    </div>
  );
}
