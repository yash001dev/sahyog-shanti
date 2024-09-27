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

import { PenIcon } from "lucide-react";
import ButtonLoading from "../ui/buttonloading";
import { set } from "lodash";
import CreateCompany from "../CreateCompany";
import {
  useDeletePurchaseOrderMutation,
  useGetPurchaseOrderQuery,
} from "../../../store/api/purchaseOrderApi";
import CreatePurchaseOrder from "../CreatePurchaseOrder";
import { hideLoader, showLoader } from "../../../store/loaderSlice";
import { useDispatch } from "react-redux";
// import {
//   useFetchCompanies,
//   useDeleteCompany,
//   useUpdateCompany,
// } from "@/hooks/companyHooks";

const ViewPurchaseOrder = () => {
  const {
    data: purchaseOrders,
    refetch,
    isLoading,
  } = useGetPurchaseOrderQuery();
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState(null);
  const [isEditView, setIsEditView] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteCompany, { isLoading: isDeleting }] =
    useDeletePurchaseOrderMutation();
  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await deleteCompany({ id });
      toast({ title: "Company deleted", status: "success" });
    } catch (error) {
      toast({ title: "Failed to delete company", status: "error" });
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isLoading]);

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsEditView(true);
  };

  const handleUpdate = async () => {
    try {
      // await useUpdateCompany(editingCompany, formData);
      toast({ title: "Company updated", status: "success" });
      setEditingCompany(null);
      refetch();
    } catch (error) {
      toast({ title: "Failed to update company", status: "error" });
    }
  };

  if (isEditView) {
    return (
      <CreatePurchaseOrder
        purchaseData={editingCompany}
        GoBack={() => setIsEditView(false)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">View Purchase Order</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Publication Name</TableHead>
            <TableHead>School Name</TableHead>
            <TableHead>Purchase Order No</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders?.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.id}</TableCell>
              <TableCell>{company.publicationName}</TableCell>
              <TableCell>{company.schoolName}</TableCell>
              <TableCell>{company.purchaseOrderNo}</TableCell>
              <TableCell>{company.status?.toString()}</TableCell>
              <TableCell>
                <div className="flex justify-start">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(company)}
                    style={{
                      marginRight: "0.5rem",
                    }}
                  >
                    <PenIcon className="h-4 w-4" />
                  </Button>
                  {loadingId === company.id && isDeleting ? (
                    <ButtonLoading />
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(company.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewPurchaseOrder;
