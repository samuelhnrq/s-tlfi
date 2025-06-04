import { lookupWord, type Definition } from "@/tlfi-client";
import WordDisplay from "@/components/word-display";
import React from "react";

export const revalidate = 60;
export const dynamicParams = true; // or false, to 404 on unknown paths

type WordDetailParams = { word: string; definition: string };

async function WordDetail({ params }: { params: Promise<WordDetailParams> }) {
  const { word, definition: defStr } = await params;
  const definitionNumber = parseInt(defStr, 10) - 1;
  let definition: Definition[] = [];
  try {
    definition = (await lookupWord(word, definitionNumber)).definitions;
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
        <WordDisplay definition={x} key={x.ordering + i} />
      ))}
    </>
  );
}

export default WordDetail;
