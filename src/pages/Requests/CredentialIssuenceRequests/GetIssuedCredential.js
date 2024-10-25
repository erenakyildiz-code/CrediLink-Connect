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
  
  export default async function receiveCredential(credential,didPair) {
    //2 parts to this method.

    //{cred_ex_id}/send-request (holder side) -> {cred_ex_id}/store (holder side) 

    //body of 1. {cred_ex_id}/send-request
    /*
    {
  "auto_remove": true,
  "holder_did": "did:key:ahsdkjahsdkjhaskjdhakjshdkajhsdkjahs"
}
  also needs cred_ex_id url param
    */

    try {
        const token = await getTokenFromStorage();
        var connId = localStorage.getItem('connectionId');
        //from connId get cred_ex_id
        // endpoint issue-credential-2.0/records?connection_id=connId

        // Define the request options
        var connectionCredExGetRequestOptions = {
          method: "GET",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json", // Make sure to send JSON data
            "Authorization": `Bearer ${token}` // Add the JWT token to the headers
          },
          redirect: "follow",
        };

        // Await the fetch call and parse the response as JSON
        const connectionCredExGetResponse = await fetch(process.env.DB_URL + "/issue-credential-2.0/records?connection_id=" + connId, connectionCredExGetRequestOptions);

        var connectionCredEx = await connectionCredExGetResponse.json();

        console.log(connectionCredEx);
      // Wait for the token to be retrieved from storage
  
      var requestBodyPartone = {
        "auto_remove": false,
        "holder_did": didPair
      }
      console.log(requestBodyPartone);

      // Define the request options
      var requestOptions = {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json", // Make sure to send JSON data
          "Authorization": `Bearer ${token}` // Add the JWT token to the headers
        },
        body: JSON.stringify(requestBodyPartone),
        redirect: "follow",
      };
      // Await the fetch call and parse the response as JSON
      const response = await fetch(process.env.DB_URL + "/issue-credential-2.0/records/" + connectionCredEx.results[0].cred_ex_record.cred_ex_id + "/send-request", requestOptions);
  
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the response as JSON
      const result = await response.json();
      
      console.log(result);
  
      //after this part2.

      var requestBodyPartone = {
        "credential_id": credential.cred_ex_id,
      }

      // Define the request options
      var requestOptions = {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json", // Make sure to send JSON data
          "Authorization": `Bearer ${token}` // Add the JWT token to the headers
        },
        body: JSON.stringify(requestBodyPartone),
        redirect: "follow",
      };
  
      // Await the fetch call and parse the response as JSON

      //send-request takes some time to proccess, wait until the connectionCredEx.results[0].cred_ex_record.state is 'credential-received'

      //we send get request to /issue-credential-2.0/records?connection_id=connId untill we get the state as 'credential-received'

        while(connectionCredEx.results[0].cred_ex_record.state != 'credential-received'){
            const connectionCredExGetResponse = await fetch(process.env.DB_URL + "/issue-credential-2.0/records?connection_id=" + connId, connectionCredExGetRequestOptions);
            connectionCredEx = await connectionCredExGetResponse.json();
            //wait one second
            await new Promise(resolve => setTimeout(resolve , 1000));
        }

      const responseOfStore = await fetch(process.env.DB_URL + "/issue-credential-2.0/records/" + connectionCredEx.results[0].cred_ex_record.cred_ex_id + "/store", requestOptions);
  
      // Check if the response is OK (status code 200-299)
      if (!responseOfStore.ok) {
        throw new Error(`HTTP error! status: ${responseOfStore.status}`);
      }
  
      // Parse the response as JSON
      const resultOfStore = await responseOfStore.json();
      

      return resultOfStore; // Return the parsed JSON result
    } catch (error) {
      console.error("Error during credential exchange:", error);
      throw error; // Re-throw the error so it can be caught elsewhere if needed
    }
  }
  