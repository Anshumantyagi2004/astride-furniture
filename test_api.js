const https = require('https');

https.get('https://astride-furniture.vercel.app/api/product', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("Dynamic products count:", parsed.products?.length);
      parsed.products.forEach(p => {
        console.log(`Product: ${p.productName} | Category: ${JSON.stringify(p.category)}`);
      });
    } catch (e) {
      console.error("Error parsing:", e.message);
    }
  });
}).on('error', (err) => {
  console.error("Error fetching:", err.message);
});
