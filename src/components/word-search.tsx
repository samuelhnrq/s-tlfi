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
        aria-label="Cherchez"
        placeholder="Taper une mot"
      />
      <button className="btn btn-primary">Cherchez</button>
    </form>
  );
}

export default WordSearch;
