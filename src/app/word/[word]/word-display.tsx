import type { Usage } from "@/tlfi-client";
import clsx from "clsx";

function WordDisplay({
  usage,
  ordering = "",
}: {
  usage: Usage;
  ordering?: string;
}) {
  const ord = `${ordering} ${usage.ordering}`;
  return (
    <div className={clsx({ "mb-4 mt-5": !!usage.definition })}>
      {!!usage.definition && ord} {usage.crochet}
      {usage.definition}
      {usage.examples.length > 0 && (
        <>
          <div className="font-bold">Par example...</div>
          <ul className="list">
            {usage.examples.map((x, i) => (
              <li key={i} className="ml-3 list-item">
                - {x.text} by {x.author} on {x.works} at {x.date}
              </li>
            ))}
          </ul>
        </>
      )}
      {usage.subUsages && usage.subUsages.length > 0 && (
        <div className="pl-8">
          {usage.subUsages?.map((x) => (
            <WordDisplay usage={x} key={x.ordering} ordering={ord} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WordDisplay;
