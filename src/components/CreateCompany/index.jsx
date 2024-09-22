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
import { useCreateCompanyMutation } from "../../../store/api/companyApi";

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

function CreateCompany() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsappNumber: "",
    },
  });

  const [createCompany, { isLoading, isError, error, data }] =
    useCreateCompanyMutation();

  const onSubmit = (data) => {
    createCompany(data);
  };

  if (isError) {
    alert("Error creating company");
  }
  if (data) {
    alert("Company created successfully");
  }
  return (
    <>
      <h1 className=" text-3xl font-semibold">Create Company</h1>
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
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </main>
    </>
  );
}

export default CreateCompany;
