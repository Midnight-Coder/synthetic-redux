import { ERROR_SUFFIX, SUCCESS_SUFFIX } from './constants';
import { call, put, takeLatest } from 'redux-saga/effects';


const SyntheticSagaEffect = (syntheticAction) => {
  const suffixActions = syntheticAction.suffixSyntheticActions;
  const errorAction = suffixActions[`${syntheticAction.igniteName}${ERROR_SUFFIX}`];
  const successAction = suffixActions[`${syntheticAction.igniteName}${SUCCESS_SUFFIX}`];
  const igniteAction = syntheticAction.igniteName;

  const sagaFn = function* sagaFn(action) {
    try {
      const response = yield call(action.method, action.url, action.payload);
      if (response.error) {
        if(typeof action.errorHandler === 'function') {
          yield put(action.errorHandler(response, action));
        }
        return yield put(errorAction.generator({ payload: response }));
      }
      else { return yield put(successAction.generator({ payload: response })); }
    }
    catch (exception) { return yield put(errorAction.generator({payload: { exception }})); }
  };
  return takeLatest(igniteAction, sagaFn);
};

export default SyntheticSagaEffect;
