"use client";

import { useSupabase } from "@/components/supabase-provider";
import Logo from "@/public/logo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { supabase } = useSupabase();

  const createUser = async (event: any) => {
    event.preventDefault();

    setError("");

    setLoading(true);

    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", event.target.username.value)
      .single();

    if (data) {
      setLoading(false);
      return setError("Username not available");
    }

    const { error: e } = await supabase.auth.signUp({
      email: event.target.email.value,
      password: event.target.password.value,
      options: {
        data: {
          username: event.target.username.value,
          pro: false
        }
      }
    });

    if (!e) router.push("/notes");
    else if (e.message === "User already registered") setError("Email already in use");
    else setError(e.message);
    setLoading(false);
  };

  return (
    <>
      <div className="flex min-h-full flex-col py-8 sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Logo className="h-12 w-12 mx-auto cursor-pointer" onClick={() => router.push("/")} />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text-light">Create your account</h2>
          <p className="mt-2 text-center text-sm text-text-dark">
            Already registered?{" "}
            <Link href="/signin" className="font-medium text-text-medium hover:text-text-medium/70">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-bg-dark py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={createUser}>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-text-medium">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-text-medium bg-bg-default ring-1 ring-bg-light shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-special sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-text-medium">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-text-medium bg-bg-default ring-1 ring-bg-light shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-special sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-text-medium">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-text-medium bg-bg-default ring-1 ring-bg-light shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-special sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    required
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-text-medium text-text-medium bg-bg-default focus:ring-0"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-text-medium">
                    Accept <a href="https://hastenote.com/terms" target="_blank" rel="noopener noreferrer" className="underline">terms</a>.
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center items-center rounded-md bg-button-special py-2 px-3 text-sm font-semibold text-text-xlight shadow-sm hover:bg-button-special/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {loading && <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-text-dark" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>}
                  Create
                </button>
              </div>
              <p className="text-red-400/80 select-none">{error}</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
