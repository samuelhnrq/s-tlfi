import type { Usage } from "@/tlfi-client";
import clsx from "clsx";

function WordDisplay({
  usage,
  parents = [],
  id,
}: {
  usage: Usage;
  id?: string;
  parents?: Usage[];
}) {
  const hasValue = !!usage.definition || !!usage.crochet;
  const orderings = parents.map((x) => x.ordering);
  orderings.push(usage.ordering);
  const ordering = orderings.filter((x) => !!x.trim()).join(". ");
  const hasParents = parents.some((x) => x.crochet || x.definition);
  return (
    <div
      className={clsx(
        {
          "pl-3 border-l-2": hasValue && hasParents,
        },
        "not-first:mt-5 grow"
      )}
      id={id}
    >
      {hasValue && ordering + (ordering ? ". " : "")}
      <i>{usage.crochet}</i>
      {!!usage.definition && !!usage.crochet && " - "}
      {usage.definition}
      <div className={clsx({ "pl-6": hasValue })}>
        {usage.subUsages?.length > 0 &&
          usage.subUsages.map((x) => (
            <WordDisplay
              usage={x}
              key={x.ordering}
              parents={[...parents, usage]}
            />
          ))}
      </div>
      {usage.examples.length > 0 && (
        <>
          <div className="font-bold mt-2 text-md">Examples</div>
          <ul className="list list-disc ml-2">
            {usage.examples.map((x, i) => (
              <li key={i} className="ml-3 list-item">
                &quot;<i>{x.text}</i>&quot; - {x.author} ({x.works} {x.date})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default WordDisplay;
