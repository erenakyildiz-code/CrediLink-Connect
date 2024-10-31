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
  bridge.on('sendPresResponse',async (payload) => {
    console.log("Received message with payload:", payload);
    bridge.send('sendPresResponse', { data: payload }, 'content-script');
    chrome.storage.local.get('popupWindowID', async (data) => {
      console.log('Popup window ID:', data.popupWindowID);
      const popupWindowID = data.popupWindowID;
      chrome.windows.remove(popupWindowID);
    })
  });
  bridge.on('sendCreateProofRequestResponse',async (payload) => {
    console.log("Received message with payload:", payload);
    bridge.send('sendCreateProofRequestResponse', { data: payload }, 'content-script');
    chrome.storage.local.get('popupWindowID', async (data) => {
      console.log('Popup window ID:', data.popupWindowID);
      const popupWindowID = data.popupWindowID;
      chrome.windows.remove(popupWindowID);
    })
  });
  bridge.on('sendConnectionResponse',async (payload) => {
    console.log("Received message with payload:", payload);
    bridge.send('sendConnectionResponse', { data: payload }, 'content-script');
    chrome.storage.local.get('popupWindowID', async (data) => {
      console.log('Popup window ID:', data.popupWindowID);
      const popupWindowID = data.popupWindowID;
      chrome.windows.remove(popupWindowID);
    })
  });
  bridge.on('sendCreateConnectionResponse',async (payload) => {
    console.log("Received message with payload:", payload);
    bridge.send('sendCreateConnectionResponse', { data: payload }, 'content-script');
    chrome.storage.local.get('popupWindowID', async (data) => {
      console.log('Popup window ID:', data.popupWindowID);
      const popupWindowID = data.popupWindowID;
      chrome.windows.remove(popupWindowID);
    })
  });
  bridge.on('sendProofResponse',async (payload) => {
    console.log("Received message with payload:", payload);
    bridge.send('sendProofResponse', { data: payload }, 'content-script');
    chrome.storage.local.get('popupWindowID', async (data) => {
      console.log('Popup window ID:', data.popupWindowID);
      const popupWindowID = data.popupWindowID;
      chrome.windows.remove(popupWindowID);
    })
  });
  bridge.on('sendCredentialResponse',async (payload) => {
    console.log("Received message with payload:", payload);
    bridge.send('sendCredentialResponse', { data: payload }, 'content-script');
    chrome.storage.local.get('popupWindowID', async (data) => {
      console.log('Popup window ID:', data.popupWindowID);
      const popupWindowID = data.popupWindowID;
      chrome.windows.remove(popupWindowID);
    })
  });
  bridge.on('sendProofVerificationResponse',async (payload) => {
    console.log("Received message with payload:", payload);
    bridge.send('verifyProofResponse', { data: payload }, 'content-script');
    chrome.storage.local.get('popupWindowID', async (data) => {
      console.log('Popup window ID:', data.popupWindowID);
      const popupWindowID = data.popupWindowID;
      chrome.windows.remove(popupWindowID);
    })
  });
  // Respond with the current time
  bridge.on('getTime', ({ respond }) => {
    const currentTime = Date.now();  // Use a simple number for the current time
    console.log('Sending current time from background script:', currentTime);
    respond(currentTime);  // Send a plain number instead of an object
  });
  
  // Handle opening a connection popup
  bridge.on('openConnectionPopup', ({ data, respond }) => {
    console.log('Background script received openConnectionPopup message');
    console.log('Data:', data);
    chrome.storage.local.set({ connectionData: data });
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
          chrome.storage.local.set({ popupWindowID: newWindow.id });
          // Respond with success
          respond({ success: true });
        }
      }
    );
  });
  bridge.on('openCreateConnectionPopup', ({ data, respond }) => {
    console.log('Background script received openCreateConnectionPopup message');
    console.log('Data:', data);
    chrome.storage.local.set({ connDataUserValue: data });
    const url = chrome.runtime.getURL('www/index.html#/connection-create');
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
          chrome.storage.local.set({ popupWindowID: newWindow.id });
          // Respond with success
          respond({ success: true });
        }
      }
    );
  });
  
  bridge.on('openReceiveConnectionPopup', ({ data, respond }) => {
    console.log('Background script received openReceiveConnectionPopup message');
    console.log('Data:', data);
    chrome.storage.local.set({ connectionData: data });
    const url = chrome.runtime.getURL('www/index.html#/connection-receive-fully-out-of-band');
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
          chrome.storage.local.set({ popupWindowID: newWindow.id });
          // Respond with success
          respond({ success: true });
        }
      }
    );
  });
  bridge.on('openCredentialFlowPopup', ({ data, respond }) => {
    console.log('Background script received openCredentialFlowPopup message');
    console.log('Data:', data);
    chrome.storage.local.set({ credentialData: data });
    const url = chrome.runtime.getURL('www/index.html#/credential-popup');
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
          chrome.storage.local.set({ popupWindowID: newWindow.id });
          // Respond with success
          respond({ success: true });
        }
      }
    );
  });
  bridge.on('openProofPopup', ({ data, respond }) => {
    console.log('Background script received openConnectionPopup message');
    console.log('Data:', data);
    chrome.storage.local.set({ proofData: data });
    const url = chrome.runtime.getURL('www/index.html#/proof-popup');
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
          chrome.storage.local.set({ popupWindowID: newWindow.id });
          // Respond with success
          respond({ success: true });
        }
      }
    );
  });
  bridge.on('openCreateProofRequest', ({ data, respond }) => {
    console.log('Background script received openConnectionPopup message');
    console.log('Data:', data);
    chrome.storage.local.set({ openCreateProofRequest: data });
    const url = chrome.runtime.getURL('www/index.html#/create-proof-request-OOB');
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
          chrome.storage.local.set({ popupWindowID: newWindow.id });
          // Respond with success
          respond({ success: true });
        }
      }
    );
  });
  bridge.on('openProofPresentation', ({ data, respond }) => {
    console.log('Background script received openConnectionPopup message');
    console.log('Data:', data);
    chrome.storage.local.set({ proofDataFullyOutOfBand: data });
    const url = chrome.runtime.getURL('www/index.html#/receive-proof-request-OOB');
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
          chrome.storage.local.set({ popupWindowID: newWindow.id });
          // Respond with success
          respond({ success: true });
        }
      }
    );
  });
  bridge.on('openVerifyProof', ({ data, respond }) => {
    console.log('Background script received openConnectionPopup message');
    console.log('Data:', data);
    chrome.storage.local.set({ verificationData: data });
    const url = chrome.runtime.getURL('www/index.html#/verify-proof-request-OOB');
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
          chrome.storage.local.set({ popupWindowID: newWindow.id });
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
