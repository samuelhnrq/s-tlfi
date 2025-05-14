import { redirect } from "next/navigation";

type WordDetailParams = { word: string };

async function WordRedirectPage({
  params,
}: {
  params: Promise<WordDetailParams>;
}) {
  const { word } = await params;
  redirect(`/word/${word}/1`);
}

export default WordRedirectPage;
