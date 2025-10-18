export default function BookDetailSkeleton() {
  return (
    <div className="space-y-8 max-w-screen-xl animate-pulse">
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />

      {/* Book Header Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex gap-4">
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Review Section Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-start space-x-4 border-b border-gray-200 dark:border-gray-700 pb-6"
            >
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
