import Layout from "@components/layout";
import useMutation from "@libs/client/useMutation";
import { Button, TextField } from "@mui/material";
import { Box, Container } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface IFormInput {
  email: String;
  password: String;
  passwordConfirm: String;
  name: String;
}

const signupHelper = {
  email: {
    required: "이메일을 입력해 주세요.",
    pattern: "유효한 이메일을 입력해 주세요.",
    duplicate: "이미 사용중인 이메일입니다.",
  },
  password: {
    required: "비밀번호를 입력해 주세요",
    pattern: "8자리 이상 문자와 숫자 조합의 비밀번호를 입력해주세요.",
  },
  passwordConfirm: {
    required: "확인 비밀번호를 입력해주세요",
    notEqual: "비밀번호가 일치하지 않습니다.",
  },
  name: {
    required: "닉네임을 입력해주세요.",
    pattern: "2자리 이상 10자리 이하의 닉네임을 입력해주세요.",
  },
};

export default function Signup() {
  const router = useRouter();
  const { handleSubmit, control, watch, setError } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
    },
    reValidateMode: "onBlur",
  });

  const [user, { loading, data }] = useMutation("/api/users/signup");

  const onSubmit: SubmitHandler<IFormInput> = useCallback(
    (data) => {
      if (loading) return;
      user(data);
    },
    [loading, user]
  );

  useEffect(() => {
    if (data?.message === "duplicate") {
      setError("email", { message: signupHelper.email.duplicate });
    }
    if (data && data.ok) {
      router.push(`/enter`);
    }
  }, [data, router, setError]);

  return (
    <Layout>
      <Container className="flex items-conter w-full justify-center">
        <Box className="md:w-3/4 lg:w-1/2 mx-auto">
          <form
            className="flex flex-col items-center gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: signupHelper.email["required"],
                },
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: signupHelper.email["pattern"],
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Email"
                  autoFocus
                  type="email"
                  fullWidth
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
                  message: signupHelper.password["required"],
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message: signupHelper.password["pattern"],
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />

            <Controller
              name="passwordConfirm"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: signupHelper.passwordConfirm["required"],
                },
                validate: (v) => {
                  if (v !== watch("password")) {
                    return signupHelper.passwordConfirm["notEqual"];
                  }
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Password Confirm"
                  type="password"
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: signupHelper.name["required"],
                },
                pattern: {
                  value: /^\S{2,10}$/,
                  message: signupHelper.name["pattern"],
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Nickname"
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
              회원가입
            </Button>
          </form>

          <Button className="float-right" sx={{ mt: 1 }}>
            <Link href="/enter">로그인</Link>
          </Button>
        </Box>
      </Container>
    </Layout>
  );
}
