import Themes from './themes';

interface IMagicCssInitial {
  theme: string;
  fontFamily?: string;
  colors: Value[];
  variables: Value[];
  classes: Value[];
}

interface Properties {
  [key: string]: string;
}
type Property = [string, string];
type Value = String | String[] | Property[] | [string, Property[]];

interface IMagicCss {
  name: string;
  fontFamily: string;
  colors: Value[];
  variables: Value[];
  classes: Value[];
}

class MagicCss implements IMagicCss {
  public name: string = 'MagicCss';
  public fontFamily: string = 'MagicCss';
  public colors: Value[];
  public variables: Value[];
  public classes: Value[];

  constructor(initial: IMagicCssInitial) {
    const { theme = 'default', fontFamily, colors = [], variables = [], classes = [] } = initial;
    const currentTheme = Themes.get(theme) || {};
    this.fontFamily = fontFamily || currentTheme.fontFamily || 'initial';
    this.colors = [...currentTheme.colors, ...colors];
    this.variables = [...currentTheme.variables, ...variables];
    this.classes = [...currentTheme.classes, ...classes];
  }

  getStyle() {
    return `
    :root {
      --font-family: ${this.fontFamily};
      ${this.colors
        .map((color: String) =>
          typeof color === 'string' ? `--color-${color}: ${color};` : `--color-${color[0]}: ${color[1]};`
        )
        .join('\n')}
      ${this.variables
        .map(([key, value]) => (Array.isArray(value) ? `--${key}-${value[0]}: ${value[1]};` : `--${key}: ${value};`))
        .join('\n')}
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
    .normal { font-weight: normal; }
    ${this.colors
      .map((color) =>
        typeof color === 'string'
          ? `.col-${color} { color: var(--color-${color}); } .bg-${color} { background-color: var(--color-${color}); }`
          : `.col-${color[0]} { color: var(--color-${color[0]}); } .bg-${color[0]} { background-color: var(--color-${color[0]}); }`
      )
      .join('\n')}
    ${this.variables
      .map(([key, value]) =>
        Array.isArray(value)
          ? `.${key}-${value[0]} { ${key}: var(--${key}-${value[0]}); }`
          : `.${key} { ${key}: var(--${key}); }`
      )
      .join('\n')}
    ${this.classes
      .map(
        ([key, values]: [string, Property[]]) =>
          `.${key} { ${values
            .map(([key, value]: [string, string]) => (value ? `${key}: ${value};` : key))
            .join('\n')} }`
      )
      .join('\n')}
    `;
  }
}

var window: any;
if (typeof window !== 'undefined') {
  window['MagicCss'] = MagicCss;
}

export const mediaSize = {
  mobile: '@media all and (max-width: 577px)',
  tablet: '@media all and (max-width: 767px)',
  media2x: '@media all and (min-width: 2400px)',
  media3x: '@media all and (min-width: 3200px)',
};

export const withMedia = (
  selector: string,
  prop: string,
  [general, media2x, media3x, mobile]: [String | null, String | null, String | null, String | null]
) => `
  ${selector ? `${selector} {` : ''}
    ${general ? `${prop}: ${general};` : ''}
    ${mobile ? `${mediaSize.mobile} { ${prop}: ${mobile}; }` : ''}
    ${media2x ? `${mediaSize.media2x} { ${prop}: ${media2x}; }` : ''}
    ${media3x ? `${mediaSize.media3x} { ${prop}: ${media3x}; }` : ''}
  ${selector ? '}' : ''}
`;

export const withMobile = (props: Array<string>, value: Properties) => `
  ${props.map((prop, idx) => `@media all and (max-width: 577px) { ${prop}: ${value[idx]} }`)}
`;

export default MagicCss;
