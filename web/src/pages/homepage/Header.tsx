import { Plus } from "lucide-react";
import Button from "../../components/Button";
import ScheduleClassModal from "./ScheduleClassModal";
import { useState } from "react";

export function Header({
  title,
  subtitle,
  actionLabel,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
}) {
  const [modal, setModal] = useState<boolean>(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        <Button onClick={() => setModal(true)}>
          <Plus size={16} />
          {actionLabel}
        </Button>
      </div>

      <ScheduleClassModal open={modal} onClose={() => setModal(false)} />
    </>
  );
}
