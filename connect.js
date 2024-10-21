const getJSONData = async () => {

    // REPLACE YOUR_BIN_ID with the actual ID of your bin
    const binId = '67166105acd3cb34a89aa6af'; 
    
    // Replace YOUR_API_KEY with your JSONbin.io API key
    const apiKey = '$2a$10$rNCXIUrOvgxs9vtgOefRN.NEXyPdkWJmb3u3t1x7GCvfWuzTw8Z.y'; 
    
    const url = "https://api.jsonbin.io/v3/b/"+ binId +"?meta=false";
    //const url = ”https://api.jsonbin.io/v3/b/”+binId+"?meta=false";
    
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    'X-Master-Key': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
      if (response.status !== 200) {
        throw new Error("cannot fetch data");
      }
      let data = await response.json();
      
      
      // Remove the "metadata" and "records" keys from the object
        delete data.metadata;
        delete data.records;
    
        //Convert the modified object back into a JSON string
        data = JSON.stringify(data);
        //this works
        return data;
    };
