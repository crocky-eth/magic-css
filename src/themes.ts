export default {
  default: {
    fontFamily: 'sans-serif',
    colors: ['black', 'white', 'grey'],
    variables: [],
    classes: [],
  },

  get(theme: string) {
    return this[theme];
  },
};
