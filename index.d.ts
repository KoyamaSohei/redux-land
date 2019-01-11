import { Middleware, AnyAction, Dispatch, Store } from "redux";

export type Land<State, Action extends AnyAction,O = AnyAction,Dependencies = any> = (
  args: { state: State; action: Action },
  dependencies: Dependencies
) => AsyncIterableIterator<O>;

export type Lands = {
  [key: string]: Land<any, any, any>;
};

export declare function createLandMiddleware(
  lands: Lands,
  dependencies?: {
    [key: string]: any;
  }
): Middleware<{}, any, Dispatch>;

export default createLandMiddleware;