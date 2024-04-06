import Link from "next/link";
import { Router, useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";

export default function Signin() {
  const mymutation = api.auth.signin.useMutation();
  const router = useRouter();
  const [state, setState] = useState({ email: "", password: "" });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
  };
  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }
  return (
    <div className="flex h-auto justify-center">
      <div className="my-20 flex h-auto w-1/4 flex-col rounded-2xl border-2 p-10 [&>*]:p-5">
        <div className="flex w-full flex-col items-center">
          <div className="my-5 text-3xl  font-semibold">Login</div>
          <div className="text-2xl  ">Welcome back to ECOMMERCE</div>
          <div className="text-lg  ">The next gen business marketplace</div>
        </div>
        <div className="flex w-full flex-col [&>*]:py-5">
          <div className="flex flex-col ">
            <label className=" text-lg" htmlFor="email">
              Email
            </label>
            <div className="relative rounded-lg border-2 focus-within:border-gray-400">
              <input
                type="text"
                name="email"
                id="email"
                placeholder="email"
                className="w-full rounded-md border-0 p-3 pr-10  outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-lg" htmlFor="password">
              Password
            </label>
            <div className="relative rounded-lg border-2 focus-within:border-gray-400">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                id="password"
                placeholder="password"
                className="w-full rounded-md border-0 p-3 pr-10  outline-none"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {isPasswordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <button className="rounded-md bg-black p-3 text-white hover:bg-slate-900">
              Login
            </button>
          </div>

          <div className="w-full border-t-2"></div>
          <div className="flex w-full items-center  justify-center">
            <span>Don't have an account</span>
            <Link
              href="/signup"
              className="mx-2 items-center text-lg font-semibold "
            >
              SIGNUP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
