import { useState } from "react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
} from "../../store/api/createuser";

export default function Home() {
  const { data: users, isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser({ name, email, password });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users?.map((user) => (
            <li key={user.id}>
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="mt-6">
        <input
          className="border p-2 mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          className="border p-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {/* Password */}
        <input
          className="border p-2 mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="bg-blue-500 text-white p-2" type="submit">
          Create User
        </button>
      </form>
    </div>
  );
}
