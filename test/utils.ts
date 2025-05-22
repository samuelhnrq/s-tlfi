import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const modulePath = fileURLToPath(import.meta.url);

export async function readHtml(filename: string): Promise<string> {
  const buffer = await readFile(join(modulePath, "..", filename));
  return buffer.toString();
}
