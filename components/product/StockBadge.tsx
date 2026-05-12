import { Badge } from "@/components/ui/badge";

interface Props {
  stock: number;
}

export default function StockBadge({ stock }: Props) {
  if (stock === 0) {
    return (
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">
        Sin stock
      </Badge>
    );
  }
  if (stock <= 10) {
    return (
      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">
        Pocas unidades ({stock})
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
      En stock
    </Badge>
  );
}
