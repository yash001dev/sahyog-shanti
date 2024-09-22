import React from "react";
import Layout from "@/components/Layout";
import {
  Tabs,
  TabsList,
  TabP,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import CreateCompany from "@/components/CreateCompany";

const Company = () => {
  return (
    <Layout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="createCompany" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="createCompany"
              className="data-[state=active]:bg-white"
            >
              Create Company
            </TabsTrigger>
            <TabsTrigger
              value="viewCompany"
              className="data-[state=active]:bg-white"
            >
              Edit/View Company
            </TabsTrigger>
          </TabsList>
          <TabsContent value="createCompany">
            <CreateCompany />
          </TabsContent>
          <TabsContent value="viewCompany">
            Change your password here.
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
};

export default Company;
