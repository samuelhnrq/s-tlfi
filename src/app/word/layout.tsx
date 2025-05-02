import React from "react";
import BackdropLogo from "../../components/backdrop-logo";
import WordSearch from "@/components/word-search";
import Link from "next/link";
import Logo from "../../components/logo";

function WordLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="container max-w-4xl mx-auto py-5 flex flex-col h-screen items-center">
      <nav className="flex justify-between w-full">
        <Link href="/">
          <Logo className="h-8/12" />
        </Link>
        <WordSearch />
      </nav>
      <main className="flex grow flex-col">{children}</main>
      <BackdropLogo />
    </div>
  );
}

export default WordLayout;
