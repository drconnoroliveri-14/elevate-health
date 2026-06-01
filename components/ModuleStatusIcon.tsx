type ModuleStatus = "completed" | "unlocked" | "locked";

interface ModuleStatusIconProps {
  status: ModuleStatus;
  className?: string;
}

export default function ModuleStatusIcon({
  status,
  className = "w-4 h-4",
}: ModuleStatusIconProps) {
  if (status === "completed") {
    return (
      <svg className={`${className} text-green-500 flex-shrink-0`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-label="Completed">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    );
  }
  if (status === "unlocked") {
    return (
      <svg className={`${className} text-teal-500 flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24" aria-label="Unlocked — ready to watch">
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  }
  return (
    <svg className={`${className} text-gray-400 flex-shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-label="Locked">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
