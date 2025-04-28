"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

function WordSearch() {
  const { push } = useRouter();
  const redirect = useCallback(
    (formdata: FormData) => {
      const target = formdata.get("word")?.toString();
      if (!target) return;
      push(`/word/${target}`);
    },
    [push]
  );
  return (
    <form className="flex gap-4 items-center" action={redirect}>
      <input
        type="text"
        name="word"
        required
        className="input"
        aria-description="Search a word"
        placeholder="Type a word"
      />
      <button className="btn btn-primary">Search</button>
    </form>
  );
}

export default WordSearch;
