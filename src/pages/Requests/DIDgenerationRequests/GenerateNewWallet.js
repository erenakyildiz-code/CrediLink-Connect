export default async function generateNewWallet(request) {
  // Convert the request object to a JSON string
  var raw = JSON.stringify(request);

  // Define the request options
  var requestOptions = {
    method: "POST",
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json", // Make sure to send JSON data
    },
    body: raw,
    redirect: "follow",
  };

  try {
    // Await the fetch call and parse the response as JSON
    const response = await fetch(process.env.DB_URL + "/multitenancy/wallet", requestOptions);

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response as JSON
    const result = await response.json();
    

    return result; // Return the parsed JSON result
  } catch (error) {
    console.error("Error during wallet creation:", error);
    throw error; // Re-throw the error so it can be caught elsewhere if needed
  }
}
