const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 7000;

const server = http.createServer(async (req, response) => {
    
    if (req.url === "/getTimeStories" && req.method === "GET")
    {
       
       let result = [];
       response.writeHead(200, { "Content-Type": "application/json" });
        
       https.get('https://time.com', res => 
       {
          let data = [];

          res.on('data', chunk => {
            data.push(chunk);
          });

          res.on('end', () => {

            let htmlStr = Buffer.concat(data).toString(); 
            const out = htmlStr.matchAll(/<li class="latest-stories__item">([\s\S]*?)<\/li>/g)  
            const BASE_URL = 'https://time.com'
            for (const m of out) 
            {
                if (result.length == 6) 
                {
                  break;
                }
                let stories = {
                  title: m[1].match(/<h3 class="latest-stories__item-headline">([\s\S]*?)<\/h3>/)[1],
                  link: BASE_URL + m[1].match(/<a href="([\s\S]*?)">/)[1]
                 };
                 result.push(stories)
            }
             response.end(JSON.stringify(result));
           });
         
        }).on('error', err => {
           console.log('Error: ', err.message);
           response.end(JSON.stringify({ message: err.message }))
      });
    }
    else 
    {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ message: "Route Error" }));
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
