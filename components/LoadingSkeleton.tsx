interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export default function LoadingSkeleton({
  width = "100%",
  height = "1rem",
  className = "",
}: LoadingSkeletonProps) {
  return (
    <div
      className={["animate-pulse bg-gray-200 rounded-md", className].join(" ")}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
