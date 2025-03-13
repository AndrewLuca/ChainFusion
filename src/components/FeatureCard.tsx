import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: Props) {
  return (
    <div className="flex flex-col items-start p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-blue-800 transition-all duration-300">
      <div className="p-3 rounded-lg bg-blue-900/20 mb-4">
        <Icon className="h-6 w-6 text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}