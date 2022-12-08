import { Button, Container, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Enter() {
  const { data: session, status } = useSession();

  return (
    <Container className="flex items-center w-full justify-center">
      <Box className="mt-8 items-center flex flex-row justify-center py-14 gap-3 ">
        <Image src="/sumz.svg" alt="Sumz Logo" width={72} height={72} />
        <h2 className="text-4xl font-bold text-center  ">SUMZ</h2>
      </Box>

      <Box className="flex flex-col items-center gap-4 md:w-3/4 lg:w-1/2 mx-auto">
        <TextField
          fullWidth
          required
          id="email"
          label="이메일"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          fullWidth
          required
          id="password"
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="current-password"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, py: 1.7 }}
        >
          로그인
        </Button>

        <Button className="self-end">
          <Link href="/signup">회원가입</Link>
        </Button>

        <Box className="flex flex-row w-full gap-4 mt-10">
          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.2 }}
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => signIn("kakao")}
            className=""
          >
            Sign in with Kakao
          </Button>
        </Box>
      </Box>

      <Box className="mt-10">
        {session?.user && (
          <button
            className="bg-slate-300 px-10 py-3 rounded-md"
            onClick={() => signOut()}
          >
            SignOut
          </button>
        )}

        <div className="mb-10 border-solid border">
          <p>Status : {status}</p>
          {status == "authenticated" && (
            <>
              <p>email : {session?.user?.email}</p>
              <p>name : {session?.user?.name}</p>
            </>
          )}
        </div>
      </Box>
    </Container>
  );
}
