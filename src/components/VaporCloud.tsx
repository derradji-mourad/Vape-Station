interface VaporCloudProps {
  delay?: number;
  size?: "small" | "medium" | "large";
  className?: string;
}

const VaporCloud = ({ delay = 0, size = "medium", className = "" }: VaporCloudProps) => {
  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
  };

  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-30 ${sizeClasses[size]} ${className}`}
      style={{
        background: "radial-gradient(circle, hsl(var(--vapor-start)) 0%, hsl(var(--vapor-end)) 50%, transparent 100%)",
        animation: `vapor-rise 4s ease-out infinite ${delay}s`,
      }}
    />
  );
};

export default VaporCloud;
