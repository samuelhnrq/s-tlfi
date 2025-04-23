import React from "react";
import BackdropLogo from "../../components/backdrop-logo";
import WordSearch from "@/components/word-search";
import Link from "next/link";
import Logo from "../../components/logo";

function WordLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="container max-w-4xl mx-auto my-5">
      <nav className="flex justify-between">
        <Link href="/">
          <Logo className="h-8/12" />
        </Link>
        <WordSearch />
      </nav>
      <main>{children}</main>
      <BackdropLogo />
    </div>
  );
}

export default WordLayout;
