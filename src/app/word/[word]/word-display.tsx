import type { Usage } from "@/tlfi-client";
import clsx from "clsx";

function WordDisplay({
  usage,
  child = false,
}: {
  usage: Usage;
  child?: boolean;
}) {
  const hasValue = !!usage.definition || !!usage.crochet;
  return (
    <div
      className={clsx(
        {
          "pl-3 border-l-2": hasValue && child,
        },
        "not-first:mt-5 grow"
      )}
    >
      {hasValue && usage.ordering + ") "}
      <i>{usage.crochet}</i>
      {!!usage.definition && !!usage.crochet && " - "}
      {usage.definition}

      <div className={clsx({ "pl-6": hasValue })}>
        {usage.subUsages?.length > 0 &&
          usage.subUsages.map((x) => (
            <WordDisplay usage={x} key={x.ordering} child />
          ))}
      </div>

      {usage.examples.length > 0 && (
        <>
          <div className="font-bold mt-2 text-md">Examples</div>
          <ul className="list list-disc ml-2">
            {usage.examples.map((x, i) => (
              <li key={i} className="ml-3 list-item">
                "<i>{x.text}</i>" - {x.author} ({x.works} {x.date})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default WordDisplay;
