import type { Definition } from "@/tlfi-client";
import WordDisplay from "@/components/word-display";
import { Fragment } from "react";

function UsagesTabBar({
  usages,
  index,
}: {
  usages: Definition[];
  index: number;
}) {
  return (
    <div role="tablist" className="tabs tabs-border">
      {usages.map((usage, i) => (
        <Fragment key={usage.ordering}>
          <input
            type="radio"
            name={`word-usage-${index}`}
            className="tab"
            defaultChecked={i === 0}
            aria-label={`Usage ${usage.ordering}`}
          />
          <div className="tab-content py-4 px-2">
            <WordDisplay definition={usage} key={usage.ordering} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default UsagesTabBar;
