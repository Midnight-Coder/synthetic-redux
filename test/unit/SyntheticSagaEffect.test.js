import Logger from 'components/Common/Logger';
import SyntheticAction from 'syntheticRedux/SyntheticActions';
import SyntheticSagaEffect from 'syntheticRedux/SyntheticSagaEffect';
import http from 'utils/http';
import { CATEGORY_NAMES, ERROR_SUFFIX, SUCCESS_SUFFIX } from 'syntheticRedux/constants';
import { call, put } from 'redux-saga/effects';


describe('Synthetic Saga Effect', () => {
  /*
    * This test suite accesses bits of redux-saga internal implementations
    * The internals could change with library upgrades
  */
  const sampleAction = 'SAMPLE_ACTION';
  const syntheticAction = new SyntheticAction({ type: sampleAction }, CATEGORY_NAMES.CRUD);
  const ignitedAction = syntheticAction.ignite({
    errorMeta: 'Fetching Sample Response',
    method: http.post,
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

  it('should use http methods with action parameters passed', () => {
    expect(sagaFn.next().value).toEqual(call(http.post, ignitedAction.url, ignitedAction.payload));
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

  it('should log API errors', () => {
    const spy = jest.spyOn(Logger, 'error').mockImplementation(x => x);
    const apiResponse = { error: 'some-error' };
    sagaFn.next();
    sagaFn.next(apiResponse);
    expect(spy).toHaveBeenCalled();
  });

  it('should include errorMeta for logs', () => {
    const spy = jest.spyOn(Logger, 'error').mockImplementation(x => x);
    const apiResponse = { error: 'some-error' };
    sagaFn.next();
    sagaFn.next(apiResponse);
    const [errorDetail, errorMeta] = spy.mock.calls[0];
    expect(errorDetail).toContain(ignitedAction.url);
    expect(errorMeta).toEqual(ignitedAction.errorMeta);
  });
});
