import { lookupWord } from "@/tlfi-client";
import UsagesTabBar from "./usages-tab-bar";
import { Fragment } from "react";

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
  return (
    <div
      role="tablist"
      className="tabs tabs-border dark:bg-gray-900/40 bg-gray-200/30 p-4 rounded-lg backdrop-blur-xs w-full"
    >
      {definition.map((x, i) => (
        <Fragment key={x.name + i}>
          <input
            type="radio"
            name="word-definitions"
            className="tab"
            defaultChecked={i === 0}
            aria-label={`Définition ${x.name}`}
          />
          <div className="tab-content py-4 px-2">
            <UsagesTabBar usages={x.usages} index={i} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default WordDetail;
