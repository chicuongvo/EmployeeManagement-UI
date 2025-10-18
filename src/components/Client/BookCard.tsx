/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { Star, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function BookCard({ book, showActions = true }: any) {
  const avaibility =
    book.bookItems?.reduce((acc: any, item: any) => {
      if (item.status === "AVAILABLE") {
        return acc + 1;
      }
      return acc;
    }, 0) || 0;
  console.log(book.bookItems, "@@");

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="relative">
        <div className="h-64 overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-120 transition-transform duration-3000"
          />
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
            {avaibility > 0 ? (
              <span className="text-green-600 dark:text-green-400">Có sẵn</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">Hết sách</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            bởi {book.author}
          </p>
        </div>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span>{book.avg_rating}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>
              {avaibility}/{book.bookItems?.length || 0} bản sao
            </span>
          </div>
        </div>

        <div className="mb-4">
          <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
            {book.catalog?.name || "Không có danh mục"}
          </span>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <motion.div
              whileHover={{
                scale: 1.06,
                y: -3,
                boxShadow: "0 4px 16px 0 rgba(80, 63, 205, 0.10)",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex-1"
            >
              <Link
                to={`/books/${book.id}`}
                className="block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300 text-center"
              >
                Xem chi tiết
              </Link>
            </motion.div>
            {book.availableCopies > 0 && (
              <button className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Clock className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
