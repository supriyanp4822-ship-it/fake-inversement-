const http = require('http');

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api${path}`,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

const runTests = async () => {
  console.log('=== STARTING AUTOMATED INTEGRATION & END-TO-END TEST SUITE ===\n');

  try {
    // 1. Health check
    const health = await request('/health');
    console.log('1. Health Check:', health.status === 200 ? '✅ PASSED' : '❌ FAILED', health.data);

    // 2. User Registration
    const testEmail = `user_${Date.now()}@example.com`;
    const regRes = await request('/auth/register', 'POST', {
      email: testEmail,
      password: 'Password123!',
      fullName: 'Test Auditor User',
    });
    console.log('2. User Registration:', regRes.status === 201 ? '✅ PASSED' : '❌ FAILED', regRes.data.message);
    const userToken = regRes.data?.data?.token;

    // 3. Investment Submission & Risk Scoring
    const invRes = await request(
      '/investments',
      'POST',
      {
        name: 'Quantum Crypto Fund Ltd',
        description: 'Guaranteed 45% monthly crypto returns',
        amount: 250000,
        expectedReturn: 45,
        investorName: 'Unknown Promoter',
        websiteUrl: 'http://suspicious-crypto-returns.com',
        type: 'HYIP',
      },
      userToken
    );
    
    if (invRes.status !== 201) {
      console.log('4. Investment Submission Failed Details:', invRes);
    } else {
      console.log(
        '4. Investment Submission & Risk Scoring: ✅ PASSED',
        `Calculated Score: ${invRes.data?.data?.fraudScore}/100, Status: ${invRes.data?.data?.status}`
      );
    }
    const investmentId = invRes.data?.data?._id;

    if (investmentId) {
      // 5. Fraud Report Creation & Location Saving
      const reportRes = await request(
        '/reports',
        'POST',
        {
          investmentId,
          location: 'Mumbai, Maharashtra, India',
          comments: 'Asked for withdrawal processing fee of ₹15,000.',
        },
        userToken
      );

      if (reportRes.status !== 201) {
        console.log('5. Report Creation Failed Details:', reportRes);
      } else {
        console.log(
          '5. Fraud Report Creation: ✅ PASSED',
          `Report ID: ${reportRes.data?.data?.reportId}`
        );
        const reportId = reportRes.data?.data?.reportId;

        // 6. Public Report Tracking
        const trackRes = await request(`/reports/track/${reportId}`);
        console.log(
          '6. Public Report Tracking:',
          trackRes.status === 200 ? '✅ PASSED' : '❌ FAILED',
          `Tracked Status: ${trackRes.data?.data?.status}`
        );
      }
    }

    // 7. Website Security Check
    const siteCheck = await request('/website-check', 'POST', { url: 'https://google.com' });
    console.log(
      '7. Website Security Check:',
      siteCheck.status === 200 ? '✅ PASSED' : '❌ FAILED',
      `Domain: ${siteCheck.data?.data?.domain}, Risk Level: ${siteCheck.data?.data?.riskLevel}`
    );

    console.log('\n=== END-TO-END TEST SUITE RUN COMPLETE ===');
  } catch (err) {
    console.error('❌ Test suite failed:', err);
  }
};

runTests();
