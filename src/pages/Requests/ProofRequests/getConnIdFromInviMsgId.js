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
  
  export default async function getConnIdFromInviMsgId(inviMsgId) {


    var token = await getTokenFromStorage();
var requestOptions = {
    method: "GET",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json", // Make sure to send JSON data
      "Authorization": `Bearer ${token}` // Add the JWT token to the headers
    },
    redirect: "follow",
  };

  // Await the fetch call and parse the response as JSON
  const response = await fetch(process.env.DB_URL + "/connections?invitation_msg_id="+inviMsgId, requestOptions);

  // Check if the response is OK (status code 200-299)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Parse the response as JSON
  const result = await response.json();
  console.log(result);
  return result;
  }
  