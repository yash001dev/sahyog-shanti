import React, { useState } from "react";
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

// Define the schema using Zod
const formSchema = z.object({
  purchaseOrderNo: z
    .number()
    .min(1, { message: "Purchase Order No is required" }),
  schoolName: z.string().min(1, { message: "School name is required" }),
  billingName: z.string().min(1, { message: "Billing name is required" }),
  books: z.array(
    z.object({
      textbookStd: z.string().min(1, { message: "TextBook Std is required" }),
      bookName: z.string().min(1, { message: "Book name is required" }),
      code: z.string().min(1, { message: "Code is required" }),
      qty: z.number().min(1, { message: "Qty is required" }),
    })
  ),
  publicationName: z
    .string()
    .min(1, { message: "Publication name is required" }),
  status: z.boolean(),
});

const CreatePurchaseOrder = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseOrderNo: "",
      schoolName: "",
      billingName: "",
      books: [{ textbookStd: "", bookName: "", code: "", qty: 1 }],
      publicationName: "",
      status: false,
    },
  });

  const [books, setBooks] = useState([{ id: 1 }]);

  const addBook = () => {
    setBooks([...books, { id: books.length + 1 }]);
  };

  const deleteBook = (id) => {
    if (books.length > 1) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const standard1to12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((std) => (
    <SelectItem key={_.uniqueId()} value={std.toString()}>
      {std}
    </SelectItem>
  ));

  return (
    <>
      <h1 className="text-2xl font-semibold">Create Purchase Order</h1>
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
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>{standard1to12}</SelectContent>
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
                    <FormLabel>Email</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m@example.com">
                          m@example.com
                        </SelectItem>
                        <SelectItem value="m@google.com">
                          m@google.com
                        </SelectItem>
                        <SelectItem value="m@support.com">
                          m@support.com
                        </SelectItem>
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
                      <Checkbox {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </main>
    </>
  );
};

export default CreatePurchaseOrder;
