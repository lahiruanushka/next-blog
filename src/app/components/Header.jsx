"use client";

import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { FaMoon, FaSearch, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const theme = "light";
  const currentUser = null;

  useEffect(() => {
    const searchFromUrl = searchParams.get("searchTerm");
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const handleSignout = async () => {
    try {
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set("searchTerm", searchTerm);
    router.push(`/search?${params.toString()}`);
  };

  const toggleTheme = () => {};

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

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture || "/images/default-avatar.png"}
                rounded
                className="w-full"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link href="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            {currentUser.isAdmin && (
              <>
                <Link href="/dashboard?tab=dash">
                  <Dropdown.Item>Dashboard</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
              </>
            )}
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link href="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

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
