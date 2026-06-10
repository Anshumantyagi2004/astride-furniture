const https = require('https');

https.get('https://astride-furniture.vercel.app/api/category', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("Categories:", parsed.categories?.map(c => c.name));
    } catch (e) {
      console.error("Error parsing:", e.message);
    }
  });
}).on('error', (err) => {
  console.error("Error fetching:");
});
