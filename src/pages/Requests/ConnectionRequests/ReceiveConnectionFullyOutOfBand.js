function getTokenFromStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('WalletInfo', function(data) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (data.WalletInfo && data.WalletInfo.token) {
          resolve(data.WalletInfo.token);
        } else {
          reject(new Error("Token not found"));
        }
      });
    });
  }
  
  export default async function receiveConnection(invitation,userId,jobId) {
    try {
      // Wait for the token to be retrieved from storage
      const token = await getTokenFromStorage();
  
      // Define the request options
      var requestOptions = {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json", // Make sure to send JSON data
          "Authorization": `Bearer ${token}` // Add the JWT token to the headers
        },
        body: JSON.stringify(invitation),
        redirect: "follow",
      };
  
      // Await the fetch call and parse the response as JSON
      const response = await fetch(process.env.DB_URL + "/out-of-band/receive-invitation?auto_accept=true", requestOptions);
  
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the response as JSON
      const result = await response.json();
      console.log(result);
      //send connectionMsgId to db, and set state as active
      const invi_msg_id = result.invi_msg_id;
      localStorage.setItem('connectionId', result.connection_id);
      //now send the put request and set the status = active
      const putReqOptions = {
        method: "PUT",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json", // Make sure to send JSON data
        },
        body: JSON.stringify({invi_msg_id: invi_msg_id, jobId: jobId, userId: userId}),
        redirect: "follow",
      }

      var res = await fetch(process.env.DB_URL_CREDILINK + '/acceptConnection', putReqOptions);
      
      res = await res.json();
      if(res.status != '200'){
        throw new Error(`HTTP error! status: ${res.status}`);
      }


      return result; // Return the parsed JSON result
    } catch (error) {
      console.error("Error during wallet creation:", error);
      throw error; // Re-throw the error so it can be caught elsewhere if needed
    }
  }
  