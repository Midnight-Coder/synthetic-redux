import { CATEGORY, CATEGORY_NAMES } from 'syntheticRedux/constants';


class SyntheticActions {
  #baseAction = {};

  #actionBunch = {};

  constructor(o, category = CATEGORY_NAMES.CRUD) {
    this.#baseAction = {
      generator: this.#buildGenerator(o, CATEGORY[CATEGORY_NAMES.IGNITE].args),
      type: o.type,
    };
    if (CATEGORY[category]) {
      this.#actionBunch = CATEGORY[category].reduce((acc, i) => {
        const actionName = `${o.type}${i.typeSuffix}`;
        return {
          ...acc,
          [actionName]: {
            generator: this.#buildGenerator({ type: actionName }, i.args),
            type: actionName,
          },
        };
      }, {});
    }
  }

  #buildGenerator = (o, argNames = []) => (args = {}) => {
    const returnValue = { ...o };
    argNames.filter(i => Object.prototype.hasOwnProperty.call(args, i))
      .forEach((i) => { returnValue[i] = args[i]; });
    return returnValue;
  };

  get ignite() { return this.#baseAction.generator; }

  get igniteName() { return this.#baseAction.type; }

  get igniteSyntheticActions() { return this.#baseAction; }

  get suffixSyntheticActions() { return this.#actionBunch; }

  get suffixNames() { return Object.keys(this.#actionBunch); }
}

export default SyntheticActions;
