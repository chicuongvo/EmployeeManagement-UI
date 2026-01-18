export interface UserResponse {
  id: number;
  employeeCode: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  department?: {
    id: number;
    name: string;
    departmentCode: string;
  };
  position?: {
    id: number;
    name: string;
  };
}

