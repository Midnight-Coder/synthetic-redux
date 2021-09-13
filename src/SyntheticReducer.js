import { CATEGORY_NAMES } from './constants';


const SyntheticReducer = (syntheticAction, objKey) => (state = {}, action) => {
  if (action.type === syntheticAction.igniteName) {
    return {
      ...state,
      [objKey]: { [CATEGORY_NAMES.IGNITE]: true },
    };
  }
  if (syntheticAction.suffixNames.includes(action.type)) {
    return {
      ...state,
      [objKey]: action.payload,
    };
  }
  return state;
};

export default SyntheticReducer;
