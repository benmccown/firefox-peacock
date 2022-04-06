const COLORS = [
  '#ec5f67',
  '#db7c48',
  '#e3b65d',
  '#99c794',
  '#5fb3b3',
  '#6699cc',
  '#c594c5',
  '#ab7967',
];

type RgbColor = {
  r: number;
  g: number;
  b: number;
};

function rgbValueToHex(colorValue: number) {
  const hex = colorValue.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + rgbValueToHex(r) + rgbValueToHex(g) + rgbValueToHex(b);
}

function hexToRgb(hexColor: string): RgbColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  if (!result) {
    throw new Error('Could not convert hex color to rgb.');
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function darkenHexColor(hexColor: string, darkenBy: number) {
  const rgbColor = hexToRgb(hexColor);
  const darkerRgbColor = {
    r: Math.max(rgbColor.r - darkenBy, 0),
    g: Math.max(rgbColor.g - darkenBy, 0),
    b: Math.max(rgbColor.b - darkenBy, 0),
  };
  return rgbToHex(darkerRgbColor.r, darkerRgbColor.g, darkerRgbColor.b);
}

function buildTheme(color: string) {
  const rgbColor = hexToRgb(color);
  let textColor = '#000000';
  if (rgbColor.r * 0.299 + rgbColor.g * 0.587 + rgbColor.b * 0.114 <= 186) {
    textColor = '#ffffff';
  }
  return {
    colors: {
      frame: color,
      tab_selected: darkenHexColor(color, 30),
      tab_background_text: textColor,
      tab_text: textColor,
    },
  };
}

// function buildThemes(colors: string[]) {
//   const result = [];
//   for (const color of colors) {
//     result.push(buildTheme(color));
//   }
//   return result;
// }

async function preserveExistingTheme(newTheme: any) {
  const currentTheme = await browser.theme.getCurrent();
  const joinedTheme = {
    ...currentTheme,
    colors: {
      ...currentTheme.colors,
      ...newTheme.colors,
    },
  };
  return joinedTheme;
}

async function applyThemeToWindow(window: browser.windows.Window) {
  const wrappedTheme = await preserveExistingTheme(getNextTheme(window.id!));
  browser.theme.update(window.id!, wrappedTheme);
}

async function applyThemeToAllWindows() {
  console.log('Applying theme to all windows');
  for (const window of await browser.windows.getAll()) {
    await loadColorsFromLocalStorage(window.id!);
    applyThemeToWindow(window);
  }
}

const windowsToColorMap = new Map();

function isValidHexColor(color: string): boolean {
  const hexRegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  const result = hexRegExp.test(color);
  console.log('🚀 ~ file: background.ts ~ line 96 ~ isValidHexColor ~ result', result);
  return result;
}

function getNextTheme(windowId: number) {
  let color = '';

  if (windowsToColorMap.has(windowId) && isValidHexColor(windowsToColorMap.get(windowId))) {
    color = windowsToColorMap.get(windowId);
  } else {
    const randomizer = Math.floor(Math.random() * COLORS.length);
    color = COLORS[randomizer];
    windowsToColorMap.set(windowId, color);

    const keyString = `peacockColor${windowId}`;
    const storageObject: Record<string, any> = {};
    const colorValue = color;
    storageObject[keyString] = {
      colorValue,
    };
    console.log(`Storing object: ${JSON.stringify(storageObject)}`);
    browser.storage.local.set(storageObject);
  }

  return buildTheme(color);
}

async function loadColorsFromLocalStorage(windowId: number) {
  const keyString = `peacockColor${windowId}`;
  const storageObject = await browser.storage.local.get(keyString);
  const colorStorage = storageObject[keyString] as ColorStorage;
  console.log(`Got object: ${JSON.stringify(storageObject[keyString])}`);
  if (!colorStorage) {
    return;
  }
  const existingColor = colorStorage.colorValue;
  windowsToColorMap.set(windowId, existingColor);
}

const cleanupWindow = (windowId: number) => {
  windowsToColorMap.delete(windowId);
  const keyString = `peacockColor${windowId}`;
  browser.storage.local.remove(keyString);
};

console.log('Loading background.ts');
browser.windows.onCreated.addListener(applyThemeToAllWindows);
browser.runtime.onStartup.addListener(applyThemeToAllWindows);
browser.runtime.onInstalled.addListener(applyThemeToAllWindows);
browser.windows.onRemoved.addListener(cleanupWindow);
browser.tabs.onCreated.addListener(applyThemeToAllWindows);
