import { load } from "cheerio";
import ky from "ky";
import sanitize from "sanitize-html";

export const revalidate = 60;
export const dynamicParams = true; // or false, to 404 on unknown paths

async function WordDetail({ params }: { params: Promise<{ word: string }> }) {
  const { word } = await params;
  const definition = await ky(`https://www.cnrtl.fr/definition/${word}`).text();
  const $ = load(definition);
  const content = $("#lexicontent").html();
  if (!content) {
    return "No Content";
  }
  return (
    <>
      <h1 className="font-display text-6xl ml-4 my-10 truncate capitalize">
        {word}
      </h1>
      <div className="card bg-base-200/40 p-4 rounded-lg backdrop-blur-xs">
        <div dangerouslySetInnerHTML={{ __html: sanitize(content) }}></div>
      </div>
    </>
  );
}

export default WordDetail;
