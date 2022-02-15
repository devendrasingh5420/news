const fetch = require("node-fetch")
const http = require("http");

const PORT = process.env.PORT || 5000;

const getRawData = (URL) => {
    return fetch(URL)
       .then((response) => response.text())
       .then((data) => {
          return data;
       });
 };

 // URL for data
const URL = "https://time.com/";

//start the program
const data = async () => {
    const rawData = await getRawData(URL);
    let index = rawData.indexOf("most-popular-feed__item-container");

    dataOfInterest = rawData.slice(index);
    var className = "most-popular-feed__item-headline";
    const classNameLength = className.length;
    var linkHref = "<a href=";
    const linkHrefLength = linkHref.length;

    var headline = [];
    var link = [];
    var itr= 0;

    while (dataOfInterest.indexOf(className)!=-1){
        var idx1 = dataOfInterest.indexOf(linkHref) + linkHrefLength;
        var base = "https://time.com";
        var idx2 = idx1;

        while (dataOfInterest[idx2]!=">")
            idx2+=1;
        idx2--;
        var address = dataOfInterest.slice(idx1+1,idx2);

        base = base.concat(address);
        // console.log(base);

        link[itr] = base;

        idx1 = dataOfInterest.indexOf(className) + classNameLength;
        while (dataOfInterest[idx1]!=">"){
            idx1+=1;
        }
        idx1++;
        idx2 = dataOfInterest.indexOf("</h3>");

        headline[itr] = dataOfInterest.slice(idx1,idx2);  

        // console.log(dataOfInterest.slice(idx1,idx2));
        // console.log("\n");
        
        itr+=1;
        dataOfInterest = dataOfInterest.slice(idx2+5);

        
    }
    
    let text = '['; 
    for (let i=0;i<5;i++){
        text = text + '{ "title" : "' + 
                String(headline[i]) + '"' +
                ',' +   "\n" + 
                ' "link": "' +
                String(link[i]) + '"' +
                "}," + "\n"
    }
    text = text.slice(0,text.length-2);
    text += "]";

    const server = http.createServer(async (req, res) => {
    //set the request route
    if (req.url === "/getTimeStories" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        
         const obj = JSON.parse(text);
         console.log(obj);
        res.write(text);
        res.end();
    }

    // If no route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
    });
    server.listen(PORT, () => {
        console.log(`server started on port: ${PORT}`);
    });
   
 };
 data();
 



