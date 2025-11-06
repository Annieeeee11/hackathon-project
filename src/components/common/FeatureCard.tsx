import { Feature } from "@/lib/types";

export function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="p-6 bg-card rounded-lg border hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

