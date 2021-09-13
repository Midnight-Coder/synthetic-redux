import SyntheticAction from '../../src/SyntheticActions';
import SyntheticReducer from '../../src/SyntheticReducer';
import { CATEGORY_NAMES } from '../../src/constants';


describe('Synthetic Reducer', () => {
  const sampleAction = 'SAMPLE_ACTION';
  const syntheticAction = new SyntheticAction({ type: sampleAction }, CATEGORY_NAMES.CRUD);
  const reducerKey = 'sample';
  let reducer;
  beforeEach(() => {
    reducer = SyntheticReducer(syntheticAction, reducerKey);
  });

  it('should return a reducer fn', () => {
    expect(typeof reducer).toEqual('function');
    let received = reducer(undefined, { type: 'dummy-action' });
    expect(received).not.toMatchObject({ [reducerKey]: expect.anything() });
    received = reducer(undefined, syntheticAction.ignite());
    expect(received).toMatchObject({ [reducerKey]: expect.anything() });
  });

  it(`should set ${CATEGORY_NAMES.IGNITE} to true for base action`, () => {
    const received = reducer(undefined, syntheticAction.ignite());
    expect(received[reducerKey][CATEGORY_NAMES.IGNITE]).toBeTruthy();
  });

  it(`should reset ${CATEGORY_NAMES.IGNITE} for suffix actions`, () => {
    const suffixName = syntheticAction.suffixNames[0];
    const suffixAction = syntheticAction.suffixSyntheticActions[suffixName].generator;
    const received = reducer(undefined, suffixAction());
    expect(received[reducerKey]).toBeUndefined();
  });

  it('should return "payload" for suffix actions', () => {
    const suffixName = syntheticAction.suffixNames[0];
    const suffixAction = syntheticAction.suffixSyntheticActions[suffixName].generator;
    const payload = { someList: [] };
    const received = reducer(undefined, suffixAction({ payload }));
    expect(received).toMatchObject({ [reducerKey]: payload });
  });
});
