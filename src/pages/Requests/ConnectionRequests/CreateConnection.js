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
  
  export default async function createConnection(userId,jobId) {
    try {
      // Wait for the token to be retrieved from storage
      const token = await getTokenFromStorage();
    
      if(token == null) {
        throw new Error('Wallet not initialised, initialiseWalletInstance(withOrWithoutMnemonic) must be called first');
      }
      try {
        
    var request = {
        "accept": [
          "didcomm/aip1",
          "didcomm/aip2;env=rfc19"
        ],
        "alias": "My Connection",
        "handshake_protocols": [
          "https://didcomm.org/didexchange/1.0"
        ],
        "my_label": "FullyOutOfBand",
        "use_public_did": false,
        "protocol_version": "1.1",
      }
  
      
    
        // Define the request options
        var requestOptions = {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json", // Make sure to send JSON data
            "Authorization": `Bearer ${token}` // Add the JWT token to the headers
          },
          body : JSON.stringify(request),
          redirect: "follow",
        };
    
        // Await the fetch call and parse the response as JSON
        const response = await fetch(process.env.DB_URL+ "/out-of-band/create-invitation?auto_accept=true", requestOptions);
    
        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        // Parse the response as JSON
        const result = await response.json();
        
    
      //the response will have a field called invitation, we have to open a popup with this invitation.
      //open a popup with the invitation.
      //first create the data.
      var requestData = {
        invitedUser: userId,
        invitation : result.invitation,
        inviMsgId : result.invi_msg_id,
        status: "request-sent",
        jobId: jobId
      }
      console.log(requestData);
        //send the data to db.
        const res = await fetch(process.env.DB_URL_CREDILINK + "/newConnection", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json", // Make sure to send JSON data
          },
          body : JSON.stringify(requestData),
          redirect: "follow",
        });
      //set connection on DB
        return result; // Return the parsed JSON result
      } catch (error) {
        console.error("Error during DID creation:", error);
        throw error; // Re-throw the error so it can be caught elsewhere if needed
      }
  
    } catch (error) {
      console.error("Error during wallet creation:", error);
      throw error; // Re-throw the error so it can be caught elsewhere if needed
    }
  }
  