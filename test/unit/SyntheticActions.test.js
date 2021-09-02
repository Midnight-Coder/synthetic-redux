import SyntheticAction from 'syntheticRedux/SyntheticActions';
import {
  CATEGORY, CATEGORY_NAMES, ERROR_SUFFIX, SUCCESS_SUFFIX,
} from 'syntheticRedux/constants';


describe('Synthetic Actions', () => {
  const sampleAction = 'SAMPLE_ACTION';
  const syntheticAction = new SyntheticAction({ type: sampleAction }, CATEGORY_NAMES.CRUD);

  it('should default to CRUD category', () => {
    const anotherAction = { type: 'another-sample' };
    const syntheticActionB = new SyntheticAction(anotherAction);
    const expectedSuffixes = CATEGORY[CATEGORY_NAMES.CRUD].map(
      i => `${anotherAction.type}${i.typeSuffix}`,
    );
    expect(syntheticActionB.suffixNames).toBeDefined();
    expect(syntheticActionB.suffixNames).toEqual(expect.arrayContaining(expectedSuffixes));
  });

  it('should return action generator functions', () => {
    expect(typeof syntheticAction.ignite).toBe('function');
    Object.values(syntheticAction.suffixSyntheticActions).forEach(
      i => expect(typeof i.generator).toBe('function'),
    );
  });

  it('should have getter for IGNITE action-string', () => {
    expect(syntheticAction.igniteName).toEqual(sampleAction);
  });

  it('should have getter for IGNITE action', () => {
    expect(syntheticAction.ignite()).toMatchObject({ type: sampleAction });
  });

  it('should pass on all keys of IGNITE action', () => {
    const anotherAction = { type: 'another-sample', errorMeta: 'sample error meta' };
    const syntheticActionB = new SyntheticAction(anotherAction);
    expect(syntheticActionB.ignite()).toMatchObject(anotherAction);
  });

  it('should have getters for auto-generated actions', () => {
    const expectedSuffixes = [`${sampleAction}${ERROR_SUFFIX}`, `${sampleAction}${SUCCESS_SUFFIX}`];
    expect(syntheticAction.suffixNames).toBeDefined();
    expect(syntheticAction.suffixNames).toEqual(expect.arrayContaining(expectedSuffixes));
    expect(syntheticAction.suffixSyntheticActions).toBeDefined();
    expectedSuffixes.forEach((i) => {
      expect(syntheticAction.suffixSyntheticActions[i].generator()).toMatchObject({ type: i });
      expect(syntheticAction.suffixSyntheticActions[i].type).toBe(i);
    });
  });

  it('should work for undefined categories', () => {
    const anotherAction = { type: 'another-sample' };
    const syntheticActionB = new SyntheticAction(anotherAction, 'invalid-category');
    expect(syntheticActionB.ignite()).toMatchObject(anotherAction);
  });
});
