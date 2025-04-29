import { lookupWord } from "@/tlfi-client";
import WordDisplay from "./word-display";

export const revalidate = 60;
export const dynamicParams = true; // or false, to 404 on unknown paths

async function WordDetail({ params }: { params: Promise<{ word: string }> }) {
  const { word } = await params;
  const definition = await lookupWord(word);
  return definition.map((x) => (
    <div key={x.name}>
      <h1
        className="font-display text-6xl ml-6 mb-8 mt-12 truncate capitalize"
        style={{ lineHeight: 1.2 }}
      >
        {x.name.toLocaleLowerCase()}
      </h1>
      <div className="card bg-base-200/40 p-4 rounded-lg backdrop-blur-xs">
        {x.usages.map((x) => (
          <WordDisplay key={x.ordering} usage={x} />
        ))}
      </div>
    </div>
  ));
}

export default WordDetail;
