import SyntheticSagaEffect from '../../src/SyntheticSagaEffect';
import SyntheticAction from '../../src/SyntheticActions';
import { CATEGORY_NAMES, ERROR_SUFFIX, SUCCESS_SUFFIX } from '../../src/constants';
import { call, put } from 'redux-saga/effects';


describe('Synthetic Saga Effect', () => {
  /*
    * This test suite accesses bits of redux-saga internal implementations
    * The internals could change with library upgrades
  */
  const httpPost = (url, payload) => ({url, payload});

  const sampleAction = 'SAMPLE_ACTION';
  const syntheticAction = new SyntheticAction({ type: sampleAction }, CATEGORY_NAMES.CRUD);
  const ignitedAction = syntheticAction.ignite({
    errorMeta: 'Fetching Sample Response',
    method: httpPost,
    payload: 'some-filters',
    url: 'some-url',
  });
  let sagaEffect;
  let sagaFn;
  beforeEach(() => {
    sagaEffect = SyntheticSagaEffect(syntheticAction);
    sagaFn = sagaEffect.payload.args[1](ignitedAction);
  });

  it('should return an effect', () => {
    const effectInvoked = '@@redux-saga/IO';
    expect(sagaEffect).toMatchObject({ [effectInvoked]: true });
  });

  it('should use "takeLatest"', () => {
    expect(sagaEffect.payload.fn.name).toEqual('takeLatest');
  });

  it('should be invoked for IGNITE SyntheticAction', () => {
    expect(sagaEffect.payload.args[0]).toEqual(syntheticAction.igniteName);
  });

  it('should use http method with action parameters passed', () => {
    expect(sagaFn.next().value).toEqual(call(httpPost, ignitedAction.url, ignitedAction.payload));
  });

  it('should invoke success generator with response', () => {
    const apiResponse = { someList: [] };
    const suffixActions = syntheticAction.suffixSyntheticActions;
    const successAction = suffixActions[`${syntheticAction.igniteName}${SUCCESS_SUFFIX}`];
    sagaFn.next();
    expect(sagaFn.next(apiResponse).value).toEqual(
      put(successAction.generator({ payload: apiResponse })),
    );
    expect(sagaFn.next().done).toEqual(true);
  });

  it('should recognize "error" response from API', () => {
    const apiResponse = { error: 'some-error' };
    const suffixActions = syntheticAction.suffixSyntheticActions;
    const errorAction = suffixActions[`${syntheticAction.igniteName}${ERROR_SUFFIX}`];
    sagaFn.next();
    expect(sagaFn.next(apiResponse).value).toEqual(
      put(errorAction.generator({ payload: apiResponse })),
    );
    expect(sagaFn.next().done).toEqual(true);
  });

  it('should await for response before triggering error or success', function () {
    let e;
    try { return e.error; }
    catch(err) { e = err; }
    const exceptionResponse = { payload: { exception: e }};
    const suffixActions = syntheticAction.suffixSyntheticActions;
    const errorAction = suffixActions[`${syntheticAction.igniteName}${ERROR_SUFFIX}`];
    sagaFn.next();
    expect(sagaFn.next().value).toEqual(
      put(errorAction.generator(exceptionResponse)),
    );
    expect(sagaFn.next().done).toEqual(true);
  });
});
