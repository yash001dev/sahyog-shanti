import React from "react";
import Layout from "@/components/Layout";
import {
  Tabs,
  TabsList,
  TabP,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import CreatePurchaseOrder from "@/components/CreatePurchaseOrder";
import ViewPurchaseOrder from "@/components/ViewPurchaseOrder";

const PurchaseOrder = () => {
  return (
    <Layout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="createCompany" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="createCompany"
              className="data-[state=active]:bg-white"
            >
              Create Purchase Order
            </TabsTrigger>
            <TabsTrigger
              value="viewCompany"
              className="data-[state=active]:bg-white"
            >
              View Purchase Order
            </TabsTrigger>
          </TabsList>
          <TabsContent value="createCompany">
            <CreatePurchaseOrder />
          </TabsContent>
          <TabsContent value="viewCompany">
            <ViewPurchaseOrder />
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
};

export default PurchaseOrder;
