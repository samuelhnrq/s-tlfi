import { lookupWord } from "@/tlfi-client";
import WordDisplay from "./word-display";

export const revalidate = 60;
export const dynamicParams = true; // or false, to 404 on unknown paths

async function WordDetail({ params }: { params: Promise<{ word: string }> }) {
  const { word } = await params;
  const definition = await lookupWord(word);
  console.log(definition);
  if (definition.length === 0) {
    return (
      <div className="self-center text-center">
        Word &quot;{word}&quot; not found
      </div>
    );
  }
  return definition.map((x, i) => (
    <div key={x.name + i} id={`${x.name}-${i}`}>
      <h1
        className="font-display text-6xl ml-6 mb-8 mt-12 truncate capitalize w-full"
        style={{ lineHeight: 1.2 }}
      >
        {x.name.toLocaleLowerCase()}
      </h1>
      <div className="card dark:bg-gray-900/40 bg-gray-200/30 p-4 rounded-lg backdrop-blur-xs flex-col">
        {x.usages.map((x) => (
          <WordDisplay key={x.ordering} usage={x} />
        ))}
      </div>
    </div>
  ));
}

export default WordDetail;
