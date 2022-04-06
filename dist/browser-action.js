const colorValueElem = document.getElementById('colorValue');
function colorChanged(e) {
    console.log('Form modified');
    colorValueElem.value = e.target.value;
}
async function colorListener(e) {
    e.preventDefault();
    const window = await browser.windows.getCurrent();
    const windowId = window.id;
    const keyString = `peacockColor${windowId}`;
    const storageObject = {};
    const colorValue = colorValueElem === null || colorValueElem === void 0 ? void 0 : colorValueElem.value;
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
    const colorStorage = storageObject[keyString];
    console.log(`Got object: ${JSON.stringify(storageObject[keyString])}`);
    if (!colorStorage) {
        return;
    }
    colorValueElem.value = colorStorage.colorValue;
}
console.log('Loading browser-action');
document.getElementById('colorForm').addEventListener('submit', colorListener);
document.getElementById('colorValue').addEventListener('input', colorChanged);
loadColorValue();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1hY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnJvd3Nlci1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQXFCLENBQUM7QUFNakYsU0FBUyxZQUFZLENBQUMsQ0FBNEM7SUFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM3QixjQUFlLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUFPLENBQUMsS0FBSyxDQUFDO0FBQzFDLENBQUM7QUFFRCxLQUFLLFVBQVUsYUFBYSxDQUFDLENBQWM7SUFDekMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ25CLE1BQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNsRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQzNCLE1BQU0sU0FBUyxHQUFHLGVBQWUsUUFBUSxFQUFFLENBQUM7SUFDNUMsTUFBTSxhQUFhLEdBQXdCLEVBQUUsQ0FBQztJQUM5QyxNQUFNLFVBQVUsR0FBRyxjQUFjLGFBQWQsY0FBYyx1QkFBZCxjQUFjLENBQUUsS0FBSyxDQUFDO0lBQ3pDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRztRQUN6QixVQUFVO0tBQ1gsQ0FBQztJQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBRUQsS0FBSyxVQUFVLGNBQWM7SUFDM0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2xELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDM0IsTUFBTSxTQUFTLEdBQUcsZUFBZSxRQUFRLEVBQUUsQ0FBQztJQUM1QyxNQUFNLGFBQWEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRSxNQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFpQixDQUFDO0lBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN2RSxJQUFJLENBQUMsWUFBWSxFQUFFO1FBQ2pCLE9BQU87S0FDUjtJQUNELGNBQWUsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUNsRCxDQUFDO0FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3RDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2hGLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQy9FLGNBQWMsRUFBRSxDQUFDIn0=