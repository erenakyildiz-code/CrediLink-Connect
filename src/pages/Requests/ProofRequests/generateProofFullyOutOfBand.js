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
  
  export default async function generateProof(properties,jobId,userId) {


    //get pres_ex_id for current connection.
    var token = await getTokenFromStorage();
    var connId = localStorage.getItem('connectionId');
    var getRequestOptions = {
        method: "GET",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json", // Make sure to send JSON data
            "Authorization": `Bearer ${token}` // Add the JWT token to the headers
        },
        redirect: "follow",
    }

    var presExId = await fetch(process.env.DB_URL + "/present-proof-2.0/records?connection_id=" + connId, getRequestOptions);
    presExId = await presExId.json();
    presExId = presExId.results[0].pres_ex_id;
    var requestBody = 
    {
        "auto_remove": true,
        
  "indy": {
    "requested_attributes": properties.attributes,
    "requested_predicates": properties.predicates,
    "self_attested_attributes": properties.selfAttested,
    "trace": false
  },
  "trace": false
}
    try {
       
        var postRequestOptions = {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json", // Make sure to send JSON data
            "Authorization": `Bearer ${token}` // Add the JWT token to the headers
          },
          body: JSON.stringify(requestBody),
          redirect: "follow",
        };

        // Await the fetch call and parse the response as JSON
        const credentialsRes = await fetch(process.env.DB_URL + "/present-proof-2.0/records/" + presExId + '/send-presentation', postRequestOptions);
        if (!credentialsRes.ok) {
            throw new Error(`HTTP error! status: ${responseOfStore.status}`);
          }
        var response = await credentialsRes.json();
      
          console.log(response);
          //send server new state response.
            const putReqOptions = {
                method: "PUT",
                headers: {
                "accept": "application/json",
                "Content-Type": "application/json", // Make sure to send JSON data
                },
                body: JSON.stringify({jobId: jobId, userId: userId}),
                redirect: "follow",
            }
            var res = await fetch(process.env.DB_URL_CREDILINK + '/presentationSent', putReqOptions);
            res = await res.json();
            if(res.status != '200'){
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            

      return response; // Return the parsed JSON result
    } catch (error) {
      console.error("Error during credential exchange:", error);
      throw error; // Re-throw the error so it can be caught elsewhere if needed
    }
  }
  