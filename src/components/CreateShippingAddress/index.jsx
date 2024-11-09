import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
// import {
//   useCreateCompanyMutation,
//   useEditCompanyMutation,
// } from "../../../store/api/companyApi";
import {
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
} from "../../../store/api/createShippingAddressApi";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import ButtonLoading from "../ui/buttonloading";
import { ChevronLeft } from "lucide-react";

// Define the schema using Zod
const formSchema = z.object({
  shippingAddress: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
});

function CreateShippingAddress({ companyData, handleGoBack }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingAddress: "",
    },
  });

  useEffect(() => {
    if (companyData) {
      form.setValue("shippingAddress", companyData.address);
    }
  }, [companyData]);

  const { toast } = useToast();

  const [createShippingAddress, { isLoading, isError, error, data }] =
    useCreateShippingAddressMutation();

  const [
    updateShippingAddress,
    {
      isLoading: isUpdating,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useUpdateShippingAddressMutation();

  const onSubmit = (data) => {
    if (companyData) {
      updateShippingAddress({ ...data, id: companyData.id });

      return;
    }
    createShippingAddress(data);
  };

  useEffect(() => {
    if (isError) {
      toast({
        title: "Shipping Address Failed",
        description: error?.message,
        status: "error",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  useEffect(() => {
    if (data) {
      toast({
        title: "Shipping Address created",
        description: "Your shipping address has been created successfully.",
        status: "success",
        className: "toast-background",
      });
      form.reset();
    }
  }, [data, toast]);

  useEffect(() => {
    if (isUpdateError) {
      toast({
        title: "Company update failed",
        description: updateError?.message,
        status: "error",
        variant: "destructive",
      });
    }
  }, [isUpdateError, updateError, toast]);

  useEffect(() => {
    if (updateData) {
      toast({
        title: "Company updated",
        description: "Your company has been updated successfully.",
        status: "success",
        className: "toast-background",
      });

      form.reset();
      handleGoBack();
    }
  }, [updateData, toast]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        {companyData ? (
          <Button
            onClick={() => handleGoBack()}
            variant="outline"
            size="icon"
            className="mr-1"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : null}
        <h1 className=" text-2xl font-semibold">
          {companyData ? "Update Shipping Address" : "Create Shipping Address"}
        </h1>
      </div>
      <main className="flex flex-1 flex-col items-start justify-start p-4 md:items-center md:justify-center md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-md"
          >
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your Address" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the shippingAddress for your company.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <ButtonLoading />
            ) : companyData ? (
              <Button type="submit">Update</Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </form>
        </Form>
      </main>
    </>
  );
}

export default CreateShippingAddress;
