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
import {
  useGetCompanyQuery,
  useDeleteCompanyMutation,
} from "../../../store/api/companyApi";
import { PenIcon } from "lucide-react";
import ButtonLoading from "../ui/buttonloading";
import { set } from "lodash";
import CreateCompany from "../CreateCompany";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../store/loaderSlice";
// import {
//   useFetchCompanies,
//   useDeleteCompany,
//   useUpdateCompany,
// } from "@/hooks/companyHooks";

const ViewCompany = () => {
  const { data: companies, refetch, isLoading } = useGetCompanyQuery();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
  });
  const [loadingId, setLoadingId] = useState(null);
  const [isEditView, setIsEditView] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();
  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await deleteCompany({ id });
      toast({ title: "Company deleted", status: "success" });
    } catch (error) {
      toast({ title: "Failed to delete company", status: "error" });
    }
  };

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
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isLoading]);

  if (isEditView) {
    return (
      <CreateCompany
        companyData={editingCompany}
        handleGoBack={() => setIsEditView(false)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">View Companies</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>WhatsApp Number</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies?.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.id}</TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.whatsappNumber}</TableCell>
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

export default ViewCompany;
