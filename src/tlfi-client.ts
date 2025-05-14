import { load, type Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";
import ky from "ky";
import { unstable_cache } from "next/cache";
import { z } from "zod";

const example = z.object({
  text: z.string().trim(),
  author: z.string().trim(),
  works: z.string().trim(),
  date: z.string().trim(),
});

const baseUsage = z.object({
  name: z.string().trim(),
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

type Example = z.infer<typeof example>;

function clearStr(txt: string): string {
  return txt
    .replaceAll(/\s{2,}/gm, " ")
    .replaceAll(/([,\.\-\)\(])\1+/g, "$1")
    .replaceAll(/^\s*[,\-\.\(\)]\s*|\s*[\.,\-\(\)]\s*$/g, "");
}

function cleanOrdering(txt: string): string {
  return txt.replaceAll(/[\−\-\.)(]+/g, "");
}

function toExample(elem: Cheerio<AnyNode>): Example {
  return {
    works:
      clearStr(elem.find(".tlf_ctitre").remove().text()) +
      clearStr(elem.contents().last().remove().text()),
    date: clearStr(elem.find(".tlf_cdate").remove().text()),
    author: clearStr(elem.find(".tlf_cauteur").remove().text()),
    text: clearStr(elem.text()),
  };
}

function toBaseUsage(elem: Cheerio<AnyNode>): Usage {
  const parentHeader = elem
    .parentsUntil("#lexicontent")
    .find(".tlf_cvedette")
    .clone();
  const parentName = parentHeader.find(".tlf_cmot").contents().first().text();
  parentHeader.find(".tlf_cmot").remove();
  return {
    name: clearStr(`${parentName} (${parentHeader.text().trim()})`),
    crochet: elem.children(".tlf_ccrochet").text(),
    definition: clearStr(elem.children(".tlf_cdefinition").first().text()),
    ordering: cleanOrdering(elem.children(".tlf_cplan").text()),
    footnotes: clearStr(elem.children(".tlf_parothers").text()),
    subUsages: [],
    examples: elem
      .children(".tlf_cexemple")
      .toArray()
      .map((x) => toExample(elem.find(x))),
  };
}

function usagesInLevel(parent: Cheerio<AnyNode>): Usage[] {
  const usages: Usage[] = [];
  for (const usageElem of parent.children(".tlf_parah")) {
    const elem = parent.find(usageElem);
    const subs = elem.children(".tlf_parah").toArray();
    const next: Usage = {
      ...toBaseUsage(elem),
      subUsages: subs.map((x) => toBaseUsage(parent.find(x))),
    };
    for (let i = 0; i < subs.length; i++) {
      next.subUsages[i].subUsages = usagesInLevel(parent.find(subs[i]));
    }
    usages.push(next);
  }
  return usages;
}

const fetchWord = unstable_cache(
  async (word: string, nth: number): Promise<string> => {
    const url = `https://www.cnrtl.fr/definition/${word}/${nth}?ajax=true`;
    console.log("fetching");
    const definition = await ky(url).text();
    console.log("fetched and loaded", word, url);
    return definition;
  }
);

async function tabNames(word: string) {
  const definition = await fetchWord(word, 0);
  const $ = load(definition);
  const names: string[] = [];
  $("#vtoolbar li").each((_, elem) => {
    const name = $(elem).text().trim();
    if (name) {
      names.push(name);
    }
  });
  return names;
}

async function lookupWord(word: string, page: number): Promise<Usage[]> {
  const usages: Usage[] = [];
  const definition = await fetchWord(word, page);
  const $ = load(definition);
  if (page >= $("#vtoolbar li").length) {
    throw new Error("Page not found");
  }
  const contentRoot = $("#lexicontent");
  for (const defRoot of contentRoot.children()) {
    const elem = $(defRoot);
    if (elem.children(".tlf_cdefinition").length > 0) {
      console.log("Father is itself a definition");
      usages.push(toBaseUsage(elem));
    }
    usages.push(...usagesInLevel(elem));
  }

  return usage.array().parse(usages);
}

export { lookupWord, tabNames };
