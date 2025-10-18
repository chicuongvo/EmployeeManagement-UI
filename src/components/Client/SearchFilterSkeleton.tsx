export default function SearchFilterSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="w-40 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
      <div className="hidden md:block border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
