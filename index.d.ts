import { Middleware, AnyAction, Dispatch, Store } from "redux";

export type Land<State, Action extends AnyAction,O = AnyAction,Dependencies = any> = (
  args: { state: State; action: Action },
  dependencies?: Dependencies
) => AsyncIterableIterator<O>;

export type Lands<T = any, S = any> = {
  [key in keyof T]: Land<S, any, any, any>;
};

export declare function createLandMiddleware<T>(
  lands: Lands<T>,
  dependencies?: {
    [key: string]: any;
  }
): Middleware<{}, any, Dispatch>;

export default createLandMiddleware;