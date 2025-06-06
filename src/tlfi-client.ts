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

const baseDefinition = z.object({
  ordering: z.string().trim(),
  crochet: z.string().trim(),
  definition: z.string().trim(),
  examples: z.array(example),
  footnotes: z.string().trim(),
});

export type Definition = z.infer<typeof baseDefinition> & {
  children: Definition[];
};

const definition: z.ZodType<Definition> = baseDefinition.extend({
  children: z.lazy(() => z.array(definition)),
});

const word = z.object({
  name: z.string().trim(),
  definitions: z.array(definition),
});

type Example = z.infer<typeof example>;
export type Word = z.infer<typeof word>;

function clearStr(txt: string): string {
  return txt
    .replaceAll(/\s{2,}/gm, " ")
    .replaceAll(/([,\.\-\)\(])\1+/g, "$1")
    .replaceAll(/^\s*[,\-\.]\s*|\s*[,\-]\s*$/g, "");
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

function toDefinition(elem: Cheerio<AnyNode>): Definition {
  return {
    crochet: elem.children(".tlf_ccrochet").text(),
    definition: clearStr(elem.children(".tlf_cdefinition").first().text()),
    ordering: cleanOrdering(elem.children(".tlf_cplan").text()),
    footnotes: clearStr(elem.children(".tlf_parothers").text()),
    children: [],
    examples: elem
      .find(".tlf_cexemple")
      .toArray()
      .map((x) => {
        const res = toExample(elem.find(x));
        elem.find(x).remove();
        return res;
      }),
  };
}

function usagesInLevel(parent: Cheerio<AnyNode>): Definition[] {
  const usages: Definition[] = [];
  for (const usageElem of parent.children(".tlf_parah")) {
    const elem = parent.find(usageElem);
    const subs = elem.children(".tlf_parah,.tlf_paraputir").toArray();
    const next: Definition = {
      ...toDefinition(elem),
      children: subs.map((x) => toDefinition(parent.find(x))),
    };
    for (let i = 0; i < subs.length; i++) {
      next.children[i].children = usagesInLevel(parent.find(subs[i]));
    }
    usages.push(next);
  }
  return usages;
}

const fetchWord = async (word: string, nth: number): Promise<string> => {
  const url = `https://www.cnrtl.fr/definition/${word}/${nth}?ajax=true`;
  const definition = await ky(url, { cache: "force-cache" }).text();
  return definition;
};

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

async function lookupWord(q: string, page: number): Promise<Word> {
  const definitions: Definition[] = [];
  const definition = await fetchWord(q, page);
  const $ = load(definition);
  if (page >= $("#vtoolbar li").length) {
    throw new Error("Page not found");
  }
  const contentRoot = $("#lexicontent");
  for (const defRoot of contentRoot.children()) {
    const elem = $(defRoot);
    if (elem.children(".tlf_cdefinition").length > 0) {
      definitions.push(toDefinition(elem));
    }
    definitions.push(...usagesInLevel(elem));
  }
  const name = contentRoot.find(".tlf_cvedette").text().trim();

  return word.parse({
    name,
    definitions,
  });
}

export { lookupWord, tabNames };
