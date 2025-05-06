import type { Usage } from "@/tlfi-client";
import WordDisplay from "./word-display";
import { Fragment } from "react";

function DefinitionsBar({ usages }: { usages: Usage[] }) {
  return (
    <div
      role="tablist"
      className="tabs tabs-border dark:bg-gray-900/40 bg-gray-200/30 p-4 rounded-lg backdrop-blur-xs w-full"
    >
      {usages.map((usage) => (
        <Fragment key={usage.ordering}>
          <input
            type="radio"
            name="word_definitions"
            className="tab"
            aria-label={`Tab ${usage.ordering}`}
          />
          <div className="tab-content">
            <WordDisplay usage={usage} key={usage.ordering} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default DefinitionsBar;
