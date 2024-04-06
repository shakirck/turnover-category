import { useRouter } from "next/router";
import Trpc from "./api/trpc/[trpc]";
import { api } from "~/utils/api";
import { useState } from "react";
import Link from "next/link";
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
<div className="flex h-auto justify-center">
      <div className="my-20 flex h-auto w-1/4 flex-col rounded-2xl border-2 p-10 [&>*]:p-5">
        <div className="flex w-full flex-col items-center">
          <div className="my-5 text-3xl  font-semibold">Create your account</div>
        </div>
        <div className="flex w-full flex-col [&>*]:py-5">
        <div className="flex flex-col ">
            <label className=" text-lg" htmlFor="name">
              Name
            </label>
            <div className="relative rounded-lg border-2 focus-within:border-gray-400">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="name"
                className="rounded-md border-0 p-3 pr-10 outline-none  w-full"
              />
            </div>
          </div>
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
                className="rounded-md border-0 p-3 pr-10 outline-none  w-full"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-lg" htmlFor="password">
              Password
            </label>
            <div className="relative rounded-lg border-2 focus-within:border-gray-400">
              <input
                type=  "password" 
                name="password"
                id="password"
                placeholder="password"
                className="rounded-md border-0 p-3 pr-10 outline-none  w-full"
              />
 
            </div>
          </div>
          <div className="flex flex-col">
            <button className="rounded-md bg-black p-3 text-white hover:bg-slate-900">
              Create Account
            </button>
          </div>

          <div className="w-full border-t-2"></div>
          <div className="w-full flex justify-center  items-center">
            <span >Have an account</span>
            <Link
              href="/signin"
            className="mx-2 font-semibold text-lg items-center "
            >
              LOGIN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
