import type { Definition } from "@/tlfi-client";
import React from "react";
import WordDisplay from "./word-display";

function Definition({ definition }: { definition: Definition }) {
  return (
    <div>
      <h1
        className="font-display text-6xl ml-6 mb-8 mt-12 truncate capitalize w-full"
        style={{ lineHeight: 1.2 }}
      >
        {definition.name.toLocaleLowerCase()}
      </h1>
      <div className="card dark:bg-gray-900/40 bg-gray-200/30 p-4 rounded-lg backdrop-blur-xs flex-col">
        {definition.usages.map((usage, i) => (
          <WordDisplay
            key={usage.ordering}
            id={`${definition.name}-${i}`}
            usage={usage}
          />
        ))}
      </div>
    </div>
  );
}

export default Definition;
