import { useRouter } from "next/router";
import Trpc from "./api/trpc/[trpc]";
import { api } from "~/utils/api";
import { useState } from "react";
import Link from "next/link";
import { ZodError } from "zod";
import {z} from 'zod'
export default function Signup() {
  const[errror , setError] = useState<string | null>(null)
  const mymutation = api.auth.signup.useMutation({
    onError: (error) => {
      console.error(error);
      setError(error.message);
      if(error instanceof ZodError){
      }
    }
  });
  const router = useRouter();

  const [state, setState] = useState({ email: "",  name: "" , password: "" });
  const submit = async () => {
  try {
    if( !state.email || !state.password || !state.name){
      setError("Please provide email, name and password");
      return;
    }
    const res = await mymutation.mutateAsync(state);
    router.push({
      pathname: "/verify",
      query: { email: state.email },
    
    });
  } catch (error) {
    
  }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setState({ ...state, [name]: e.target.value });
  };
  return (
<div className="flex h-auto justify-center">
      <div className="my-20 flex h-auto w-[576px] w-min[576px] flex-col rounded-2xl border-2 p-10 [&>*]:p-5">
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
              onChange={(e) => handleChange(e, "name")}
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
              onChange={(e) => handleChange(e, "email")}
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
              onChange={(e) => handleChange(e, "password")}
                type=  "password" 
                name="password"
                id="password"
                placeholder="password"
                className="rounded-md border-0 p-3 pr-10 outline-none  w-full"
              />
 
            </div>
          </div>
          <div className="flex flex-col">
            <button className="rounded-md bg-black p-3 text-white hover:bg-slate-900" onClick={submit}>
              Create Account
            </button>
          </div>
          {
            errror && <div className="text-red-500 text-lg font-semibold">{errror}</div>
          }
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
