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
  Eye,
  Trash2,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { useUpdateRequest } from "@/hooks/useUpdateRequest";
import { UpdateRequestProvider } from "@/contexts/update-request/updateRequestContext.tsx";
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
import type {
  UpdateRequestResponse,
  RequestStatus,
} from "@/types/UpdateRequest";
import { deleteUpdateRequest, reviewRequest } from "@/services/update-request";
import { toast } from "react-toastify";

const UpdateRequestTableContent = () => {
  const { updateRequests, isLoading, refreshUpdateRequests } =
    useUpdateRequest();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] =
    React.useState<UpdateRequestResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      await deleteUpdateRequest(selectedRequest.id);
      toast.success("Xóa yêu cầu thành công");
      setIsDeleteDialogOpen(false);
      setSelectedRequest(null);
      refreshUpdateRequests();
    } catch (error) {
      toast.error("Xóa yêu cầu thất bại");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewDialog = (request: UpdateRequestResponse) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (request: UpdateRequestResponse) => {
    setSelectedRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const handleReview = async (
    id: number,
    status: "APPROVED" | "NOT_APPROVED"
  ) => {
    try {
      // Backend sẽ tự động gán người phê duyệt từ token
      await reviewRequest(id, { status });
      toast.success(
        `Yêu cầu đã được ${status === "APPROVED" ? "phê duyệt" : "từ chối"}`
      );
      refreshUpdateRequests();
    } catch (error) {
      toast.error("Xử lý yêu cầu thất bại");
      console.error(error);
    }
  };

  const columns: ColumnDef<UpdateRequestResponse>[] = [
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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <div className="w-[80px] flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("id")}</span>
        </div>
      ),
    },
    {
      accessorKey: "requestedBy",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Người yêu cầu" />
      ),
      cell: ({ row }) => {
        const requestedBy = row.original.requestedBy;
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              {requestedBy ? (
                <>
                  <div className="font-medium">{requestedBy.fullName}</div>
                  <div className="text-sm text-muted-foreground">
                    {requestedBy.email}
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
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as RequestStatus;
        const statusConfig = {
          PENDING: {
            label: "Chờ xử lý",
            icon: Clock,
            className: "bg-yellow-100 text-yellow-800",
          },
          APPROVED: {
            label: "Đã phê duyệt",
            icon: CheckCircle2,
            className: "bg-green-100 text-green-800",
          },
          NOT_APPROVED: {
            label: "Không phê duyệt",
            icon: XCircle,
            className: "bg-red-100 text-red-800",
          },
        };
        const config = statusConfig[status] || statusConfig.PENDING;
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
      id: "actions",
      header: "Thao tác",
      enableHiding: false,
      cell: ({ row }) => {
        const request = row.original;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => openViewDialog(request)}
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => openDeleteDialog(request)}
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
    data: updateRequests,
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
          <h2 className="text-3xl font-bold tracking-tight">
            Yêu cầu cập nhật
          </h2>
          <p className="text-muted-foreground">
            Quản lý các yêu cầu cập nhật thông tin
          </p>
        </div>
      </div>
      <div className="flex items-center py-4 gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="PENDING">Chờ xử lý</SelectItem>
            <SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
            <SelectItem value="NOT_APPROVED">Không phê duyệt</SelectItem>
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu cập nhật</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu cập nhật
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ID
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRequest.id}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Trạng thái
                  </Label>
                  <p className="text-sm mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedRequest.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedRequest.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedRequest.status === "PENDING" ? (
                        <Clock className="h-3.5 w-3.5" />
                      ) : selectedRequest.status === "APPROVED" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {selectedRequest.status === "PENDING"
                        ? "Chờ xử lý"
                        : selectedRequest.status === "APPROVED"
                        ? "Đã phê duyệt"
                        : "Không phê duyệt"}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Nội dung đơn xin
                </Label>
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedRequest.content}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Người yêu cầu
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRequest.requestedBy?.fullName || "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRequest.requestedBy?.email || ""}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Người xem xét
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRequest.reviewedBy?.fullName || "Chưa gán"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRequest.reviewedBy?.email || ""}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewDialogOpen(false);
                setSelectedRequest(null);
              }}
            >
              Đóng
            </Button>
            {selectedRequest?.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReview(selectedRequest.id, "NOT_APPROVED");
                    setIsViewDialogOpen(false);
                    setSelectedRequest(null);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Từ chối
                </Button>
                <Button
                  onClick={() => {
                    handleReview(selectedRequest.id, "APPROVED");
                    setIsViewDialogOpen(false);
                    setSelectedRequest(null);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Phê duyệt
                </Button>
              </>
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
              Bạn có chắc chắn muốn xóa yêu cầu cập nhật này? Hành động này
              không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                <strong>ID:</strong> {selectedRequest.id}
              </p>
              <div>
                <p className="text-sm font-semibold mb-2">Nội dung đơn xin:</p>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap line-clamp-3">
                    {selectedRequest.content}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedRequest(null);
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

const UpdateRequest = () => {
  return (
    <UpdateRequestProvider>
      <div className="container mx-auto py-10">
        <UpdateRequestTableContent />
      </div>
    </UpdateRequestProvider>
  );
};

export default UpdateRequest;
