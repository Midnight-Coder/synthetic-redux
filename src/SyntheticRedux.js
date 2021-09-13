import SyntheticActions from './SyntheticActions';
import SyntheticReducer from './SyntheticReducer';
import SyntheticSagaEffect from './SyntheticSagaEffect';
import { CATEGORY_NAMES } from './constants';


class SyntheticRedux {
  #actions;

  #reducer;

  #sagaEffect;

  #ignite;

  constructor(actionObject, reducerKey) {
    this.#actions = new SyntheticActions(actionObject, CATEGORY_NAMES.CRUD);
    const rKey = reducerKey || this.#actions.igniteName;
    this.#reducer = SyntheticReducer(this.#actions, rKey);
    this.#sagaEffect = SyntheticSagaEffect(this.#actions);
    this.#ignite = this.#actions.ignite;
  }

  get actions() { return this.#actions; }

  get ignite() { return this.#ignite; }

  set ignite(fn) { this.#ignite = fn; }

  get igniteName() { return this.#actions.igniteName; }

  get suffixSyntheticActions() { return this.#actions.suffixSyntheticActions; }

  get suffixNames() { return this.#actions.suffixNames; }

  get reducer() { return this.#reducer; }

  get sagaEffect() { return this.#sagaEffect; }
}

export default SyntheticRedux;
