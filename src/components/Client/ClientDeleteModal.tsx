import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ClientDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function ClientDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: ClientDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-[90%] max-w-md space-y-4"
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-red-600 dark:text-red-400"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Trash2 className="w-6 h-6" />
            </motion.div>
            <h3 className="text-lg font-bold">Xác nhận xoá</h3>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 dark:text-gray-300"
          >
            Bạn có chắc chắn muốn thực hiện hành động này? Hành động này không
            thể hoàn tác.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer transition-colors"
            >
              Huỷ
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onConfirm();
              }}
              disabled={isPending}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                isPending
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 cursor-pointer"
              }`}
            >
              {isPending ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  ⏳
                </motion.span>
              ) : (
                "Xoá"
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
