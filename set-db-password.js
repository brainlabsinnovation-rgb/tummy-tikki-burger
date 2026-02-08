const https = require('https');

const data = JSON.stringify({
  password: 'TummyTikkiDB2026!'
});

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: '/v1/projects/xjqlldjwhvoqbnlnqxze/database/password',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sbp_1e967f39c19bedadc0c4dfee2b4d943a3d6a4aad',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
