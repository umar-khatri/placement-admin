const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  connectionString: 'postgresql://postgres.rlfvcgrvmijjkbvddank:QSY2eITEfte4GmT8@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
});

async function run() {
  try {
    await client.connect();
    const sql = fs.readFileSync('setup.sql', 'utf8');
    await client.query(sql);
    console.log('Setup complete!');
  } catch (err) {
    console.error('Error executing setup', err);
  } finally {
    await client.end();
  }
}

run();
