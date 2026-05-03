require('dotenv').config();
async function testV1() {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: "test" }] }] })
    });
    const data = await response.json();
    console.log("V1 Response Status:", response.status);
    console.log("V1 Data:", JSON.stringify(data).slice(0, 100));
  } catch (e) {
    console.log("V1 Error:", e.message);
  }
}

testV1();
