"use client";

import { Button, Navbar, TextInput } from "flowbite-react";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { dark, light } from "@clerk/themes";
import { MdDashboard } from "react-icons/md";
import { HiOutlineDocumentText, HiOutlinePlusCircle } from "react-icons/hi";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { theme, setTheme } = useTheme();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchFromUrl = searchParams.get("searchTerm");
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("searchTerm", searchTerm);
    router.push(`/search?${params.toString()}`);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Navbar className="border-b-2">
      <Link
        href="/"
        className="inline-block transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 active:scale-95"
      >
        <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:shadow-md">
          ByteThoughts
        </div>
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          className="hidden lg:inline-block rounded-md p-2"
          rightIcon={FaSearch}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Button
        className="w-12 h-10 lg:hidden"
        color="gray"
        pill
        onClick={() => router.push("/search")}
      >
        <FaSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 sm:inline"
          color="gray"
          pill
          onClick={toggleTheme}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>

        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: theme === "light" ? light : dark,
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Dashboard"
                labelIcon={<MdDashboard size={16} />}
                href="/dashboard?tab=dash"
              />
              <UserButton.Link
                label="My Posts"
                labelIcon={<HiOutlineDocumentText size={16} />}
                href="/dashboard?tab=posts"
              />
              <UserButton.Link
                label="Create Post"
                labelIcon={<HiOutlinePlusCircle size={16} />}
                href="/dashboard?tab=create-post"
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>

        <SignedOut>
          <Link href="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        </SignedOut>

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Link href="/">
          <Navbar.Link active={pathname === "/"} as={"div"}>
            Home
          </Navbar.Link>
        </Link>
        <Link href="/about">
          <Navbar.Link active={pathname === "/about"} as={"div"}>
            About
          </Navbar.Link>
        </Link>
        <Link href="/favorites">
          <Navbar.Link active={pathname === "/favorites"} as={"div"}>
            Favorites
          </Navbar.Link>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
