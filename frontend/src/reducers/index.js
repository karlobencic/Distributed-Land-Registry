import * as handlers from './handlers';
import * as types from '../actions/types';

const createReducer = handlers => (state, action) => {
    if (!handlers.hasOwnProperty(action.type)) {
        return state;
    }

    return handlers[action.type](state, action);
};

export default createReducer({
    [types.SHOW_LAND]: handlers.showLand,
});
