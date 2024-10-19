import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { ChevronDown, MoreHorizontal, PenIcon } from "lucide-react";
import ButtonLoading from "../ui/buttonloading";
import { set } from "lodash";
import CreateCompany from "../CreateCompany";
import {
  useDeletePurchaseOrderMutation,
  useGetPurchaseOrderQuery,
  useUpdatePurchaseOrderStatusMutation,
} from "../../../store/api/purchaseOrderApi";
import CreatePurchaseOrder from "../CreatePurchaseOrder";
import { hideLoader, showLoader } from "../../../store/loaderSlice";
import { useDispatch } from "react-redux";
import { Checkbox } from "../ui/checkbox";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import CustomizedAlertDialog from "../AlertDialog";
import { Input } from "../ui/input";
// import {
//   useFetchCompanies,
//   useDeleteCompany,
//   useUpdateCompany,
// } from "@/hooks/companyHooks";

const ViewPurchaseOrder = () => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentStatus, setCurrentStatus] = useState("");
  const [updateStatus, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdatePurchaseOrderStatusMutation();
  const {
    data: purchaseOrders,
    refetch,
    isLoading,
  } = useGetPurchaseOrderQuery();

  const [loadingId, setLoadingId] = useState(null);
  const [isEditView, setIsEditView] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteCompany, { isLoading: isDeleting }] =
    useDeletePurchaseOrderMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { toast } = useToast();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading || isUpdating) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isLoading, isUpdating]);

  useEffect(() => {
    if (isUpdateSuccess) {
      toast({ title: "Status updated", status: "success" });
    }
  }, [isUpdateSuccess]);

  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await deleteCompany({ id });
      setIsDialogOpen(false);
      toast({ title: "Company deleted", status: "success" });
    } catch (error) {
      toast({ title: "Failed to delete company", status: "error" });
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsEditView(true);
  };

  const bulkStatusUpdate = async (status) => {
    const ids = table.getSelectedRowModel().rows.map((row) => {
      return parseInt(row.original.id);
    });

    if (!ids.length) {
      toast({ title: "No rows selected", status: "error" });
      return;
    }
    updateStatus({ ids, status });
  };

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table?.getIsAllPageRowsSelected() ||
            (table?.getIsSomePageRowsSelected() && "indeterminate")
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
      accessorKey: "purchaseOrderNo",
      header: "Purchase Order No",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("purchaseOrderNo")}</div>
      ),
    },
    {
      accessorKey: "publicationName",
      header: "Publication Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("publicationName")}</div>
      ),
    },
    {
      accessorKey: "schoolName",
      header: "School Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("schoolName")}</div>
      ),
    },
    {
      accessorKey: "currentStatus",
      header: "Current Status",
      cell: ({ row }) => {
        return <div>{row.getValue("currentStatus")}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  handleEdit(row.original);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDeleteId(row.original.id);

                  setIsDialogOpen(true);

                  // handleDelete(row.original.id);
                }}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  bulkStatusUpdate("Approved");
                }}
              >
                Mark as Approved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  bulkStatusUpdate("Draft");
                }}
              >
                Mark as Draft
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  bulkStatusUpdate("InTransit");
                }}
              >
                Mark as In-Transit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  bulkStatusUpdate("Delivered");
                }}
              >
                Mark as Delivered
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    columns,
    data: purchaseOrders ?? [],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isEditView) {
    return (
      <CreatePurchaseOrder
        purchaseData={editingCompany}
        GoBack={() => setIsEditView(false)}
      />
    );
  }

  const handleStatusChange = async (status) => {
    //We need to show row which have current status as status
    setCurrentStatus(status);
    table.getColumn("currentStatus")?.setFilterValue(status);
  };

  return (
    <>
      <CustomizedAlertDialog
        open={isDialogOpen}
        closeDialog={() => {
          setIsDialogOpen(false);
        }}
        action={() => {
          handleDelete(deleteId);
        }}
        message="This action cannot be undone. This will permanently delete your purchase record and remove your data from our servers."
        isLoading={isDeleting}
      />
      <div className="w-full">
        <div className="flex flex-col md:flex-row items-center py-4 space-y-4 md:space-y-0 md:space-x-4">
          <Input
            placeholder="Enter Purchase Order No"
            value={table.getColumn("purchaseOrderNo")?.getFilterValue() ?? ""}
            onChange={(event) => {
              table
                .getColumn("purchaseOrderNo")
                ?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mr-2">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="ml-2">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {/* {column.id} */}
                        {column.columnDef.header}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Current Status <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  //Highlight the selected status
                  className={
                    currentStatus === "Draft"
                      ? "bg-primary-foreground text-primary-background"
                      : ""
                  }
                  onSelect={() => handleStatusChange("Draft")}
                >
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    currentStatus === "Approved"
                      ? "bg-primary-foreground text-primary-background"
                      : ""
                  }
                  onSelect={() => handleStatusChange("Approved")}
                >
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    currentStatus === "Intransit"
                      ? "bg-primary-foreground text-primary-background"
                      : ""
                  }
                  onSelect={() => handleStatusChange("Intransit")}
                >
                  In-transit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    currentStatus === "Delivered"
                      ? "bg-primary-foreground text-primary-background"
                      : ""
                  }
                  onSelect={() => handleStatusChange("Delivered")}
                >
                  Delivered
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
              {table.getRowModel().rows?.length ? (
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// const ViewPurchaseOrder = () => {
//   const {
//     data: purchaseOrders,
//     refetch,
//     isLoading,
//   } = useGetPurchaseOrderQuery();
//   const { toast } = useToast();
//   const [loadingId, setLoadingId] = useState(null);
//   const [isEditView, setIsEditView] = useState(false);
//   const [editingCompany, setEditingCompany] = useState(null);
//   const [deleteCompany, { isLoading: isDeleting }] =
//     useDeletePurchaseOrderMutation();
//   const handleDelete = async (id) => {
//     setLoadingId(id);
//     try {
//       await deleteCompany({ id });
//       toast({ title: "Company deleted", status: "success" });
//     } catch (error) {
//       toast({ title: "Failed to delete company", status: "error" });
//     }
//   };

//   const dispatch = useDispatch();
//   useEffect(() => {
//     if (isLoading) {
//       dispatch(showLoader());
//     } else {
//       dispatch(hideLoader());
//     }
//   }, [isLoading]);

//   const handleEdit = (company) => {
//     setEditingCompany(company);
//     setIsEditView(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       // await useUpdateCompany(editingCompany, formData);
//       toast({ title: "Company updated", status: "success" });
//       setEditingCompany(null);
//       refetch();
//     } catch (error) {
//       toast({ title: "Failed to update company", status: "error" });
//     }
//   };

//   if (isEditView) {
//     return (
//       <CreatePurchaseOrder
//         purchaseData={editingCompany}
//         GoBack={() => setIsEditView(false)}
//       />
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div>
//         <h1 className="text-2xl font-semibold mb-4">View Purchase Order</h1>
//       </div>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Publication Name</TableHead>
//             <TableHead>School Name</TableHead>
//             <TableHead>Purchase Order No</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {purchaseOrders?.map((company) => (
//             <TableRow key={company.id}>
//               <TableCell>{company.id}</TableCell>
//               <TableCell>{company.publicationName}</TableCell>
//               <TableCell>{company.schoolName}</TableCell>
//               <TableCell>{company.purchaseOrderNo}</TableCell>
//               <TableCell>{company.status?.toString()}</TableCell>
//               <TableCell>
//                 <div className="flex justify-start">
//                   <Button
//                     variant="outline"
//                     size="icon"
//                     onClick={() => handleEdit(company)}
//                     style={{
//                       marginRight: "0.5rem",
//                     }}
//                   >
//                     <PenIcon className="h-4 w-4" />
//                   </Button>
//                   {loadingId === company.id && isDeleting ? (
//                     <ButtonLoading />
//                   ) : (
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleDelete(company.id)}
//                     >
//                       Delete
//                     </Button>
//                   )}
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

export default ViewPurchaseOrder;
