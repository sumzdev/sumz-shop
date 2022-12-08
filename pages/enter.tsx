import { signIn, signOut, useSession } from "next-auth/react";

export default function Enter() {
  const { data: session, status } = useSession();

  return (
    <div className="p-10">
      <div className="mb-10 border-solid border">
        <p>Status : {status}</p>
        <p>email : {session?.user?.email}</p>
        <p>name : {session?.user?.name}</p>
      </div>

      {!session && (
        <button
          className="bg-slate-300 px-10 py-3 rounded-md mr-5"
          onClick={() => signIn("google")}
        >
          Google Login
        </button>
      )}

      {!session?.user && (
        <button
          className="bg-slate-300 px-10 py-3 rounded-md"
          onClick={() => signOut()}
        >
          SignOut
        </button>
      )}
    </div>
  );
}
