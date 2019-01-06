function createLandMiddleware(land) {
  return ({ getState }) => next => async action => {
    const state = getState();
    for (const type in land) {
      if (action.type == type) {
        for await (const ac of land[type]({ state, action })) {
          next(ac);
        }
      }
    }
    next(action);
  };
}

export default createLandMiddleware;