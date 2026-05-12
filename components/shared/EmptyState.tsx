import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({
  title = "Sin resultados",
  description = "No encontramos nada por aquí.",
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <PackageSearch className="h-16 w-16 text-muted-foreground" />
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}
