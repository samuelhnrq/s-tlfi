import { redirect, RedirectType } from "next/navigation";

async function redirectToWord(formdata: FormData) {
  "use server";
  const target = formdata.get("word");
  if (!target) {
    return;
  }
  redirect(`/word/${target}`, RedirectType.push);
}

function WordSearch() {
  return (
    <form className="flex gap-4 items-center" action={redirectToWord}>
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
