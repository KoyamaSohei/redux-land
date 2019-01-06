import { Middleware, AnyAction, Dispatch, Store } from "redux";

export type Land<State, Action extends AnyAction,O = AnyAction> = (
  args: { state: State; action: Action }
) => AsyncIterableIterator<O>;

export type Lands = {
  [key: string]: Land<any, any>;
};

export declare function createLandMiddleware(
  lands: Lands
): Middleware<{}, any, Dispatch>;

export default createLandMiddleware;