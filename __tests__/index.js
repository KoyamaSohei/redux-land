import createLandMiddleware from "../src/index";

describe("land middleware", async () => {
  it("must return function", async () => {
    const landMiddleware = createLandMiddleware();
    const nextHandler = landMiddleware({ getState: {} });
    expect(typeof nextHandler).toBe("function");
    expect(typeof nextHandler()).toBe("function");
  });
});
