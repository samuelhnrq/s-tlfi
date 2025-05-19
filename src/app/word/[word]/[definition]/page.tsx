import { lookupWord, type Usage } from "@/tlfi-client";
import WordDisplay from "@/components/word-display";

export const revalidate = 60;
export const dynamicParams = true; // or false, to 404 on unknown paths

type WordDetailParams = { word: string; definition: string };

async function WordDetail({ params }: { params: Promise<WordDetailParams> }) {
  const { word, definition: defStr } = await params;
  const definitionNumber = parseInt(defStr, 10) - 1;
  let definition: Usage[] = [];
  try {
    definition = await lookupWord(word, definitionNumber);
  } catch {}
  if (definition.length === 0) {
    return (
      <div className="self-center text-center">
        Word &quot;{word}&quot; not found
      </div>
    );
  }
  return (
    <>
      {definition.map((x, i) => (
        <WordDisplay usage={x} key={x.ordering + i} />
      ))}
    </>
  );
}

export default WordDetail;
