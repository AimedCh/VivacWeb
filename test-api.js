const API_BASE_URL = "https://vivac-backend-production.up.railway.app";

async function testRegister() {
  console.log("\n=== Testing Register ===");
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: "testuser" + Date.now(),
        email: "test" + Date.now() + "@example.com",
        password: "TestPassword123!",
      }),
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function testLogin(email, password) {
  console.log("\n=== Testing Login ===");
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function testGetVivacs() {
  console.log("\n=== Testing Get Vivacs ===");
  try {
    const response = await fetch(`${API_BASE_URL}/vivacs`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function runTests() {
  console.log("Starting API tests...");
  const registerData = await testRegister();
  if (registerData && registerData.email) {
    await testLogin(registerData.email, "TestPassword123!");
  }
  await testGetVivacs();
  console.log("\nTests completed!");
}

runTests();
