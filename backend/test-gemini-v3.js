const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testV1() {
    // Try passing the API version in the config if possible, or just check the URL.
    // Actually, the SDK default might be v1beta.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Note: The SDK doesn't expose a simple way to change the version in the constructor 
    // without digging into the Fetch options, but let's try gemini-pro which should be available in v1.
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("Success with 1.5-flash");
    } catch (e) {
        console.log("Error:", e.message);
    }
}

testV1();
