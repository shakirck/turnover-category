import { useRouter } from "next/router";
import Trpc from "./api/trpc/[trpc]";
import { api } from "~/utils/api";
import { useState } from "react";
import Link from "next/link";
import React, { createRef } from "react";
import { set } from "zod";

const refs: any = Array(8)
  .fill(0)
  .map((_, i) => createRef());
export default function Signup() {
  const [code , setCode] = useState<Array<string>>([]);
  console.log(code);
  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        if (index < refs.length - 1) {
          setCode([...code.slice(0, index), e.target.value, ...code.slice(index + 1)]);
          refs[index + 1].current.focus();
        }
        if(index === refs.length - 1){
          setCode([...code.slice(0, index), e.target.value]);
        }
      }
    };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
        // remove the index from code
        setCode([...code.slice(0, index), ...code.slice(index + 1)]);
        refs[index - 1].current.focus();
      }
    };

  const handleSubmit = () => {
    console.log("clicked");

    if (code.length != 8) {
      console.error("Please provide a valid code");
      return;
    }
    console.log(code);
  };

  return (
    <div className="flex h-auto justify-center">
      <div className="my-20 flex h-auto w-1/4 flex-col rounded-2xl border-2 p-2 [&>*]:p-5">
        <div className="flex w-full flex-col items-center">
          <div className="my-5 text-3xl  font-semibold">
            Verify Your Account
          </div>
          <div className="text-2xl  ">
            Enter the 8 digit code you have recieved on{" "}
          </div>
          <div className="text-lg  ">sdfdfsdsdf@gmail.com</div>
        </div>
        <div className="flex w-full flex-col [&>*]:py-5">
          <div
            className="flex w-full  flex-col justify-center
          "
          >
            <label className=" text-lg">Code</label>

            <div className="relative  flex flex-row flex-wrap  justify-between">
              {refs.map(
                (ref: React.RefObject<HTMLInputElement>, index: any) => (
                  <input
                    key={index}
                    type="text"
                    ref={ref}
                    maxLength={1}
                    onChange={handleInputChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    className="w-1/12 rounded-md border-2 p-3"
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
          </div>
        </div>
      </div>
    </div>

    // const handleInputChange = (index : any) => (e : any) => {
    //   if (e.target.value) {
    //     if (index < refs.length - 1) {
    //       refs[index + 1].current.focus();
    //     }
    //   }
    // };

    // return (
    //   <div>
    //     {refs.map((ref:any, index:any) => (
    //       <input
    //         key={index}
    //         type="text"
    //         ref={ref}
    //         maxLength={1}
    //         onChange={handleInputChange(index)}
    //         className="rounded-md border-2 p-3 w-1/12"
    //       />
    //     ))}
    //   </div>
  );
  // );
}
