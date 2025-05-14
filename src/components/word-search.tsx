"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";

function WordSearch() {
  const { push } = useRouter();
  const [, action, loading] = useActionState<undefined, FormData>(
    (_ignored, formdata: FormData): undefined => {
      const target = formdata.get("word")?.toString();
      if (!target) return;
      push(`/word/${target}/1`);
    },
    undefined
  );
  return (
    <form className="flex gap-4 items-center" action={action}>
      <input
        type="text"
        name="word"
        required
        className="input"
        aria-label="Cherchez"
        placeholder="Taper une mot"
      />
      <button className="btn btn-primary" disabled={loading}>
        Cherchez
      </button>
    </form>
  );
}

export default WordSearch;
