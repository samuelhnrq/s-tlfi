import { lookupWord } from "@/tlfi-client";
import DefinitionsBar from "./definitions-bar";

export const revalidate = 60;
export const dynamicParams = true; // or false, to 404 on unknown paths

async function WordDetail({ params }: { params: Promise<{ word: string }> }) {
  const { word } = await params;
  const definition = await lookupWord(word);
  if (definition.length === 0) {
    return (
      <div className="self-center text-center">
        Word &quot;{word}&quot; not found
      </div>
    );
  }
  return definition.map((x, i) => (
    <div key={x.name + i} id={`${x.name}-${i}`} className="w-full">
      <h1
        className="font-display text-6xl ml-6 mb-8 mt-12 truncate capitalize w-full"
        style={{ lineHeight: 1.2 }}
      >
        {x.name.toLocaleLowerCase()}
      </h1>
      <DefinitionsBar usages={x.usages} />
    </div>
  ));
}

export default WordDetail;
