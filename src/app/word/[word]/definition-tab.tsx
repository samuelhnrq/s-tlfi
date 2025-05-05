import type { PropsWithChildren } from "react";

function DefinitionTab({
  children,
}: PropsWithChildren<{ expectedName?: string }>) {
  return (
    <span role="tab" className="tab tab-active">
      {children}
    </span>
  );
}

export default DefinitionTab;
