const colorValueElem = document.getElementById('colorValue') as HTMLInputElement;

type ColorStorage = {
  colorValue: string;
};

function colorChanged(e: InputEvent & { target: HTMLInputElement }) {
  console.log('Form modified');
  colorValueElem!.value = e.target!.value;
}

async function colorListener(e: SubmitEvent) {
  e.preventDefault();
  const window = await browser.windows.getCurrent();
  const windowId = window.id;
  const keyString = `peacockColor${windowId}`;
  const storageObject: Record<string, any> = {};
  const colorValue = colorValueElem?.value;
  storageObject[keyString] = {
    colorValue,
  };
  console.log(`Storing object: ${JSON.stringify(storageObject)}`);
  browser.storage.local.set(storageObject);
}

async function loadColorValue() {
  const window = await browser.windows.getCurrent();
  const windowId = window.id;
  const keyString = `peacockColor${windowId}`;
  const storageObject = await browser.storage.local.get(keyString);
  const colorStorage = storageObject[keyString] as ColorStorage;
  console.log(`Got object: ${JSON.stringify(storageObject[keyString])}`);
  if (!colorStorage) {
    return;
  }
  colorValueElem!.value = colorStorage.colorValue;
}

console.log('Loading browser-action');
document.getElementById('colorForm')!.addEventListener('submit', colorListener);
document.getElementById('colorValue')!.addEventListener('input', colorChanged);
loadColorValue();
