export default function BookCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mt-4"></div>
      </div>
    </div>
  );
}
