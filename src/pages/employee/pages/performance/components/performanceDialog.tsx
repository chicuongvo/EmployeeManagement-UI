import { useState, useEffect } from "react";

interface AddPerformanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (month: number, year: number) => void;
}

export default function AddPerformanceDialog({ open, onOpenChange, onSubmit }: AddPerformanceDialogProps) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [formData, setFormData] = useState({
        month: "",
        year: ""
    });
    const [errors, setErrors] = useState({
        month: "",
        year: ""
    });

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setFormData({
                month: currentMonth.toString(),
                year: currentYear.toString()
            });
            setErrors({ month: "", year: "" });
        }
    }, [open, currentMonth, currentYear]);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onOpenChange(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onOpenChange]);

    const validateForm = () => {
        const newErrors = { month: "", year: "" };
        let isValid = true;

        // Validate month
        const monthNum = parseInt(formData.month);
        if (!formData.month || formData.month.trim() === "") {
            newErrors.month = "Vui lòng nhập tháng";
            isValid = false;
        } else if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            newErrors.month = "Tháng phải từ 1 đến 12";
            isValid = false;
        }

        // Validate year
        const yearNum = parseInt(formData.year);
        if (!formData.year || formData.year.trim() === "") {
            newErrors.year = "Vui lòng nhập năm";
            isValid = false;
        } else if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
            newErrors.year = "Năm phải từ 2000 đến 2100";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(parseInt(formData.month), parseInt(formData.year));
            onOpenChange(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onOpenChange(false);
        }
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, month: e.target.value });
        if (errors.month) {
            setErrors({ ...errors, month: "" });
        }
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, year: e.target.value });
        if (errors.year) {
            setErrors({ ...errors, year: "" });
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-[20px] w-full max-w-[480px] p-[32px] shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="mb-[28px]">
                    <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[#343c6a] text-[22px] mb-1">
                        Thêm phiếu đánh giá mới
                    </h2>
                    <p className="text-[#718ebf] text-[14px]">
                        Nhập tháng và năm để tạo phiếu đánh giá mới
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-[20px] mb-[32px]">
                        {/* Month Field */}
                        <div className="space-y-[8px]">
                            <label
                                htmlFor="month"
                                className="block font-['Inter:Medium',sans-serif] font-medium text-[#343c6a] text-[14px]"
                            >
                                Tháng <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="month"
                                    type="text"
                                    value={formData.month}
                                    onChange={handleMonthChange}
                                    placeholder="Nhập tháng (1-12)"
                                    className={`w-full h-[48px] px-[16px] pr-[40px] bg-white border ${
                                        errors.month ? "border-red-400" : "border-[#E0E0E0]"
                                    } rounded-[12px] font-['Inter:Regular',sans-serif] font-normal text-[#343c6a] text-[15px] outline-none focus:border-[#2d60ff] focus:ring-2 focus:ring-[#2d60ff]/20 transition-all`}
                                />
                                {formData.month && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, month: "" });
                                            setErrors({ ...errors, month: "" });
                                        }}
                                        className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#718ebf] hover:text-[#343c6a] transition-colors"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {errors.month && (
                                <p className="text-red-500 text-[12px] mt-1 flex items-center gap-1">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M7 4V7.5M7 10H7.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    {errors.month}
                                </p>
                            )}
                        </div>

                        {/* Year Field */}
                        <div className="space-y-[8px]">
                            <label
                                htmlFor="year"
                                className="block font-['Inter:Medium',sans-serif] font-medium text-[#343c6a] text-[14px]"
                            >
                                Năm <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="year"
                                    type="text"
                                    value={formData.year}
                                    onChange={handleYearChange}
                                    placeholder="Nhập năm (2000-2100)"
                                    className={`w-full h-[48px] px-[16px] pr-[40px] bg-white border ${
                                        errors.year ? "border-red-400" : "border-[#E0E0E0]"
                                    } rounded-[12px] font-['Inter:Regular',sans-serif] font-normal text-[#343c6a] text-[15px] outline-none focus:border-[#2d60ff] focus:ring-2 focus:ring-[#2d60ff]/20 transition-all`}
                                />
                                {formData.year && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, year: "" });
                                            setErrors({ ...errors, year: "" });
                                        }}
                                        className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#718ebf] hover:text-[#343c6a] transition-colors"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {errors.year && (
                                <p className="text-red-500 text-[12px] mt-1 flex items-center gap-1">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="currentColor" strokeWidth="1.5"/>
                                        <path d="M7 4V7.5M7 10H7.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    {errors.year}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-[12px] justify-end">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="h-[44px] px-[28px] rounded-[12px] border border-[#E0E0E0] font-['Inter:Medium',sans-serif] font-medium text-[#343c6a] text-[14px] hover:bg-[#F5F7FA] transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="h-[44px] px-[28px] rounded-[12px] bg-[#2d60ff] font-['Inter:Medium',sans-serif] font-medium text-white text-[14px] hover:bg-[#2350dd] transition-colors shadow-lg hover:shadow-xl"
                        >
                            Thêm báo cáo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
