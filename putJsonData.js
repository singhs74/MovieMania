const putJSONData = async (updatedData) => {
    const binId = '67166105acd3cb34a89aa6af';  // Your bin ID
    const apiKey = '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y';  // Your API key
    const url = "https://api.jsonbin.io/v3/b/" + binId;

    // Define the login function in the global scope
    window.login = async (firstName, lastName, password, email) => {
        try {
            // Step 1: Fetch existing JSON data
            let jsonData = await getJSONData();
            
            // Step 2: Parse the existing JSON string
            let existingData = JSON.parse(jsonData);
            
            // Step 3: Create a new JSON object
            const newUser = {
                "FirstName": firstName,
                "LastName": lastName,
                "Password": password,
                "Email": email,
                "Log_Job": [] // Initialize with an empty array for nested objects
            };

            // Step 4: Append new user to existing data
            existingData.push(newUser);

            // Step 5: Convert updated array back to JSON string
            let updatedData = JSON.stringify(existingData);

            // Step 6: Save updated JSON array back to jsonbin.io
            await putJSONData(updatedData);
            
            console.log("User data updated successfully.");
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };
};


