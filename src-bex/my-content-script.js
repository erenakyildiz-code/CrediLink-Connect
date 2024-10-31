import { bexContent } from 'quasar/wrappers';

export default bexContent((bridge) => {
  console.log('Content script initialized and listening for messages...');
  bridge.on('sendConnectionResponse', ({ data, respond }) => {
    console.log('Received in content script:', data);
    // Handle the data as needed
    window.postMessage({ type: 'connectionResponse', data: data }, '*');
    respond();
  });
  bridge.on('sendCreateConnectionResponse', ({ data, respond }) => {
    console.log('Received in content script:', data);
    // Handle the data as needed
    window.postMessage({ type: 'sendCreateConnectionResponse', data: data }, '*');
    respond();
  });
  bridge.on('sendCredentialResponse', ({ data, respond }) => {
    console.log('Received in content script:', data);
    // Handle the data as needed
    window.postMessage({ type: 'credentialFlowResponse', data: data }, '*');
    respond();
  });
  bridge.on('sendProofResponse', ({ data, respond }) => {
    console.log('Received in content script:', data);
    // Handle the data as needed
    window.postMessage({ type: 'proofFlowResponse', data: data }, '*');
    respond();
  });
  
  bridge.on('sendCreateProofRequestResponse', ({ data, respond }) => {
    console.log('Received in content script:', data);
    // Handle the data as needed
    window.postMessage({ type: 'createProofRequestResponse', data: data }, '*');
    respond();
  });
  bridge.on('sendPresResponse', ({ data, respond }) => {
    console.log('Received in content script:', data);
    // Handle the data as needed
    window.postMessage({ type: 'proofPresentationResponse', data: data }, '*');
    respond();
  });
  //listen to browser window messages
  window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data || typeof event.data.type !== 'string') {
      return;
    }

    console.log('Received message from browser window:', event.data.type);

    // Handle "openPopup" message from the browser window
    if (event.data.type === 'openPopup') {
      // Send message to the background script
      bridge.send('openConnectionPopup',data= event.data.data)
        .then((response) => {
          console.log('Received response from background:', response);
          // Forward the response from background script to the browser window
          window.postMessage({ type: 'openPopupResponse', data: response.data }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'openPopupResponse', error: error.message }, '*');
        });
    }
    if (event.data.type === 'openPopupCredentialFlow') {
      // Send message to the background script
      bridge.send('openCredentialFlowPopup',data= event.data.data)
        .then((response) => {
          console.log('Received response from background:', response);
          // Forward the response from background script to the browser window
          window.postMessage({ type: 'openPopupResponse', data: response.data }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'openPopupResponse', error: error.message }, '*');
        });
    }
    if (event.data.type === 'openPopupProofFlow') {
      // Send message to the background script
      console.log("received proof popup in content script");
      bridge.send('openProofPopup',data= event.data.data)
        .then((response) => {
          console.log('Received response from background:', response);
          // Forward the response from background script to the browser window
          window.postMessage({ type: 'openPopupResponse', data: response.data }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'openPopupResponse', error: error.message }, '*');
        });
    }
    if (event.data.type === 'openReceiveConnection') {
      // Send message to the background script
      console.log("received proof popup in content script");
      bridge.send('openReceiveConnectionPopup',data= event.data.data)
        .then((response) => {
          console.log('Received response from background:', response);
          // Forward the response from background script to the browser window
          window.postMessage({ type: 'openReceiveConnectionPopup', data: response.data }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'openReceiveConnectionPopup', error: error.message }, '*');
        });
    }
    if (event.data.type === 'openCreateConnectionPopup') {
      // Send message to the background script
      console.log("received proof popup in content script");
      bridge.send('openCreateConnectionPopup',data= event.data.data)
        .then((response) => {
          console.log('Received response from background:', response);
          // Forward the response from background script to the browser window
          window.postMessage({ type: 'openPopupResponse', data: response.data }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'openPopupResponse', error: error.message }, '*');
        });
    }
    if (event.data.type === 'openCreateProofRequest') {
      // Send message to the background script
      console.log("received proof popup in content script");
      bridge.send('openCreateProofRequest',data= event.data.data)
        .then((response) => {
          console.log('Received response from background:', response);
          // Forward the response from background script to the browser window
          window.postMessage({ type: 'openPopupResponse', data: response.data }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'openPopupResponse', error: error.message }, '*');
        });
    }
    if (event.data.type === 'openProofPresentation') {
      // Send message to the background script
      console.log("received proof popup in content script");
      bridge.send('openProofPresentation',data= event.data.data)
        .then((response) => {
          console.log('Received response from background:', response);
          // Forward the response from background script to the browser window
          window.postMessage({ type: 'openPopupResponse', data: response.data }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'openPopupResponse', error: error.message }, '*');
        });
    }
    if (event.data.type === 'openVerifyProof') {
      // Send message to the background script
      console.log("received proof popup in content script");
      bridge.send('openVerifyProof',data= event.data.data)
        .then((response) => {
          console.log('Received response from background:', response);
          // Forward the response from background script to the browser window
          window.postMessage({ type: 'openPopupResponse', data: response.data }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'openPopupResponse', error: error.message }, '*');
        });
    }
    // Handle "getTime" message from the browser window
    if (event.data.type === 'getTime') {
      console.log('Received getTime request from the browser window.');

      // Send message to the background script
      bridge.send('getTime')
        .then((response) => {
          console.log('Received time from background:', response);
          // Forward the time data from background to the browser window
          window.postMessage({ type: 'getTimeResponse', data: 'response' }, '*');
        })
        .catch((error) => {
          console.error('Error getting time from background script:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'getTimeResponse', error: error.message }, '*');
        });
    }

    // Handle "runFunctionInBackground" message from the browser window
    if (event.data.type === 'runFunctionInBackground') {
      console.log('Received runFunctionInBackground request from browser window.');

      // Send the request to the background script
      bridge.send('runFunctionInBackground', { data: event.data })
        .then((response) => {
          console.log('Received runFunctionInBackground response:', response);
          // Forward the response from the background script to the browser window
          window.postMessage({ type: 'runFunctionInBackgroundResponse', data: 'response' }, '*');
        })
        .catch((error) => {
          console.error('Error running function in background:', error);
          // Forward the error back to the browser window
          window.postMessage({ type: 'runFunctionInBackgroundResponse', error: error.message }, '*');
        });
    }
  });
});
