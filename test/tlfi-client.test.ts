import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import { it } from "mocha";
import nock from "nock";
import { lookupWord } from "../src/tlfi-client";

const modulePath = fileURLToPath(import.meta.url);
const nocked = () => nock("https://www.cnrtl.fr");

async function readHtml(filename: string): Promise<string> {
  const buffer = await readFile(join(modulePath, "..", filename));
  return buffer.toString();
}

it("should parse simple case", async () => {
  const simpleText = await readHtml("simple.html");
  nocked().get("/definition/lynx/0?ajax=true").reply(200, simpleText);
  const res = await lookupWord("lynx", 0);
  expect(res).not.to.be.null;
});

it("Should parse things correctly", async () => {
  const textExample = await readHtml("example.html");
  nocked().get("/definition/faire/0?ajax=true").reply(200, textExample);
  const res = await lookupWord("faire", 0);
  expect(res)
    .to.be.an("array")
    .of.length(4, "Should have all the definitions")
    .and.property("0")
    .to.be.an("object")
    .and.include({
      name: "FAIRE (verbe trans.)",
      ordering: "I",
      crochet: "[Le suj. désigne un animé]",
      definition: "Donner l'être, l'existence à, être l'auteur de.",
    })
    .and.property("subUsages")
    .to.be.an("array")
    .of.length(7);
});
