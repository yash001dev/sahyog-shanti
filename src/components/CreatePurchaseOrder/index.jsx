import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import _ from "lodash";
import { useGetCompanyQuery } from "../../../store/api/companyApi";
import {
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
} from "../../../store/api/purchaseOrderApi";
import ButtonLoading from "../ui/buttonloading";
import { useToast } from "@/hooks/use-toast";

// Define the schema using Zod
const formSchema = z.object({
  purchaseOrderNo: z
    .string()
    .min(1, { message: "Purchase Order No is required" }),
  schoolName: z.string().min(1, { message: "School name is required" }),
  billingName: z.string().min(1, { message: "Billing name is required" }),
  books: z.array(
    z.object({
      textbookStd: z.string().min(1, { message: "TextBook Std is required" }),
      bookName: z.string().min(1, { message: "Book name is required" }),
      code: z.string().min(1, { message: "Code is required" }),
      qty: z.string().min(1, { message: "Qty is required" }),
    })
  ),
  publicationName: z
    .string()
    .min(1, { message: "Publication name is required" }),
  status: z.boolean(),
});

const CreatePurchaseOrder = ({ purchaseData, GoBack }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseOrderNo: "",
      schoolName: "",
      billingName: "",
      books: [{ textbookStd: "", bookName: "", code: "", qty: "1" }],
      publicationName: "",
      status: false,
    },
  });
  const { toast } = useToast();
  const [books, setBooks] = useState([{ id: 1 }]);
  const { data: companies, refetch } = useGetCompanyQuery();
  const [
    createPurchaseOrder,
    { isLoading: isCreating, error: createError, isSuccess: isCreated },
  ] = useCreatePurchaseOrderMutation();

  const [
    updatePurchaseOrder,
    { isLoading: isUpdating, error: updateError, isSuccess },
  ] = useUpdatePurchaseOrderMutation();

  const addBook = () => {
    setBooks([...books, { id: books.length + 1 }]);
  };

  const deleteBook = (id) => {
    if (books.length > 1) {
      setBooks(books.filter((book) => book.id !== id));
    }
    //Also Remove From Form
    form.setValue(
      "books",
      form.getValues("books").filter((book) => book.id !== id)
    );
  };

  const onSubmit = (data) => {
    const companyId = parseInt(data.publicationName);
    const constructedData = {
      ...data,
      //Want to send the company name instead of the id
      publicationName: companies.find(
        (company) => company.id === parseInt(data.publicationName)
      )?.name,
      companyId,
    };
    if (purchaseData) {
      updatePurchaseOrder({ ...constructedData, id: purchaseData.id }).then(
        (res) => {
          if (res.error) {
            toast({
              title: "Purchase Order update failed",
              description: res.error?.message,
              status: "error",
              variant: "destructive",
            });
          }
          if (res.data) {
            toast({
              title: "Purchase Order updated",
              status: "success",
            });
            GoBack();
          }
        }
      );
      return;
    }
    createPurchaseOrder(constructedData).then((res) => {
      if (res.error) {
        toast({
          title: "Purchase Order creation failed",
          description: res.error?.message,
          status: "error",
          variant: "destructive",
        });
      }
      if (res.data) {
        toast({
          title: "Purchase Order created",
          status: "success",
        });
        setBooks([{ id: 1 }]);
        form.reset();
      }
    });
  };

  const standard1to12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((std) => (
    <SelectItem key={_.uniqueId()} value={std.toString()}>
      {std}
    </SelectItem>
  ));

  useEffect(() => {
    if (purchaseData) {
      console.log("purchaseData", purchaseData);
      form.setValue("purchaseOrderNo", purchaseData.purchaseOrderNo);
      form.setValue("schoolName", purchaseData.schoolName);
      form.setValue("billingName", purchaseData.billingName);
      // form.setValue("publicationName", );
      form.setValue("status", purchaseData.status);
      setBooks(
        purchaseData.books.map((book, index) => ({ ...book, id: index + 1 }))
      );
      form.setValue(
        "books",
        purchaseData.books?.map((book) => ({
          ...book,
          textbookStd: book.textbookStd.toString(),
        }))
      );
    }
  }, [purchaseData]);

  useEffect(() => {
    //If company and purchase data available then set publication name from company
    if (companies && purchaseData) {
      const companyId = companies.find(
        (company) => company.name === purchaseData.publicationName
      )?.id;
      form.setValue("publicationName", companyId.toString());
    }
  }, [companies, purchaseData]);

  return (
    <>
      <h1 className="text-2xl font-semibold">
        {purchaseData ? "Edit Purchase Order" : "Create Purchase Order"}
      </h1>
      <main className="flex flex-1 flex-col items-start justify-start p-4 md:items-center md:justify-center md:p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-3xl"
          >
            <FormField
              control={form.control}
              name="purchaseOrderNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order No</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Purchase Order No"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="School Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="billingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Billing Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {books.map((book, index) => (
              <div
                key={book.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <FormField
                  control={form.control}
                  name={`books.${index}.textbookStd`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Textbooks Std.</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{standard1to12}</SelectContent>
                      </Select>
                      {/* <FormDescription>
                        You can manage email addresses in your{" "}
                        <Link href="/examples/forms">email settings</Link>.
                      </FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`books.${index}.bookName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Book Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Book Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`books.${index}.code`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`books.${index}.qty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qty</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Qty" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {books.length > 1 && (
                  <Button type="button" onClick={() => deleteBook(book.id)}>
                    Delete
                  </Button>
                )}
              </div>
            ))}

            <Button type="button" onClick={addBook}>
              Add Other Books
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="publicationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a Company</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      {...field}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies?.map((company) => (
                          <SelectItem
                            key={company.id}
                            value={company.id.toString()}
                          >
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can manage email addresses in your{" "}
                      <Link href="/examples/forms">email settings</Link>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Checkbox {...field} className="ml-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {isCreating || isUpdating ? (
              <ButtonLoading />
            ) : purchaseData ? (
              <Button type="submit">Update</Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </form>
        </Form>
      </main>
    </>
  );
};

export default CreatePurchaseOrder;
