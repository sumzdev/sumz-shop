import { Button, Container, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

type ApiLoginBody = {
  email: String;
  password: String;
};

const loginHelper = {
  email: {
    required: "이메일을 입력해 주세요",
    pattern: "올바른 이메일 형식을 입력해 주세요",
  },
  password: {
    required: "비밀번호를 입력해 주세요",
    notEqual: "비밀번호가 일치하지 않습니다.",
  },
};

export default function Enter() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    handleSubmit,
    control,
    register,
    formState: errors,
  } = useForm<ApiLoginBody>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (body: ApiLoginBody) => {
      try {
        console.log(body);
        const result = await signIn("sumz", {
          redirect: false,
          ...body,
          email: body.email,
          password: body.password,
        });
        if (result?.error) {
          console.log("에러", result.error);
        }
        console.log("로그인 성공");
        router.push("/");
      } catch (error) {
        console.log("에러", error);
      }
    },
    [router]
  );

  return (
    <Container className="flex items-center w-full justify-center">
      <Box className="mt-8 items-center flex flex-row justify-center py-14 gap-3 ">
        <Image src="/sumz.svg" alt="Sumz Logo" width={72} height={72} />
        <h2 className="text-4xl font-bold text-center  ">SUMZ</h2>
      </Box>

      <Box className="flex flex-col items-center gap-4 md:w-3/4 lg:w-1/2 mx-auto">
        <form
          className="flex flex-col items-center gap-4 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: { value: true, message: loginHelper.email["required"] },
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: loginHelper.email["pattern"],
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="이메일"
                id="email"
                autoComplete="email"
                fullWidth
                autoFocus
                error={!!error}
                helperText={error ? error.message : ""}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: {
                value: true,
                message: loginHelper.password["required"],
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                id="password"
                label="비밀번호"
                type="password"
                autoComplete="current-password"
                fullWidth
                error={!!error}
                helperText={error ? error.message : ""}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, py: 1.7 }}
          >
            로그인
          </Button>
        </form>

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
