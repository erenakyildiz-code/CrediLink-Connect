import getProofRequestFromConnId from "./getProofRequestFromConnId";
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
  
  export default async function verifyProof(inviMsgId) {

    var connection = await getConnIdFromInviMsgId(inviMsgId);
    var conn = connection.results[0];
      if(conn == null || conn.state != "active") {
        throw new Error('Connection not established, connect flow must be completed first.');
      }
    var connId = conn.connection_id;
    
    
    var presExId = await getProofRequestFromConnId(connId);
    presExId = presExId.results[0].pres_ex_id;
    var token = await getTokenFromStorage();
    var verifyPresentationHeaders = {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      redirect: "follow",
    };

    var response = await fetch(process.env.DB_URL + "/present-proof-2.0/records/"+presExId+"/verify-presentation", verifyPresentationHeaders);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    response = await response.json();
    return response;

  }
  