import { tabNames } from "@/tlfi-client";
import clsx from "clsx";
import Link from "next/link";

type WordDetailParams = { word: string; definition: string };
type WordDetailProps = {
  params: Promise<WordDetailParams>;
  children: React.ReactNode;
};

async function WordDetail({ params, children }: WordDetailProps) {
  const { word, definition: defStr } = await params;
  const definitionNumber = parseInt(defStr, 10) - 1;
  const pageNames = await tabNames(word);
  return (
    <div className="max-w-full overflow-x-auto my-4">
      <div role="tablist" className="tabs tabs-lift">
        {pageNames.map((pageName, i) => (
          <Link
            key={pageName}
            className={clsx("tab", { "tab-active": i === definitionNumber })}
            defaultChecked={i === 0}
            href={`/word/${word}/${i + 1}`}
          >
            {pageName}
          </Link>
        ))}
      </div>
      <div
        className={clsx(
          "p-6 dark:bg-gray-800/60 bg-gray-100/40",
          "max-w-6xl rounded-b-lg backdrop-blur-xs border-base-300"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default WordDetail;
