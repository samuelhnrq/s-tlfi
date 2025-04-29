import { load, type Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";
import ky from "ky";
import { z } from "zod";

const example = z.object({
  text: z.string().trim(),
  author: z.string().trim(),
  works: z.string().trim(),
  date: z.string().trim(),
});

const baseUsage = z.object({
  ordering: z.string().trim(),
  crochet: z.string().trim(),
  definition: z.string().trim(),
  examples: z.array(example),
  footnotes: z.string().trim(),
});

export type Usage = z.infer<typeof baseUsage> & { subUsages: Usage[] };

const usage: z.ZodType<Usage> = baseUsage.extend({
  subUsages: z.lazy(() => z.array(usage)),
});

const definitionZod = z.object({
  name: z.string().nonempty().trim(),
  usages: z.array(usage),
});

export type Definition = z.infer<typeof definitionZod>;
type Example = z.infer<typeof example>;

function clearStr(txt: string): string {
  return txt
    .replaceAll(/\s{2,}/g, " ")
    .replaceAll(/[,\.-]{2,}|\s+[,\.-]+\s+/gm, "")
    .trim()
    .replaceAll(/^[)(,\.−]+\s*|\s*[)(,\.−]+$/gm, " ");
}

function toExample(elem: Cheerio<AnyNode>): Example {
  return {
    works: clearStr(
      elem.find(".tlf_ctitre").remove().text() +
        elem.contents().last().remove().text()
    ),
    date: clearStr(elem.find(".tlf_cdate").remove().text()),
    author: clearStr(elem.find(".tlf_cauteur").remove().text()),
    text: clearStr(elem.text()),
  };
}

function toBaseUsage(elem: Cheerio<AnyNode>): Usage {
  return {
    crochet: elem.children(".tlf_ccrochet").text(),
    definition: clearStr(elem.children(".tlf_cdefinition").first().text()),
    ordering: clearStr(elem.children(".tlf_cplan").text()),
    footnotes: clearStr(elem.children(".tlf_parothers").text()),
    subUsages: [],
    examples: elem
      .children(".tlf_cexemple")
      .toArray()
      .map((x) => toExample(elem.find(x))),
  };
}

function extractUsages(parent: Cheerio<AnyNode>): Usage[] {
  const usages: Usage[] = [];
  // if (parent.children(".tlf_cdefinition").length > 0) {
  //   usages.push(toBaseUsage(parent));
  // }
  for (const usageElem of parent.children(".tlf_parah")) {
    const elem = parent.find(usageElem);
    const subs = elem.children(".tlf_parah").toArray();
    const next: Usage = {
      ...toBaseUsage(elem),
      subUsages: subs.map((x) => toBaseUsage(parent.find(x))),
    };
    for (let i = 0; i < subs.length; i++) {
      next.subUsages[i].subUsages = extractUsages(parent.find(subs[i]));
    }
    usages.push(next);
  }
  return usages;
}

async function lookupWord(word: string): Promise<Definition[]> {
  const definitions: Definition[] = [];
  let i = 0;
  while (true) {
    const url = `https://www.cnrtl.fr/definition/${word}/${i++}?ajax=true`;
    console.log("fetching");
    const definition = await ky(url).text();
    const $ = load(definition);
    const contentRoot = $("#lexicontent");
    console.log("fetched and loaded", i, url);
    if (contentRoot.children.length === 0) {
      break;
    }
    for (const defRoot of contentRoot.children()) {
      const elem = $(defRoot);
      definitions.push(
        definitionZod.parse({
          name: elem
            .find(".tlf_cvedette > .tlf_cmot")
            .contents()
            .first()
            .text()
            .replace(/,$/, ""),
          usages: extractUsages($(elem)),
        } satisfies Definition)
      );
    }
    if (i >= $("#vtoolbar li").length) {
      break;
    }
  }
  return definitions;
}

export { lookupWord };
