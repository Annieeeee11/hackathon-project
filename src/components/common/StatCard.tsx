import { StatCardProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, icon, iconColor = "text-primary" }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={cn("w-8 h-8", iconColor)}>{icon}</div>
      </div>
    </div>
  );
}

