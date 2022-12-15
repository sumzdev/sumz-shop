import { Box, Container } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import FloatingButton from "./floating-button";

interface LayoutProps {
  admin?: boolean;
  login?: boolean;
  children: React.ReactNode;
}

export default function Layout({ admin, login, children }: LayoutProps) {
  const router = useRouter();

  return (
    <Container className="flex items-center w-full h-full justify-center">
      <div className="my-14 flex items-center justify-center">
        <Link
          href="/"
          className="flex flex-row items-center justify-center gap-3"
        >
          <Image src="/sumz.svg" alt="Sumz Logo" width={72} height={72} />
          <p className="text-4xl font-bold text-center  ">SUMZ</p>
        </Link>
      </div>

      <Box className="h-full w-full">{children}</Box>
    </Container>
  );
}
