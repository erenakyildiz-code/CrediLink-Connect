import { bexContent } from 'quasar/wrappers';

export default bexContent((bridge) => {
  console.log('Content script initialized and listening for messages...');

  window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data || typeof event.data.type !== 'string') {
      return;
    }

    if (event.data.type === 'openPopup') {
      bridge.send('openConnectionPopup')
        .then((response) => {
    
          // Extract only serializable data
          const serializableData = { success: "response" };
    
          // Send the serializable data back to the web page
          window.postMessage({ type: 'openPopupResponse', data: serializableData }, '*');
        })
        .catch((error) => {
          console.error('Error opening popup:', error);
     
          // Send only the error message
          window.postMessage({ type: 'openPopupResponse', error: error.message }, '*');
        });
    }
    if (event.data.type === 'getTime') {
      console.log('Received getTime request from the web page.');

      // Send the message to the background script via the bridge
      bridge.send('getTime')
        .then((response) => {
          console.log('Received getTime response from the background script:', response);

          // Extract only the serializable data property from the response object
          const serializableData = response.data;
          console.log('Sending serializable data to the web page:', serializableData);

          // Post the serializable data back to the web page
          window.postMessage({ type: 'getTimeResponse', data: serializableData }, '*');
        })
        .catch((error) => {
          console.error('Error communicating with the bridge:', error);
        });
    }
  });
});