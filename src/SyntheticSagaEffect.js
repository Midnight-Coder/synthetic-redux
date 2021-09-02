import Logger from 'components/Common/Logger';
import { ERROR_SUFFIX, SUCCESS_SUFFIX } from 'syntheticRedux/constants';
import { call, put, takeLatest } from 'redux-saga/effects';


const SyntheticSagaEffect = (syntheticAction) => {
  const suffixActions = syntheticAction.suffixSyntheticActions;
  const errorAction = suffixActions[`${syntheticAction.igniteName}${ERROR_SUFFIX}`];
  const successAction = suffixActions[`${syntheticAction.igniteName}${SUCCESS_SUFFIX}`];
  const igniteAction = syntheticAction.igniteName;

  const sagaFn = function* sagaFn(action) {
    const response = yield call(action.method, action.url, action.payload);
    if (response.error) {
      Logger.error(`Url: ${action.url}. Error: ${response.error}`, action.errorMeta);
      return yield put(errorAction.generator({ payload: response }));
    }
    else {
      return yield put(successAction.generator({ payload: response }));
    }
  };
  return takeLatest(igniteAction, sagaFn);
};

export default SyntheticSagaEffect;
