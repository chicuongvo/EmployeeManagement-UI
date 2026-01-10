import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Plus,
  Pencil,
  Eye,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useContract } from "@/hooks/useContract";
import { ContractProvider } from "@/contexts/contract/contractContext.tsx";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { ContractForm } from "@/components/contract/ContractForm";
import type {
  ContractResponse,
  ContractType,
  ContractStatus,
  CreateContractRequest,
  UpdateContractRequest,
} from "@/types/Contract";
import {
  deleteContract,
  createContract,
  updateContract,
} from "@/services/contract";
import { toast } from "react-toastify";

const ContractTableContent = () => {
  const { contracts, isLoading, refreshContracts } = useContract();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedContract, setSelectedContract] =
    React.useState<ContractResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const getStatusBadge = (status: ContractStatus) => {
    const statusConfig = {
      DRAFT: {
        label: "Nháp",
        icon: FileText,
        className: "bg-gray-100 text-gray-800",
      },
      PENDING: {
        label: "Chờ duyệt",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800",
      },
      ACTIVE: {
        label: "Đang hoạt động",
        icon: CheckCircle2,
        className: "bg-green-100 text-green-800",
      },
      EXPIRED: {
        label: "Hết hạn",
        icon: XCircle,
        className: "bg-red-100 text-red-800",
      },
      TERMINATED: {
        label: "Chấm dứt",
        icon: AlertCircle,
        className: "bg-orange-100 text-orange-800",
      },
      RENEWED: {
        label: "Gia hạn",
        icon: CheckCircle2,
        className: "bg-blue-100 text-blue-800",
      },
    };
    return statusConfig[status] || statusConfig.DRAFT;
  };

  const getTypeLabel = (type: ContractType) => {
    const typeMap = {
      FULL_TIME: "Toàn thời gian",
      PART_TIME: "Bán thời gian",
      INTERNSHIP: "Thực tập",
      PROBATION: "Thử việc",
      TEMPORARY: "Tạm thời",
      FREELANCE: "Freelance",
      OUTSOURCE: "Outsource",
    };
    return typeMap[type] || type;
  };

  const handleCreate = async (
    data: CreateContractRequest | UpdateContractRequest | FormData
  ) => {
    setIsSubmitting(true);
    try {
      await createContract(data as CreateContractRequest | FormData);
      toast.success("Tạo hợp đồng thành công");
      setIsCreateDialogOpen(false);
      refreshContracts();
    } catch (error) {
      toast.error("Tạo hợp đồng thất bại");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (
    data: CreateContractRequest | UpdateContractRequest | FormData
  ) => {
    if (!selectedContract) return;
    setIsSubmitting(true);
    try {
      await updateContract(
        selectedContract.id,
        data as UpdateContractRequest | FormData
      );
      toast.success("Cập nhật hợp đồng thành công");
      setIsEditDialogOpen(false);
      setSelectedContract(null);
      refreshContracts();
    } catch (error) {
      toast.error("Cập nhật hợp đồng thất bại");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedContract) return;
    setIsSubmitting(true);
    try {
      await deleteContract(selectedContract.id);
      toast.success("Xóa hợp đồng thành công");
      setIsDeleteDialogOpen(false);
      setSelectedContract(null);
      refreshContracts();
    } catch (error) {
      toast.error("Xóa hợp đồng thất bại");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewDialog = (contract: ContractResponse) => {
    setSelectedContract(contract);
    setIsViewDialogOpen(true);
  };

  const openEditDialog = (contract: ContractResponse) => {
    setSelectedContract(contract);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (contract: ContractResponse) => {
    setSelectedContract(contract);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnDef<ContractResponse>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "contractCode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã hợp đồng" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("contractCode")}</span>
        </div>
      ),
    },
    {
      accessorKey: "employee",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nhân viên" />
      ),
      cell: ({ row }) => {
        const employee = row.original.employee;
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              {employee ? (
                <>
                  <div className="font-medium">{employee.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {employee.email}
                  </div>
                </>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Loại" />
      ),
      cell: ({ row }) => {
        const type = row.getValue("type") as ContractType;
        return <span>{getTypeLabel(type)}</span>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as ContractStatus;
        const config = getStatusBadge(status);
        const Icon = config.icon;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày bắt đầu" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("startDate") as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày kết thúc" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("endDate") as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "dailySalary",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lương ngày" />
      ),
      cell: ({ row }) => {
        const salary = row.getValue("dailySalary") as number;
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{salary.toLocaleString("vi-VN")} VNĐ</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Thao tác",
      enableHiding: false,
      cell: ({ row }) => {
        const contract = row.original;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => openViewDialog(contract)}
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => openEditDialog(contract)}
              title="Chỉnh sửa"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => openDeleteDialog(contract)}
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: contracts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    if (statusFilter !== "all") {
      table.getColumn("status")?.setFilterValue(statusFilter);
    } else {
      table.getColumn("status")?.setFilterValue(undefined);
    }
  }, [statusFilter, table]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hợp đồng</h2>
          <p className="text-muted-foreground">Quản lý các hợp đồng lao động</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo hợp đồng mới
        </Button>
      </div>
      <div className="flex items-center py-4 gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="DRAFT">Nháp</SelectItem>
            <SelectItem value="PENDING">Chờ duyệt</SelectItem>
            <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
            <SelectItem value="EXPIRED">Hết hạn</SelectItem>
            <SelectItem value="TERMINATED">Chấm dứt</SelectItem>
            <SelectItem value="RENEWED">Gia hạn</SelectItem>
          </SelectContent>
        </Select>
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo hợp đồng mới</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo hợp đồng lao động mới
            </DialogDescription>
          </DialogHeader>
          <ContractForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isSubmitting}
            mode="create"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hợp đồng</DialogTitle>
            <DialogDescription>Cập nhật thông tin hợp đồng</DialogDescription>
          </DialogHeader>
          <ContractForm
            initialData={selectedContract}
            onSubmit={handleEdit}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedContract(null);
            }}
            isLoading={isSubmitting}
            mode="edit"
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết hợp đồng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về hợp đồng
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Mã hợp đồng
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedContract.contractCode}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Trạng thái
                  </Label>
                  <p className="text-sm mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusBadge(selectedContract.status).className
                      }`}
                    >
                      {getStatusBadge(selectedContract.status).label}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nhân viên
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedContract.employee?.fullName || "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedContract.employee?.email || ""}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Loại hợp đồng</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getTypeLabel(selectedContract.type)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ngày bắt đầu
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedContract.startDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ngày kết thúc
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedContract.endDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ngày ký
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedContract.signedDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Lương ngày
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedContract.dailySalary.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Phụ cấp
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedContract.allowance.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>
              {selectedContract.note && (
                <div>
                  <Label className="text-sm font-semibold">Ghi chú</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedContract.note}
                  </p>
                </div>
              )}
              {selectedContract.attachment && (
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    File đính kèm
                  </Label>
                  <div className="mt-2">
                    <a
                      href={selectedContract.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Xem file đính kèm
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewDialogOpen(false);
                setSelectedContract(null);
              }}
            >
              Đóng
            </Button>
            {selectedContract && (
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false);
                  openEditDialog(selectedContract);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="py-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Mã hợp đồng:</strong> {selectedContract.contractCode}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Nhân viên:</strong>{" "}
                {selectedContract.employee?.fullName || "-"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedContract(null);
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function Contract() {
  return (
    <ContractProvider>
      <ContractTableContent />
    </ContractProvider>
  );
}
