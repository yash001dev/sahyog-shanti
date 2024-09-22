import Layout from "@/components/Layout";

export default function CreateCompany() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Create Company</h1>
      {/* Form content for creating a company goes here */}
      <form>
        {/* Your form fields here */}
        <input type="text" placeholder="Company Name" className="p-2 border" />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
          Create
        </button>
      </form>
    </Layout>
  );
}
