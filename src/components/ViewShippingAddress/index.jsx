import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useGetShippingAddressesQuery,
  useDeleteShippingAddressMutation,
} from "../../../store/api/createShippingAddressApi";
import { PenIcon } from "lucide-react";
import ButtonLoading from "../ui/buttonloading";
import { set } from "lodash";
import CreateShippingAddress from "../CreateShippingAddress";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../store/loaderSlice";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const ViewShippingAddress = () => {
  const {
    data: companiesAddress,
    refetch,
    isLoading,
  } = useGetShippingAddressesQuery();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
  });
  const [loadingId, setLoadingId] = useState(null);
  const [isEditView, setIsEditView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCompany, setEditingCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteCompanyAddress, { isLoading: isDeleting }] =
    useDeleteShippingAddressMutation();
  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await deleteCompanyAddress({ id });
      toast({
        title: "Company deleted",
        status: "success",
        className: "toast-background",
      });
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
      toast({
        title: "Company updated",
        status: "success",
        className: "toast-background",
      });
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

  const fuse = new Fuse(companiesAddress || [], {
    keys: ["name", "email", "whatsappNumber"],
  });

  const filteredCompanies = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : companiesAddress;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompanies?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil((filteredCompanies?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isEditView) {
    return (
      <CreateShippingAddress
        companyData={editingCompany}
        handleGoBack={() => setIsEditView(false)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">View Shipping Address</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {companiesAddress?.map((company) => (
          <Card key={company.id}>
            <CardHeader>
              <h2 className="text-xl font-semibold">
                Address ID: {company.id}
              </h2>
            </CardHeader>
            <CardContent>
              <p>Company Address:{company.address}</p>
              <p>Created At: {new Date(company.createdAt).toLocaleString()}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEdit(company)}
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
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            variant={currentPage === index + 1 ? "primary" : "outline"}
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
      </div>
      {/* <Table>
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
          {currentItems?.map((company) => (
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
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            variant={currentPage === index + 1 ? "primary" : "outline"}
            className="mx-1"
          >
            {index + 1}
          </Button>
        ))}
      </div> */}
    </div>
  );
};

export default ViewShippingAddress;
