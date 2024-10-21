import { bexBackground } from 'quasar/wrappers'

chrome.browserAction.onClicked.addListener(() => {
  // Open the extension in a new browser window
  chrome.tabs.create({
    url: chrome.extension.getURL('www/index.html')
  });
});

export default bexBackground((bridge) => {

  // Handle log messages
  bridge.on('log', ({ data, respond }) => {
    console.log(`[BEX] ${data.message}`, ...(data.data || []));
    respond();
  });
  bridge.on('sendTestMessage', (payload) => {
    console.log("Received message with payload:", payload);
    bridge.send('sendTestMessageResponse', { data: 'response' }, 'content-script');
    respond();
  });
  // Respond with the current time
  bridge.on('getTime', ({ respond }) => {
    const currentTime = Date.now();  // Use a simple number for the current time
    console.log('Sending current time from background script:', currentTime);
    respond(currentTime);  // Send a plain number instead of an object
  });

  // Handle opening a connection popup
  bridge.on('openConnectionPopup', ({ respond }) => {
    console.log('Background script received openConnectionPopup message');

    const url = chrome.runtime.getURL('www/index.html#/connection-popup');
    chrome.windows.create(
      {
        url,
        type: 'popup',
        width: 400,
        height: 600,
      },
      (newWindow) => {
        if (chrome.runtime.lastError) {
          console.error('Error opening popup:', chrome.runtime.lastError);
          // Respond with an error message
          respond({ success: false, error: chrome.runtime.lastError.message });
        } else {
          console.log('Popup window created:', newWindow);
          // Respond with success
          respond({ success: true });
        }
      }
    );
  });

  // Handle the "runFunctionInBackground" method
  bridge.on('runFunctionInBackground', ({ data, respond }) => {
    console.log('Received runFunctionInBackground request in background script with data:', data);

    // Perform the background action
    const result = { success: true, message: 'Function executed in background' };

    // Send the response back to the content script
    respond(result);
  });
});
