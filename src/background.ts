// Config
const COLORS = ['#ec5f67', '#db7c48', '#e3b65d', '#99c794', '#5fb3b3', '#6699cc', '#c594c5', '#ab7967'];

// Config End

// Colors Utils
type RgbColor = {
  r: number;
  g: number;
  b: number;
};

function colorSingleRgbValueToHex(colorValue: number) {
  const hex = colorValue.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function colorRgbToHex(rgbColor: RgbColor) {
  return (
    '#' +
    colorSingleRgbValueToHex(rgbColor.r) +
    colorSingleRgbValueToHex(rgbColor.g) +
    colorSingleRgbValueToHex(rgbColor.b)
  );
}

function colorHexToRgb(hexColor: string): RgbColor {
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
  const rgbColor = colorHexToRgb(hexColor);
  const darkerRgbColor: RgbColor = {
    r: Math.max(rgbColor.r - darkenBy, 0),
    g: Math.max(rgbColor.g - darkenBy, 0),
    b: Math.max(rgbColor.b - darkenBy, 0),
  };
  return colorRgbToHex(darkerRgbColor);
}

function getRandomColor(): string {
  const randomizer = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomizer];
}
// Colors Utils End

// Storage Utils
const windowsToColorMap = new Map();

async function loadWindowToMemory(windowId: number) {
  const colorValue = await getWindowColorLocalStorage(windowId);
  if (!colorValue) {
    return;
  }
  setWindowColorInMemory(windowId, colorValue);
}

function removeWindow(windowId: number) {
  windowsToColorMap.delete(windowId);
  const keyString = getStorageKey(windowId);
  browser.storage.local.remove(keyString);
}

async function saveWindowColor(windowId: number, color: string) {
  setWindowColorInMemory(windowId, color);
  await setWindowColorLocalStorage(windowId, color);
}

function isWindowColorInMemory(windowId: number): boolean {
  return windowsToColorMap.has(windowId);
}

function getWindowColorInMemory(windowId: number): string {
  return windowsToColorMap.get(windowId);
}

function setWindowColorInMemory(windowId: number, color: string) {
  windowsToColorMap.set(windowId, color);
}

async function setWindowColorLocalStorage(windowId: number, color: string) {
  const keyString = getStorageKey(windowId);
  const storageObject: Record<string, any> = {};
  const colorValue = color;
  storageObject[keyString] = {
    colorValue,
  };
  await browser.storage.local.set(storageObject);
}

async function isWindowColorInLocalStorage(windowId: number): Promise<boolean> {
  const keyString = getStorageKey(windowId);

  const storageObject = await browser.storage.local.get(keyString);
  const colorStorage = storageObject[keyString] as ColorStorage;

  return colorStorage ? true : false;
}

async function getWindowColorLocalStorage(windowId: number): Promise<string | undefined> {
  const keyString = getStorageKey(windowId);

  const storageObject = await browser.storage.local.get(keyString);
  const colorStorage = storageObject[keyString] as ColorStorage;

  if (!colorStorage) {
    return undefined;
  }
  return colorStorage.colorValue;
}

function getStorageKey(windowId: number) {
  return `peacockColor${windowId}`;
}
// Storage Utils End

// Theme Utils
function buildTheme(color: string) {
  const rgbColor = colorHexToRgb(color);
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
// Theme Utils End

async function getWindowColor(windowId: number): Promise<string> {
  if (isWindowColorInMemory(windowId)) {
    return getWindowColorInMemory(windowId);
  } else if (await isWindowColorInLocalStorage(windowId)) {
    const color = await getWindowColorLocalStorage(windowId);
    return color!;
  } else {
    const color = getRandomColor();
    return color;
  }
}

async function applyThemeToAllWindows() {
  for (const window of await browser.windows.getAll()) {
    const windowId = window.id!;
    await loadWindowToMemory(windowId);
    let color = await getWindowColor(windowId);
    await saveWindowColor(windowId, color);
    const wrappedTheme = await preserveExistingTheme(buildTheme(color));
    browser.theme.update(window.id!, wrappedTheme);
  }
}

const cleanupWindow = (windowId: number) => {
  removeWindow(windowId);
};

function handleMessage(request: any, sender: any, sendResponse: any) {
  if (request.messageType === 'peacock-refresh') {
    applyThemeToAllWindows();
    sendResponse({ response: 'response from background script' });
  }
}

console.log('Loading Peacock Extension.');
applyThemeToAllWindows();
browser.windows.onCreated.addListener(applyThemeToAllWindows);
browser.runtime.onStartup.addListener(applyThemeToAllWindows);
browser.windows.onRemoved.addListener(cleanupWindow);
browser.runtime.onMessage.addListener(handleMessage);
