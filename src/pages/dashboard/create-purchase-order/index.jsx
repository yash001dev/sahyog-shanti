import Layout from "@/components/Layout";

export default function CreatePurchaseOrder() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Create Purchase Order</h1>
      {/* Form content for creating a purchase order goes here */}
      <form>
        {/* Your form fields here */}
        <input type="text" placeholder="Order Name" className="p-2 border" />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
          Create
        </button>
      </form>
    </Layout>
  );
}
