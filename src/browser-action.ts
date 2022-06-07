const colorValueElem = document.getElementById('colorValue') as HTMLInputElement;

function isValidHexColor(color: string): boolean {
  const hexRegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  const result = hexRegExp.test(color);
  return result;
}

type ColorStorage = {
  colorValue: string;
};

function getStorageKeyBrowserAction(windowId: number) {
  return `peacockColor${windowId}`;
}

async function setWindowColorLocalStorageBrowserAction(windowId: number, color: string) {
  const keyString = getStorageKeyBrowserAction(windowId);
  const storageObject: Record<string, any> = {};
  const colorValue = color;
  storageObject[keyString] = {
    colorValue,
  };
  await browser.storage.local.set(storageObject);
}

async function getWindowColorLocalStorageBrowserAction(windowId: number): Promise<string | undefined> {
  const keyString = getStorageKeyBrowserAction(windowId);

  const storageObject = await browser.storage.local.get(keyString);
  const colorStorage = storageObject[keyString] as ColorStorage;

  if (!colorStorage) {
    return undefined;
  }
  return colorStorage.colorValue;
}

function colorChanged(e: InputEvent & { target: HTMLInputElement }) {
  colorValueElem!.value = e.target!.value;
}

async function colorListener(e: SubmitEvent) {
  e.preventDefault();
  const window = await browser.windows.getCurrent();
  const windowId = window.id!;
  const colorValue = colorValueElem?.value;
  if (isValidHexColor(colorValue)) {
    await setWindowColorLocalStorageBrowserAction(windowId, colorValue);
    sendMessage();
    browser;
  }
}

async function populateColorValueToTextInput() {
  const window = await browser.windows.getCurrent();
  const windowId = window.id!;
  const color = await getWindowColorLocalStorageBrowserAction(windowId);
  colorValueElem!.value = color!;
}

document.getElementById('colorForm')!.addEventListener('submit', colorListener);
document.getElementById('colorValue')!.addEventListener('input', colorChanged);
populateColorValueToTextInput();

function sendMessage() {
  browser.runtime.sendMessage({ messageType: 'peacock-refresh' });
}
