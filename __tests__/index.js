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

  it("dispatch action in middleware", async (done) => {
    const asyncFoo = async function*({ state, action }) {
      yield { type: "FOO" };
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
      done();
    }, 0);
  });
  
  describe("advanced usage", async () => {
    it("combine lands", async (done) => {
      const FIRST = "FIRST";
      const SECOND = "SECOND";

      const first = async function*({ state, action }) {
        yield {
          type: "A"
        };
      };
      const landsA = {
        [FIRST]: first
      };
      const second = async function*({ state, action }) {
        yield {
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
      store.dispatch({ type: FIRST });
      setTimeout(() => {
        expect(store.getState()).toBe(1);
        store.dispatch({ type: SECOND });
      }, 100);
      
      setTimeout(() => {
        expect(store.getState()).toBe(2);
        done();
      }, 200);
    });

    it("dispatched action's order", async (done) => {
      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      const type = {
        MAIN: "MAIN",
        TOB: "TOB",
        TOC: "TOC",
        FLAG: "FLAG",
        FINISH: "FINISH"
      };
      const main = async function*({ state, action }) {
        yield {
          type: type.TOB
        };
        yield {
          type: type.TOC
        };
      };
      const toB = async function*({ state, action }) {
        sleep(1000);
        yield {
          type: type.FLAG
        };
      };
      const toC = async function*({ state, action }) {
        yield {
          type: type.FINISH
        };
      };
      const reducer = (state = { flag: false, finish: false }, action) => {
        switch (action.type) {
          case type.FLAG:
            return { ...state, flag: true };
          case type.FINISH:
            return { ...state, finish: true };
          default:
            return state;
        }
      };
      const landMiddleware = createLandMiddleware({
        [type.MAIN]: main,
        [type.TOB]: toB,
        [type.TOC]: toC
      });
      const store = createStore(reducer, applyMiddleware(landMiddleware));
      store.subscribe(() => {
        const state = store.getState();
        if (state.finish) {
          expect(state.flag).toBe(true);
        }
      });
      store.dispatch({
        type: type.MAIN
      });
      setTimeout(done,4000);
    });
  });
});
