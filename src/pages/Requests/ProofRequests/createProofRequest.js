

import getConnIdFromInviMsgId from "./getConnIdFromInviMsgId";
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
  
  export default async function createProofRequest(properties,inviMsgId,userId,jobId) {

    if(inviMsgId == null) {
      throw new Error('No connection established, connect flow must be completed first.');
    }
      var conn = await getConnIdFromInviMsgId(inviMsgId);
      //conn is an array of objects.
      conn = conn.results[0];
      if(conn == null || conn.state != "active") {
        throw new Error('Connection not established, connect flow must be completed first.');
      }
      console.log(properties);
      //requested attributes and predicates currently have schemaIds instead of credDefId's.
      //This needs to be changed to credDefId's before sending it to aca-py.
      //first get all credDefs of the schemaIds.

        //get all credDefs of the schemaIds.

      
      var requestObject = {
        "auto_remove": true,
        "auto_verify": false,
        "comment": "string",
        "connection_id": conn.connection_id,
        "presentation_request": {
            "indy": {
                "name": "Proof request",
                "nonce": "1",
                "requested_attributes": properties.requested_attributes,
                "requested_predicates": properties.requested_predicates,
                "version": "1.0"
            }
        },
        "trace": false
      }
    
      console.log(requestObject);
      //send request to aca-py
    
      var token = await getTokenFromStorage();
      //path = /present-proof-2.0/send-request
    
      const requestOptions = {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestObject),
        redirect: "follow",
      };
    
      var res = await fetch(process.env.DB_URL + "/present-proof-2.0/send-request", requestOptions);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      res = await res.json();
      
      const putReqOptions = {
        method: "PUT",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json", // Make sure to send JSON data
        },
        body: JSON.stringify({jobId: jobId, userId: userId}),
        redirect: "follow",
      }

      var res = await fetch(process.env.DB_URL_CREDILINK + '/proofRequestSent', putReqOptions);
      
      res = await res.json();
      if(res.status != '200'){
        throw new Error(`HTTP error! status: ${res.status}`);
      }


      return true;
  }
  