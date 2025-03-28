
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface AvatarDisplayProps {
  photoUrl: string | null;
  size?: "sm" | "md" | "lg";
}

const AvatarDisplay = ({ photoUrl, size = "lg" }: AvatarDisplayProps) => {
  const sizeClass = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  }[size];

  const iconSize = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }[size];
  
  return (
    <Avatar className={`${sizeClass} border`}>
      {photoUrl ? (
        <AvatarImage src={photoUrl} alt="Profile" />
      ) : null}
      <AvatarFallback className="bg-muted text-muted-foreground">
        <UserRound className={iconSize} />
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarDisplay;
