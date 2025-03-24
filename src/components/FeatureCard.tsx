
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  className,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        'group p-6 rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md',
        'opacity-0 translate-y-4',
        'animate-slide-in',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
