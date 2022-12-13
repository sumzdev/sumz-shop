import { Box, Container } from "@mui/system";
import Image from "next/image";
import { useRouter } from "next/router";

interface LayoutProps {
  admin?: boolean;
  children: React.ReactNode;
}

export default function Layout({ admin, children }: LayoutProps) {
  const router = useRouter();
  return (
    <Container className="flex items-center w-full h-full justify-center">
      {/* header */}
      <Box className="mt-8 items-center flex flex-row justify-center py-14 gap-3 ">
        <Image src="/sumz.svg" alt="Sumz Logo" width={72} height={72} />
        <h2 className="text-4xl font-bold text-center  ">SUMZ</h2>
      </Box>

      <Box className="h-full">{children}</Box>
    </Container>
  );
}
