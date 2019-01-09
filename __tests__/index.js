import { createStore, applyMiddleware } from "redux";
import createLandMiddleware from "../src/index";

describe("land middleware", async () => {
  it("must return function", async () => {
    const landMiddleware = createLandMiddleware();
    const nextHandler = landMiddleware({ getState: {} });
    expect(typeof nextHandler).toBe("function");
    expect(typeof nextHandler()).toBe("function");
  });

  it("dispatch common action", () => {
    const landMiddleware = createLandMiddleware();
    const reducer = (state = 0, action) => {
      switch (action.type) {
        case "FOO":
          return 1;
        default:
          return state;
      }
    };
    const store = createStore(reducer, applyMiddleware(landMiddleware));
    expect(store.getState()).toBe(0);
    store.dispatch({ type: "FOO" });
    expect(store.getState()).toBe(1);
  });

  it("dispatch action in middleware", async () => {
    const asyncFoo = async function*({ state, action }) {
      yield await { type: "FOO" };
    };
    const ASYNCFOO = "ASYNCFOO";
    const landMiddleware = createLandMiddleware({
      [ASYNCFOO]: asyncFoo
    });
    const reducer = (state = 0, action) => {
      switch (action.type) {
        case "FOO":
          return 1;
        default:
          return state;
      }
    };
    const store = createStore(reducer, applyMiddleware(landMiddleware));
    expect(store.getState()).toBe(0);
    store.dispatch({
      type: ASYNCFOO
    });
    setTimeout(() => {
      expect(store.getState()).toBe(1);
    }, 0);
  });

  describe("advanced usage", async () => {
    it("combine lands", async () => {
      const FIRST = "FIRST";
      const SECOND = "SECOND";

      const first = async function*({ state, action }) {
        yield await {
          type: "A"
        };
      };
      const landsA = {
        [FIRST]: first
      };
      const second = async function*({ state, action }) {
        yield await {
          type: "B"
        };
      };
      const landsB = {
        [SECOND]: second
      };
      const lands = {
        ...landsA,
        ...landsB
      };
      const landMiddleware = createLandMiddleware(lands);
      const reducer = (state = 0, action) => {
        switch (action.type) {
          case "A":
            return 1;
          case "B":
            return 2;
          default:
            return state;
        }
      };

      const store = createStore(reducer, applyMiddleware(landMiddleware));
      expect(store.getState()).toBe(0);
      store.dispatch({type: FIRST});
      setTimeout(() => {
        expect(store.getState()).toBe("A");
      }, 0);
      store.dispatch({type: SECOND});
      setTimeout(() => {
        expect(store.getState()).toBe("B");
      }, 0);
    });
  });
});
