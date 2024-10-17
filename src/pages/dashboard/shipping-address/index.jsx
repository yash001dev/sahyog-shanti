import React from "react";
import Layout from "@/components/Layout";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import CreateShippingAddress from "@/components/CreateShippingAddress";
import ViewShippingAddress from "@/components/ViewShippingAddress";

const ShippingAddress = () => {
  return (
    <Layout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="createCompany" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="createCompany"
              className="data-[state=active]:bg-white"
            >
              Create Shipping Address
            </TabsTrigger>
            <TabsTrigger
              value="viewCompany"
              className="data-[state=active]:bg-white"
            >
              View Shipping Address
            </TabsTrigger>
          </TabsList>
          <TabsContent value="createCompany">
            <CreateShippingAddress />
          </TabsContent>
          <TabsContent value="viewCompany">
            <ViewShippingAddress />
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
};

export default ShippingAddress;
