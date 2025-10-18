const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header Skeleton */}
        <div className="relative">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto md:mx-0 mb-2" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto md:mx-0 mb-6" />
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Skeleton */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6"></h2>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-full shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <div className="text-center mb-4 h-[100px] flex flex-col justify-center items-center">
                      <div className="bg-gray-300 dark:bg-gray-700 h-10 w-10 rounded-full mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="flex items-center gap-4">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
