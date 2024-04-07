import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ZodError } from "zod";
import { api } from "~/utils/api";

export default function Signin() {
  const [error, setError] = useState<string | null>(null);
  const mymutation = api.auth.signin.useMutation({
    onMutate: () => {
      setError(null);
    },
    onError: (error) => {
      console.error(error);
      if (error instanceof ZodError) {
        setError(error.message);
      } else {
        setError(error.message);
      }
    },
    onSuccess: (data) => {
      setError(null);
    },
  });
  const router = useRouter();
  const [state, setState] = useState({ email: "", password: "" });
  const emailRef = React.createRef<HTMLInputElement>();
  const passwordRef = React.createRef<HTMLInputElement>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    setState({ ...state, [name]: e.target.value });
  };
  const handleSubmit = async () => {
    let { email, password } = state;

    if (!email) {
      email = emailRef.current?.value as string;
    }
    if (!password) {
      password = passwordRef.current?.value as string;
    }
    if (!email || !password) {
      setError("Please provide email and password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be atleast 8 characters");
      return;
    }
    try {
      const res = await mymutation.mutateAsync(state);
      const token = res.token;
      if (!token) {
        return
      }
      router.push("/dashboard");
    } catch (error) {
      console.error(error, "error");
    }
  };

  const isLoading = () => {
    if (mymutation.isPending) {
      return (
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline h-4 w-4 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
  };
  return (
    <div className="flex h-auto justify-center">
      <div className="w-min[576px] my-20 flex h-auto flex-col rounded-2xl border-2 p-10 [&>*]:p-5">
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
                onChange={(e) => handleChange(e, "email")}
                ref={emailRef}
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
                onChange={(e) => handleChange(e, "password")}
                ref={passwordRef}
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
            <button
              className="rounded-md bg-black p-3 text-white hover:bg-slate-900"
              onClick={handleSubmit}
            >
              Login
            </button>
            {isLoading()}
          </div>
          {error && <div className="text-red-500">{error}</div>}
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
