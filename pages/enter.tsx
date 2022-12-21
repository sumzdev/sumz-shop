import Layout from "@components/layout";
import { Button, Container, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCallback, useState } from "react";
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
  resError: {
    notExist: "존재하지 않는 아이디입니다.",
    other: "소셜 로그인 방식을 이용해 주세요.",
  },
};

export default function Enter() {
  const router = useRouter();
  const [resError, setResError] = useState("");
  const { data: session, status } = useSession();

  const { handleSubmit, control, setError, resetField, reset } =
    useForm<ApiLoginBody>({
      defaultValues: {
        email: "",
        password: "",
      },
    });

  useEffect(() => {
    // 소셜 로그인
    if (status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [router, session, status]);

  const onSubmit = useCallback(
    // email/password 로그인
    async (body: ApiLoginBody) => {
      try {
        const result = await signIn("email-password-credeintials", {
          redirect: false,
          ...body,
          email: body.email,
          password: body.password,
        });

        console.log(result);
        if (!result?.error) {
          console.log("로그인 성공", body.email);
          router.push("/");
        }

        switch (result.error) {
          case "notEqual":
            resetField("password");
            setError("password", { message: loginHelper.password.notEqual });
            break;
          case "notExist":
            reset();
            setResError(loginHelper.resError.notExist);
            break;
          case "other":
            reset();
            setResError(loginHelper.resError.other);
            break;
          default:
            setResError(result.error);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [reset, resetField, router, setError]
  );

  return (
    <Layout>
      <Container className="flex items-center w-full justify-center">
        <Box className="mt-30 flex flex-col items-center gap-4 md:w-3/4 lg:w-1/2 mx-auto">
          <form
            className="flex flex-col items-center gap-4 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: loginHelper.email["required"],
                },
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
            {resError !== "" && <p className="text-red-700">{resError}</p>}
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
      </Container>
    </Layout>
  );
}
