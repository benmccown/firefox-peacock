const colorValueElem = document.getElementById('colorValue');
function isValidHexColor(color) {
    const hexRegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    const result = hexRegExp.test(color);
    return result;
}
function getStorageKeyBrowserAction(windowId) {
    return `peacockColor${windowId}`;
}
async function setWindowColorLocalStorageBrowserAction(windowId, color) {
    const keyString = getStorageKeyBrowserAction(windowId);
    const storageObject = {};
    const colorValue = color;
    storageObject[keyString] = {
        colorValue,
    };
    await browser.storage.local.set(storageObject);
}
async function getWindowColorLocalStorageBrowserAction(windowId) {
    const keyString = getStorageKeyBrowserAction(windowId);
    const storageObject = await browser.storage.local.get(keyString);
    const colorStorage = storageObject[keyString];
    if (!colorStorage) {
        return undefined;
    }
    return colorStorage.colorValue;
}
function colorChanged(e) {
    colorValueElem.value = e.target.value;
}
async function colorListener(e) {
    e.preventDefault();
    const window = await browser.windows.getCurrent();
    const windowId = window.id;
    const colorValue = colorValueElem?.value;
    if (isValidHexColor(colorValue)) {
        await setWindowColorLocalStorageBrowserAction(windowId, colorValue);
        sendMessage();
        browser;
    }
}
async function populateColorValueToTextInput() {
    const window = await browser.windows.getCurrent();
    const windowId = window.id;
    const color = await getWindowColorLocalStorageBrowserAction(windowId);
    colorValueElem.value = color;
}
document.getElementById('colorForm').addEventListener('submit', colorListener);
document.getElementById('colorValue').addEventListener('input', colorChanged);
populateColorValueToTextInput();
function sendMessage() {
    browser.runtime.sendMessage({ messageType: 'peacock-refresh' });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnJvd3Nlci1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQXFCLENBQUM7QUFFakYsU0FBUyxlQUFlLENBQUMsS0FBYTtJQUNwQyxNQUFNLFNBQVMsR0FBRyw0QkFBNEIsQ0FBQztJQUMvQyxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFNRCxTQUFTLDBCQUEwQixDQUFDLFFBQWdCO0lBQ2xELE9BQU8sZUFBZSxRQUFRLEVBQUUsQ0FBQztBQUNuQyxDQUFDO0FBRUQsS0FBSyxVQUFVLHVDQUF1QyxDQUFDLFFBQWdCLEVBQUUsS0FBYTtJQUNwRixNQUFNLFNBQVMsR0FBRywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2RCxNQUFNLGFBQWEsR0FBd0IsRUFBRSxDQUFDO0lBQzlDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQztJQUN6QixhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUc7UUFDekIsVUFBVTtLQUNYLENBQUM7SUFDRixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsS0FBSyxVQUFVLHVDQUF1QyxDQUFDLFFBQWdCO0lBQ3JFLE1BQU0sU0FBUyxHQUFHLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXZELE1BQU0sYUFBYSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQWlCLENBQUM7SUFFOUQsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUNqQixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUNELE9BQU8sWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUNqQyxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsQ0FBNEM7SUFDaEUsY0FBZSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTyxDQUFDLEtBQUssQ0FBQztBQUMxQyxDQUFDO0FBRUQsS0FBSyxVQUFVLGFBQWEsQ0FBQyxDQUFjO0lBQ3pDLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNuQixNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEVBQUcsQ0FBQztJQUM1QixNQUFNLFVBQVUsR0FBRyxjQUFjLEVBQUUsS0FBSyxDQUFDO0lBQ3pDLElBQUksZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1FBQy9CLE1BQU0sdUNBQXVDLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLFdBQVcsRUFBRSxDQUFDO1FBQ2QsT0FBTyxDQUFDO0tBQ1Q7QUFDSCxDQUFDO0FBRUQsS0FBSyxVQUFVLDZCQUE2QjtJQUMxQyxNQUFNLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLEVBQUcsQ0FBQztJQUM1QixNQUFNLEtBQUssR0FBRyxNQUFNLHVDQUF1QyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RFLGNBQWUsQ0FBQyxLQUFLLEdBQUcsS0FBTSxDQUFDO0FBQ2pDLENBQUM7QUFFRCxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBRSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNoRixRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMvRSw2QkFBNkIsRUFBRSxDQUFDO0FBRWhDLFNBQVMsV0FBVztJQUNsQixPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDbEUsQ0FBQyJ9