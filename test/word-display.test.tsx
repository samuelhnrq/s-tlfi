import { expect } from "chai";
import { render, screen } from "@testing-library/react";
import { it } from "mocha";
import nock from "nock";
import WordDetail from "@/app/word/[word]/[definition]/page";
import { readHtml } from "./utils";

const nocked = () => nock("https://www.cnrtl.fr");

it("should render the WordDetail component correctly", async () => {
  nocked()
    .get("/definition/test/0?ajax=true")
    .reply(200, await readHtml("simple.html"));

  const params = Promise.resolve({
    // Mocking the params prop
    word: "test",
    definition: "1",
  });

  render(await WordDetail({ params }));

  // Check if the WordDisplay component is rendered
  expect(
    screen.getByText("Bacchus ivre et traîné par des lynx", {
      exact: false,
    })
  ).to.be.visible;

  // Check if the WordDisplay component is rendered
  expect(
    screen.getByText("regard de lynx", {
      exact: false,
    })
  ).to.be.visible;
});
