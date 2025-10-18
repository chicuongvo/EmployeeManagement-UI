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
