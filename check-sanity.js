import { client } from './src/lib/sanity.client.js';

async function checkData() {
  const result = await client.fetch(`*[_type == "staticPage" && slug.current == "write-for-us"][0]`);
  console.log(JSON.stringify(result, null, 2));
}

checkData();
