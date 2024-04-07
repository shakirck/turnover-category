/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import {  useState } from "react";
import React, { createRef } from "react";

const refs: React.RefObject<HTMLInputElement>[] = Array(8)
  .fill(0)
  .map((_, i) => createRef());
export default function Signup() {
  const [code, setCode] = useState<Array<string>>([]);
  const [error, setError] = useState<boolean>(false);
  const verifyMutation = api.auth.verify.useMutation({
    onError: (error) => {
      setError(true);
    },
  });
  const router = useRouter();
  const email = router.query.email as string;

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        if (index < refs.length - 1) {
          setCode([
            ...code.slice(0, index),
            e.target.value,
            ...code.slice(index + 1),
          ]);
          // refs[index + 1].current
        }
        if (index === refs.length - 1) {
          setCode([...code.slice(0, index), e.target.value]);
        }

        setError(false);
      }
    };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
        setCode([...code.slice(0, index), ...code.slice(index + 1)]);
        // refs[index - 1].current.focus();
      }
    };

  const handleSubmit = async () => {
    try {
      console.log("clicked");

      if (code.length != 8) {
        console.error("Please provide a valid code");
        return;
      }
      const codeString = code.join("");
      const email = router.query.email as string;
      if (!email) {
        console.error("Please provide a valid email");
       await  router.push("/signup");
      }
      console.log(codeString);
      const verified = await verifyMutation.mutateAsync({
        code: codeString,
        email: email,
      });
      console.log(verified);
      if (verified?.token) {
       await  router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (pastedData.length !== 8) {
      console.error("Please provide a valid code");
      return;
    }
    setCode(pastedData.split(""));

    refs.forEach((ref: React.RefObject<HTMLInputElement>, index: number) => {
      if (ref.current) {
        ref.current.value = pastedData[index]!;
      }
    });
  };
  function obfuscateEmail(email: string) {
    if (!email) {
      return "";
    }
    const [username, domain] = email.split("@");
    const obfuscatedNamePart = username?.substring(0, 3) + "***";
    return obfuscatedNamePart + "@" + domain;
  }

  return (
    <div className="flex h-auto justify-center">
      <div className="my-20 flex h-auto w-[576px] flex-col rounded-2xl border-2 p-2 [&>*]:p-5">
        <div className="flex w-full flex-col items-center">
          <div className="my-5 text-3xl  font-semibold">
            Verify Your Account
          </div>
          <div className="text-2xl  ">
            Enter the 8 digit code you have recieved on{" "}
          </div>
          <div className="text-lg  ">{obfuscateEmail(email)}</div>
        </div>
        <div className="flex w-full flex-col [&>*]:py-5">
          <div
            className="flex w-full  flex-col justify-center
          "
          >
            <label className=" text-lg">Code</label>

            <div className="relative  flex flex-row flex-wrap  justify-between">
              {refs.map(
                (ref: React.RefObject<HTMLInputElement>, index: number) => (
                  <input
                    key={index}
                    type="text"
                    ref={ref}
                    maxLength={1}
                    onChange={handleInputChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={onPaste}
                    className={`w-1/12 rounded-md border-2 p-3 ${
                      error ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                ),
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <button
              disabled={code.length !== 8}
              className={`rounded-md p-3 ${code.length !== 8 ? "bg-slate-50 text-white" : "bg-black text-white"}`}
              onClick={handleSubmit}
            >
              VERIFY
            </button>
            {error && (
              <div className="text-lg font-semibold text-red-500">
                Please enter a valid code
              </div>
            )}

            {verifyMutation.isPending && <div>Verifying...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
