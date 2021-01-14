const themes = require('./themes');

class EasyCss {
  constructor({ theme = 'default', fontFamily, colors = [], variables = {} } = {}) {
    const theme = themes[theme];
    this.fontFamily = fontFamily || theme.fontFamily || 'initial';
    this.colors = [...theme.colors, ...colors];
    this.variables = { ...theme.variables, ...variables };
  }

  getStyle() {
    return `
    :root {
      --font-family: ${this.fontFamily};
      ${this.colors
        .map((color) => {
          return typeof color === 'string' ? `--color-${color}: ${color};` : `--color-${color[0]}: ${color[1]};`;
        })
        .join('\n')}
      ${Object.entries(this.variables).map(([key, value]) => {
        return Array.isArray(value) ? `--${key}-${value[0]}: ${value[1]};` : `--${key}: ${value}`;
      })}
    }
    body { font-family: var(--font-family); }
    body * { box-sizing: border-box; }
    h1, h2, h3, h4, h5, p { margin-top: 0; margin-bottom: 0px; }
    a, button, .cursor { cursor: pointer; user-select: none; }
    button { border: none; }
    .center { text-align: center; }
    .flex { display: flex; }
    .flex-all { display: flex; flex-direction: column; justify-content: center; align-items: center; }
    .flex-wrap { display: flex; flex-wrap: wrap; }
    .flex-center { display: flex; align-items: center; }
    .flex-column { display: flex; flex-direction: column; }
    .flex-start { display: flex; align-items: flex-start; }
    .flex-end { display: flex; align-items: flex-end; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .justify-around { justify-content: space-around; }
    .relative { position: relative }
    .fill { position: absolute; left: 0; right: 0; top: 0; bottom: 0; }
    .uppercase { text-transform: uppercase; }
    .bold { font-weight: bold; }
    ${this.colors
      .map((color) => {
        return typeof color === 'string'
          ? `.col-${color} { var(--color-${color}); }`
          : `.col-${color[0]} { var(--color-${color[0]}); }`;
      })
      .join('\n')}
    `;
  }
}

module.exports = EasyCss;
