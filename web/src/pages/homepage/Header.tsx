import { Plus } from "lucide-react";
import Button from "../../components/Button";

export function Header({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <Button onClick={onAction}>
        <Plus size={16} />
        {actionLabel}
      </Button>
    </div>
  );
}
