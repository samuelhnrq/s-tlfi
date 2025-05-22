import * as chai from "chai";
import chaiDom from "chai-dom";
import * as td from "testdouble";
import jsdomSetup from "jsdom-global";
import nock from "nock";

jsdomSetup();
chai.use(chaiDom);

export const mochaHooks = {
  afterEach() {
    td.reset();
    nock.cleanAll();
  },
};
