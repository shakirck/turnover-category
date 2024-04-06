import { Router, useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

export default function Signin() {
  const mymutation = api.auth.signin.useMutation();
  const router = useRouter();
  const [state, setState] = useState({ username: "", password: "" });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    console.log(e.target.value);
    setState({ ...state, [name]: e.target.value });
  };
  const handleSubmit = async () => {
    const res = await mymutation.mutateAsync(state);
    console.log(res);
    const token = res.token;
    // check if cookie successfully set
    if (!token) {
      console.log("token not set");
    }


    //  redirect to dashboard
    router.push("/dashboard");
  }
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
      <button onClick={handleSubmit}>signin</button>
    </div>
  );
}
