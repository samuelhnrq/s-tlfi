import type { Definition } from "@/tlfi-client";
import clsx from "clsx";
import React from "react";

function WordDisplay({
  definition,
  parents = [],
  id,
}: {
  definition: Definition;
  id?: string;
  parents?: Definition[];
}) {
  const hasValue = !!definition.definition || !!definition.crochet;
  const orderings = parents.map((x) => x.ordering).filter((x) => !!x.trim());
  orderings.push(definition.ordering, "");
  const ordering = orderings.join(". ").replace(/\.$|(\.)\.+/g, "$1");
  const hasParents = parents.some((x) => x.crochet || x.definition);
  const hasChildren = definition.children?.length > 0;
  return (
    <div
      className={clsx(
        {
          "pl-3 border-l-2": hasValue && hasParents,
        },
        "not-first:mt-5 grow leading-6"
      )}
      id={id}
    >
      {hasValue && ordering}
      {definition.crochet && <i>{definition.crochet}</i>}
      {!!definition.definition && !!definition.crochet && " - "}
      <span>{definition.definition}</span>
      <div className={clsx({ "pl-6 mt-3": hasValue && hasChildren })}>
        {hasChildren &&
          definition.children.map((x, i) => (
            <WordDisplay
              definition={x}
              key={x.ordering + i}
              parents={[...parents, definition]}
            />
          ))}
      </div>
      {definition.examples.length > 0 && (
        <>
          <div className="font-bold mt-2 text-md">Examples</div>
          <ul className="list list-disc ml-2">
            {definition.examples.map((x, i) => (
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
