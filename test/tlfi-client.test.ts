import esmock from "esmock";
import { it, mock } from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";

const modulePath = fileURLToPath(import.meta.url);

async function readHtml(filename: string): Promise<string> {
  const buffer = await readFile(join(modulePath, "..", filename));
  return buffer.toString();
}

it("should parse simple case", async (t) => {
  const textFn = mock.fn(
    () => "",
    () => readHtml("simple.html"),
    { times: 1 }
  );
  const mocked = await esmock<typeof import("../src/tlfi-client")>(
    "../src/tlfi-client",
    {
      ky: {
        default: () => ({ text: textFn }),
      },
    }
  );
  const res = await mocked.lookupWord("lynx");
  t.assert.snapshot(res);
});

it("Should parse things correctly", async (t) => {
  const textFn = mock.fn(
    () => "",
    () => readHtml("example.html"),
    { times: 1 }
  );
  const mocked = await esmock<typeof import("../src/tlfi-client")>(
    "../src/tlfi-client",
    {
      ky: {
        default: () => ({ text: textFn }),
      },
    }
  );
  const res = await mocked.lookupWord("faire");
  t.assert.snapshot(res);
  expect(res)
    .to.be.an("array")
    .of.length(1)
    .and.property("0")
    .to.be.an("object")
    .and.include({ name: "FAIRE" })
    .and.property("usages")
    .to.be.an("array")
    .of.length(4)
    .and.property("0")
    .to.be.an("object")
    .and.include({
      ordering: "I.−",
      crochet: "[Le suj. désigne un animé]",
      definition: "Donner l'être, l'existence à, être l'auteur de",
    })
    .and.property("subUsages")
    .to.be.an("array")
    .of.length(7);
});
