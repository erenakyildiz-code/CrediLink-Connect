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
  
  export default async function getCredentials() {

    try {
        const token = await getTokenFromStorage();
       
        var getRequestOptions = {
          method: "GET",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json", // Make sure to send JSON data
            "Authorization": `Bearer ${token}` // Add the JWT token to the headers
          },
          redirect: "follow",
        };

        // Await the fetch call and parse the response as JSON
        const credentialsRes = await fetch(process.env.DB_URL + "/credentials", getRequestOptions);
        if (!credentialsRes.ok) {
            throw new Error(`HTTP error! status: ${responseOfStore.status}`);
          }
        var response = await credentialsRes.json();
      

      return response; // Return the parsed JSON result
    } catch (error) {
      console.error("Error during credential exchange:", error);
      throw error; // Re-throw the error so it can be caught elsewhere if needed
    }
  }
  