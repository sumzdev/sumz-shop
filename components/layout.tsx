import Image from "next/image";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Badge, Button } from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { UserWithInfo } from "types/session";
import { Role } from "@prisma/client";

interface LayoutProps {
  user?: UserWithInfo;
  children: React.ReactNode;
}

export default function Layout({ user, children }: LayoutProps) {
  return (
    <div className="flex flex-col items-center w-full h-full justify-center">
      <div className="border-b-[1px] w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-end mx-4 sm:mx-10 md:mx-20 justify-between">
          <div className="mt-14 mb-5 flex items-center justify-center">
            <Link
              href="/"
              className="flex flex-row items-center justify-center gap-3 w-[180px]"
            >
              <Image src="/sumz.svg" alt="Sumz Logo" width={72} height={72} />
              <p className="text-4xl font-bold text-center">SUMZ</p>
            </Link>
          </div>

          <div className="flex mt-5 mb-3 justify-end w-full">
            {!!user ? (
              <>
                <Link href={"/profile/cart"}>
                  <Button sx={{ py: 2 }}>
                    <Badge
                      badgeContent={user?.cartlist?.length || 0}
                      color="warning"
                    >
                      <ShoppingCartOutlinedIcon />
                    </Badge>
                  </Button>
                </Link>

                <Link href={"/profile/wishlist"}>
                  <Button sx={{ py: 2 }}>
                    <BookmarkBorderIcon />
                  </Button>
                </Link>

                <Button sx={{ py: 2 }} onClick={() => signOut()}>
                  <LogoutIcon />
                </Button>
              </>
            ) : (
              <div>
                <Link href={"/enter"} className="">
                  <Button>Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-full w-full mt-5">{children}</div>
    </div>
  );
}
