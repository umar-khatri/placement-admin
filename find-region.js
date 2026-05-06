const { Client } = require('pg');

const regions = [
  'us-east-1', 'us-west-1', 'us-west-2',
  'ap-southeast-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-2', 'ap-south-1',
  'eu-west-1', 'eu-west-2', 'eu-central-1',
  'ca-central-1', 'sa-east-1'
];

async function tryRegion(region) {
  const client = new Client({
    connectionString: `postgresql://postgres.rlfvcgrvmijjkbvddank:QSY2eITEfte4GmT8@aws-0-${region}.pooler.supabase.com:6543/postgres`,
    connectionTimeoutMillis: 5000,
  });
  
  try {
    await client.connect();
    console.log(`SUCCESS: Region is ${region}`);
    await client.end();
    return true;
  } catch (e) {
    if (e.message.includes('tenant/user') || e.code === 'ENOTFOUND') {
      // wrong region
    } else {
      console.error(`Error on ${region}:`, e.message);
    }
    return false;
  }
}

async function run() {
  for (const region of regions) {
    const found = await tryRegion(region);
    if (found) break;
  }
}

run();
