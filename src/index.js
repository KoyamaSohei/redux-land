function createLandMiddleware(lands, dependencies = {}) {
  return ({ getState, dispatch }) => next => async action => {
    next(action);
    const state = getState();
    for (const type in lands) {
      if (action.type == type) {
        const itr = lands[type]({ state, action }, dependencies);
        let _done = false;
        while (!_done) {
          const {value, done} = await itr.next();
          if (!done) dispatch(value);
          _done = done;
        }
      }
    }
  };
}

export default createLandMiddleware;