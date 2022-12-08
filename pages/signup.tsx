import { Button, TextField } from "@mui/material";
import { Box, Container } from "@mui/system";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  return (
    <Container className="flex items-conter w-full justify-center">
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
          autoFocus
        />

        <TextField
          fullWidth
          required
          id="password"
          label="비밀번호"
          name="password"
          type="password"
        />

        <TextField
          fullWidth
          required
          id="password-confirm"
          label="비밀번호 확인"
          name="password-confirm"
          type="password"
        />

        <TextField
          fullWidth
          required
          id="name"
          label="닉네임"
          name="name"
          autoFocus
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, py: 1.7 }}
        >
          회원가입
        </Button>

        <Button className="self-end">
          <Link href="/enter">로그인</Link>
        </Button>
      </Box>
    </Container>
  );
}
