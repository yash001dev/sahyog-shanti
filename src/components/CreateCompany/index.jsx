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
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import {
  useCreateCompanyMutation,
  useEditCompanyMutation,
} from "../../../store/api/companyApi";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import ButtonLoading from "../ui/buttonloading";
import { ChevronLeft } from "lucide-react";

// Define the schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  whatsappNumber: z
    .string()
    .min(10, { message: "WhatsApp number must be at least 10 digits." })
    .regex(/^\d+$/, { message: "WhatsApp number should only contain digits." }),
});

function CreateCompany({ companyData, handleGoBack }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsappNumber: "",
    },
  });

  useEffect(() => {
    if (companyData) {
      form.setValue("name", companyData.name);
      form.setValue("email", companyData.email);
      form.setValue("whatsappNumber", companyData.whatsappNumber);
    }
  }, [companyData]);

  const { toast } = useToast();

  const [createCompany, { isLoading, isError, error, data }] =
    useCreateCompanyMutation();

  const [
    updateCompany,
    {
      isLoading: isUpdating,
      isError: isUpdateError,
      error: updateError,
      data: updateData,
    },
  ] = useEditCompanyMutation();

  const onSubmit = (data) => {
    if (companyData) {
      updateCompany({ ...data, id: companyData.id });

      return;
    }
    createCompany(data);
  };

  useEffect(() => {
    if (isError) {
      toast({
        title: "Company creation failed",
        description: error?.message,
        status: "error",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  useEffect(() => {
    if (data) {
      toast({
        title: "Company created",
        description: "Your company has been created successfully.",
        status: "success",
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
          {companyData ? "Edit Company" : "Create Company"}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will appear on your company profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter a valid email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your WhatsApp contact number.
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

export default CreateCompany;
