import { useRouter } from "next/router";
import Trpc from "./api/trpc/[trpc]";
import { api } from "~/utils/api";
import { useState } from "react";
export default function Signup() {
  const mymutation = api.auth.signup.useMutation();
  const router = useRouter();

  const [state, setState] = useState({ username: "", password: "" });
  const submit = async () => {
    const res = await mymutation.mutateAsync(state);
    const token = res.token
    localStorage.setItem("token", token);
    console.log(token,'token')
    router.push("/dashboard");
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setState({ ...state, [name]: e.target.value });
  };
  return (
    <div>
      <input
        type="text"
        name="username"
        placeholder="username"
        onChange={(e) => handleChange(e, "username")}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={(e) => handleChange(e, "password")}
      />
      <button onClick={submit}>Signup</button>
    </div>
  );
}
