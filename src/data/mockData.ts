export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publicationYear: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverUrl: string;
}

export interface BookItem {
  id: string;
  bookId: string;
  barcode: string;
  status: "Available" | "Borrowed" | "Lost" | "Damaged" | "Reserved";
  location: string;
  acquiredDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipDate: string;
  status: "Active" | "Suspended" | "Expired";
  xp: number;
  level: number;
  totalBorrows: number;
}

export interface Borrow {
  id: string;
  userId: string;
  bookItemId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: "Active" | "Returned" | "Overdue" | "Lost";
  fineAmount: number;
  userName: string;
  bookTitle: string;
}

export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  reservationDate: string;
  status: "Pending" | "Ready" | "Completed" | "Cancelled";
  expiryDate: string;
  userName: string;
  bookTitle: string;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  reviewDate: string;
  userName: string;
  bookTitle: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  xpReward: number;
  startDate: string;
  endDate: string;
  type: "Books Read" | "Reading Time" | "Categories Explored";
  status: "Active" | "Completed" | "Expired";
  participants: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpRequired: number;
  category: "Reading" | "Community" | "Achievement";
  earnedBy: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "Info" | "Warning" | "Error" | "Success";
  isRead: boolean;
  createdAt: string;
  userName?: string;
}

// Mock data
export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    category: "Fiction",
    publicationYear: 1925,
    totalCopies: 5,
    availableCopies: 2,
    description: "A classic American novel set in the Jazz Age.",
    coverUrl:
      "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    category: "Fiction",
    publicationYear: 1960,
    totalCopies: 3,
    availableCopies: 1,
    description: "A gripping tale of racial injustice and childhood innocence.",
    coverUrl:
      "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg",
  },
  {
    id: "3",
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    isbn: "978-0-596-51774-8",
    category: "Technology",
    publicationYear: 2008,
    totalCopies: 4,
    availableCopies: 4,
    description: "Essential insights into JavaScript programming.",
    coverUrl:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1-555-0123",
    membershipDate: "2023-01-15",
    status: "Active",
    xp: 1250,
    level: 5,
    totalBorrows: 23,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "+1-555-0124",
    membershipDate: "2023-03-22",
    status: "Active",
    xp: 890,
    level: 3,
    totalBorrows: 12,
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    phone: "+1-555-0125",
    membershipDate: "2022-11-08",
    status: "Suspended",
    xp: 2150,
    level: 8,
    totalBorrows: 45,
  },
];

export const mockBorrows: Borrow[] = [
  {
    id: "1",
    userId: "1",
    bookItemId: "1-1",
    borrowDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "Overdue",
    fineAmount: 15.5,
    userName: "Alice Johnson",
    bookTitle: "The Great Gatsby",
  },
  {
    id: "2",
    userId: "2",
    bookItemId: "2-1",
    borrowDate: "2024-01-20",
    dueDate: "2024-02-20",
    status: "Active",
    fineAmount: 0,
    userName: "Bob Smith",
    bookTitle: "To Kill a Mockingbird",
  },
];

export const mockReservations: Reservation[] = [
  {
    id: "1",
    userId: "3",
    bookId: "1",
    reservationDate: "2024-01-25",
    status: "Pending",
    expiryDate: "2024-02-25",
    userName: "Carol Williams",
    bookTitle: "The Great Gatsby",
  },
];

export const mockReviews: Review[] = [
  {
    id: "1",
    userId: "1",
    bookId: "1",
    rating: 5,
    comment: "Absolutely fantastic! A must-read classic.",
    reviewDate: "2024-01-10",
    userName: "Alice Johnson",
    bookTitle: "The Great Gatsby",
  },
  {
    id: "2",
    userId: "2",
    bookId: "2",
    rating: 4,
    comment: "Powerful and moving story. Highly recommend.",
    reviewDate: "2024-01-12",
    userName: "Bob Smith",
    bookTitle: "To Kill a Mockingbird",
  },
];

export const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Read 5 Books This Month",
    description: "Challenge yourself to read 5 books in January",
    targetValue: 5,
    xpReward: 500,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    type: "Books Read",
    status: "Active",
    participants: 45,
  },
  {
    id: "2",
    title: "Explore 3 New Categories",
    description: "Read books from 3 different categories you haven't explored",
    targetValue: 3,
    xpReward: 300,
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    type: "Categories Explored",
    status: "Active",
    participants: 23,
  },
];

export const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Bookworm",
    description: "Read 10 books",
    icon: "📚",
    xpRequired: 1000,
    category: "Reading",
    earnedBy: 12,
  },
  {
    id: "2",
    name: "Speed Reader",
    description: "Read 5 books in one month",
    icon: "⚡",
    xpRequired: 500,
    category: "Achievement",
    earnedBy: 8,
  },
  {
    id: "3",
    name: "Reviewer",
    description: "Write 10 book reviews",
    icon: "⭐",
    xpRequired: 300,
    category: "Community",
    earnedBy: 15,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    title: "Book Overdue",
    message:
      'Your copy of "The Great Gatsby" is overdue. Please return it as soon as possible.',
    type: "Warning",
    isRead: false,
    createdAt: "2024-01-25T10:30:00Z",
    userName: "Alice Johnson",
  },
  {
    id: "2",
    userId: "2",
    title: "New Challenge Available",
    message:
      'A new reading challenge "Explore 3 New Categories" is now available!',
    type: "Info",
    isRead: true,
    createdAt: "2024-01-24T15:45:00Z",
    userName: "Bob Smith",
  },
  {
    id: "3",
    userId: "3",
    title: "Account Suspended",
    message:
      "Your account has been suspended due to multiple overdue books. Please contact support.",
    type: "Error",
    isRead: false,
    createdAt: "2024-01-23T09:15:00Z",
    userName: "Carol Williams",
  },
];

// Dashboard stats
export const dashboardStats = {
  totalBooks: 847,
  totalUsers: 1234,
  activeBorrows: 89,
  overdueBooks: 12,
  monthlyBorrows: [
    { month: "Jan", borrows: 120 },
    { month: "Feb", borrows: 98 },
    { month: "Mar", borrows: 145 },
    { month: "Apr", borrows: 132 },
    { month: "May", borrows: 156 },
    { month: "Jun", borrows: 134 },
  ],
  categoryDistribution: [
    { name: "Fiction", value: 35, color: "#4F46E5" },
    { name: "Technology", value: 25, color: "#059669" },
    { name: "Science", value: 20, color: "#D97706" },
    { name: "History", value: 15, color: "#DC2626" },
    { name: "Other", value: 5, color: "#6B7280" },
  ],
};

// Update Request Mock Data
export interface UpdateRequestMock {
  id: number;
  content: string;
  status: "PENDING" | "APPROVED" | "NOT_APPROVED";
  requestedById: number;
  reviewedById?: number | null;
  createdAt?: string;
  updatedAt?: string;
  requestedBy?: {
    id: number;
    fullName: string;
    email: string;
  };
  reviewedBy?: {
    id: number;
    fullName: string;
    email: string;
  } | null;
}

export const mockUpdateRequests: UpdateRequestMock[] = [
  {
    id: 1,
    content: "Xin phép được thay đổi email từ nguyenvana@company.com sang nguyenvana.new@company.com vì lý do bảo mật. Email cũ đã bị lộ thông tin và tôi muốn đổi sang email mới để đảm bảo an toàn.",
    status: "PENDING",
    requestedById: 1,
    reviewedById: null,
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-15T08:30:00Z",
    requestedBy: {
      id: 1,
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@company.com",
    },
    reviewedBy: null,
  },
  {
    id: 2,
    content: "Tôi muốn cập nhật số điện thoại từ 0901234567 sang 0909876543. Số điện thoại cũ đã không còn sử dụng nữa.",
    status: "PENDING",
    requestedById: 2,
    reviewedById: 5,
    createdAt: "2024-01-14T10:15:00Z",
    updatedAt: "2024-01-16T09:20:00Z",
    requestedBy: {
      id: 2,
      fullName: "Trần Thị B",
      email: "tranthib@company.com",
    },
    reviewedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 3,
    content: "Yêu cầu thay đổi địa chỉ từ '123 Đường ABC, Quận 1, TP.HCM' sang '456 Đường XYZ, Quận 3, TP.HCM' do đã chuyển nhà.",
    status: "APPROVED",
    requestedById: 3,
    reviewedById: 5,
    createdAt: "2024-01-10T14:00:00Z",
    updatedAt: "2024-01-12T16:30:00Z",
    requestedBy: {
      id: 3,
      fullName: "Phạm Văn D",
      email: "phamvand@company.com",
    },
    reviewedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 4,
    content: "Xin được cập nhật thông tin trình độ học vấn từ 'Đại học' lên 'Thạc sĩ' vì tôi đã hoàn thành chương trình thạc sĩ vào tháng 12/2023.",
    status: "NOT_APPROVED",
    requestedById: 4,
    reviewedById: 5,
    createdAt: "2024-01-08T11:45:00Z",
    updatedAt: "2024-01-11T10:00:00Z",
    requestedBy: {
      id: 4,
      fullName: "Hoàng Thị E",
      email: "hoangthie@company.com",
    },
    reviewedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 5,
    content: "Yêu cầu thay đổi phòng ban từ 'Phòng Kỹ thuật' sang 'Phòng Kinh doanh' theo yêu cầu điều chuyển công tác.",
    status: "PENDING",
    requestedById: 6,
    reviewedById: null,
    createdAt: "2024-01-17T09:00:00Z",
    updatedAt: "2024-01-17T09:00:00Z",
    requestedBy: {
      id: 6,
      fullName: "Võ Văn F",
      email: "vovanf@company.com",
    },
    reviewedBy: null,
  },
  {
    id: 6,
    content: "Xin phép cập nhật thông tin ngân hàng: số tài khoản từ 1234567890 sang 9876543210, ngân hàng từ 'Vietcombank' sang 'BIDV'.",
    status: "PENDING",
    requestedById: 7,
    reviewedById: 5,
    createdAt: "2024-01-16T13:20:00Z",
    updatedAt: "2024-01-17T14:15:00Z",
    requestedBy: {
      id: 7,
      fullName: "Đặng Thị G",
      email: "dangthig@company.com",
    },
    reviewedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 7,
    content: "Tôi muốn thay đổi chức vụ từ 'Nhân viên' sang 'Trưởng nhóm' sau khi được thăng chức vào tháng 1/2024.",
    status: "APPROVED",
    requestedById: 8,
    reviewedById: 5,
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-07T15:45:00Z",
    requestedBy: {
      id: 8,
      fullName: "Bùi Văn H",
      email: "buivanh@company.com",
    },
    reviewedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 8,
    content: "Yêu cầu cập nhật thông tin hợp đồng: thay đổi mức lương từ 15,000,000 VNĐ lên 18,000,000 VNĐ theo thỏa thuận mới.",
    status: "PENDING",
    requestedById: 9,
    reviewedById: null,
    createdAt: "2024-01-18T10:30:00Z",
    updatedAt: "2024-01-18T10:30:00Z",
    requestedBy: {
      id: 9,
      fullName: "Ngô Thị I",
      email: "ngothii@company.com",
    },
    reviewedBy: null,
  },
];

// Contract Mock Data
export interface ContractMock {
  id: number;
  contractCode: string;
  type: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "PROBATION" | "TEMPORARY" | "FREELANCE" | "OUTSOURCE";
  startDate: string;
  endDate: string;
  signedDate: string;
  status: "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED" | "PENDING" | "RENEWED";
  dailySalary: number;
  allowance: number;
  note?: string | null;
  attachment?: string | null;
  createdAt: string;
  signedById: number;
  employeeId: number;
  employee?: {
    id: number;
    fullName: string;
    email: string;
  };
  signedBy?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export const mockContracts: ContractMock[] = [
  {
    id: 1,
    contractCode: "CT001",
    type: "FULL_TIME",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    signedDate: "2023-12-15T00:00:00Z",
    status: "ACTIVE",
    dailySalary: 500000,
    allowance: 1000000,
    note: "Hợp đồng lao động chính thức, thời hạn 1 năm",
    attachment: "https://res.cloudinary.com/demo/image/upload/v1234567890/contracts/ct001.pdf",
    createdAt: "2023-12-15T08:00:00Z",
    signedById: 5,
    employeeId: 1,
    employee: {
      id: 1,
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 2,
    contractCode: "CT002",
    type: "PART_TIME",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2024-08-01T23:59:59Z",
    signedDate: "2024-01-20T00:00:00Z",
    status: "ACTIVE",
    dailySalary: 300000,
    allowance: 500000,
    note: "Hợp đồng bán thời gian, làm việc 4 giờ/ngày",
    attachment: null,
    createdAt: "2024-01-20T09:30:00Z",
    signedById: 5,
    employeeId: 2,
    employee: {
      id: 2,
      fullName: "Trần Thị B",
      email: "tranthib@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 3,
    contractCode: "CT003",
    type: "INTERNSHIP",
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-06-01T23:59:59Z",
    signedDate: "2024-02-25T00:00:00Z",
    status: "ACTIVE",
    dailySalary: 200000,
    allowance: 300000,
    note: "Hợp đồng thực tập sinh, thời hạn 3 tháng",
    attachment: "https://res.cloudinary.com/demo/image/upload/v1234567890/contracts/ct003.jpg",
    createdAt: "2024-02-25T10:15:00Z",
    signedById: 5,
    employeeId: 3,
    employee: {
      id: 3,
      fullName: "Phạm Văn D",
      email: "phamvand@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 4,
    contractCode: "CT004",
    type: "FULL_TIME",
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    signedDate: "2023-05-20T00:00:00Z",
    status: "EXPIRED",
    dailySalary: 450000,
    allowance: 800000,
    note: "Hợp đồng đã hết hạn, cần gia hạn",
    attachment: null,
    createdAt: "2023-05-20T14:00:00Z",
    signedById: 5,
    employeeId: 4,
    employee: {
      id: 4,
      fullName: "Hoàng Thị E",
      email: "hoangthie@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 5,
    contractCode: "CT005",
    type: "PROBATION",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-04-15T23:59:59Z",
    signedDate: "2024-01-10T00:00:00Z",
    status: "ACTIVE",
    dailySalary: 400000,
    allowance: 600000,
    note: "Hợp đồng thử việc, thời hạn 3 tháng",
    attachment: "https://res.cloudinary.com/demo/image/upload/v1234567890/contracts/ct005.pdf",
    createdAt: "2024-01-10T11:20:00Z",
    signedById: 5,
    employeeId: 6,
    employee: {
      id: 6,
      fullName: "Võ Văn F",
      email: "vovanf@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 6,
    contractCode: "CT006",
    type: "FULL_TIME",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2025-01-31T23:59:59Z",
    signedDate: "2024-01-25T00:00:00Z",
    status: "PENDING",
    dailySalary: 550000,
    allowance: 1200000,
    note: "Hợp đồng đang chờ duyệt",
    attachment: null,
    createdAt: "2024-01-25T13:45:00Z",
    signedById: 5,
    employeeId: 7,
    employee: {
      id: 7,
      fullName: "Đặng Thị G",
      email: "dangthig@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 7,
    contractCode: "CT007",
    type: "FREELANCE",
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-05-31T23:59:59Z",
    signedDate: "2024-02-28T00:00:00Z",
    status: "ACTIVE",
    dailySalary: 600000,
    allowance: 0,
    note: "Hợp đồng freelance, làm việc theo dự án",
    attachment: "https://res.cloudinary.com/demo/image/upload/v1234567890/contracts/ct007.pdf",
    createdAt: "2024-02-28T15:30:00Z",
    signedById: 5,
    employeeId: 8,
    employee: {
      id: 8,
      fullName: "Bùi Văn H",
      email: "buivanh@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 8,
    contractCode: "CT008",
    type: "FULL_TIME",
    startDate: "2023-01-01T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    signedDate: "2022-12-20T00:00:00Z",
    status: "RENEWED",
    dailySalary: 480000,
    allowance: 900000,
    note: "Hợp đồng đã được gia hạn",
    attachment: null,
    createdAt: "2022-12-20T10:00:00Z",
    signedById: 5,
    employeeId: 9,
    employee: {
      id: 9,
      fullName: "Ngô Thị I",
      email: "ngothii@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 9,
    contractCode: "CT009",
    type: "TEMPORARY",
    startDate: "2024-04-01T00:00:00Z",
    endDate: "2024-07-01T23:59:59Z",
    signedDate: "2024-03-25T00:00:00Z",
    status: "DRAFT",
    dailySalary: 350000,
    allowance: 400000,
    note: "Hợp đồng tạm thời, đang soạn thảo",
    attachment: null,
    createdAt: "2024-03-25T09:00:00Z",
    signedById: 5,
    employeeId: 10,
    employee: {
      id: 10,
      fullName: "Lý Văn K",
      email: "lyvank@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
  {
    id: 10,
    contractCode: "CT010",
    type: "OUTSOURCE",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z",
    signedDate: "2023-12-28T00:00:00Z",
    status: "TERMINATED",
    dailySalary: 700000,
    allowance: 1500000,
    note: "Hợp đồng đã bị chấm dứt trước thời hạn",
    attachment: "https://res.cloudinary.com/demo/image/upload/v1234567890/contracts/ct010.pdf",
    createdAt: "2023-12-28T16:20:00Z",
    signedById: 5,
    employeeId: 11,
    employee: {
      id: 11,
      fullName: "Trương Thị L",
      email: "truongthil@company.com",
    },
    signedBy: {
      id: 5,
      fullName: "Lê Văn C",
      email: "levanc@company.com",
    },
  },
];