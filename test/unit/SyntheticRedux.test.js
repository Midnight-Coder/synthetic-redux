import SyntheticRedux from '../../src/SyntheticRedux';


describe('Synthetic Redux', () => {
  let synRedux;

  beforeEach(() => {
    const mockActionObject = { type: 'SAMPLE_ACTION' };
    const mockReducerKey = 'rKey';
    synRedux = new SyntheticRedux(mockActionObject, mockReducerKey);
  });

  it('should expose getters for reducer', () => {
    expect(synRedux.reducer).toBeDefined();
  });

  it('should expose getters for sagaEffect', () => {
    expect(synRedux.sagaEffect).toBeDefined();
  });

  it('should expose getters for synthetic actions', () => {
    expect(synRedux.actions).toBeDefined();
    expect(synRedux.igniteName).toBeDefined();
    expect(synRedux.suffixNames).toBeDefined();
    expect(synRedux.suffixSyntheticActions).toBeDefined();
  });

  it('should expose getters & setters for custom ignite wrappers', () => {
    const spy = jest.fn();
    expect(synRedux.ignite).toBeDefined();
    synRedux.ignite = spy;
    synRedux.ignite();
    expect(spy).toHaveBeenCalled();
  });

  it('should expose getters & setters for custom reset wrappers', () => {
    const spy = jest.fn();
    expect(synRedux.reset).toBeDefined();
    synRedux.reset = spy;
    synRedux.reset();
    expect(spy).toHaveBeenCalled();
  });
});
