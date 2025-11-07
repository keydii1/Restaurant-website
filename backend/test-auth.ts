import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "http://localhost:3000"; // Adjust port if needed

interface TestResult {
  name: string;
  status: "PASS" | "FAIL";
  message: string;
  error?: any;
}

const results: TestResult[] = [];

async function runTests() {
  console.log("🧪 Starting Authentication Tests\n");

  // Test 1: Get dishes WITHOUT token (should fail)
  try {
    console.log("Test 1: GET /dishes without token...");
    const response = await axios.get(`${API_URL}/api/v1/dishes`);
    results.push({
      name: "GET dishes without token",
      status: "FAIL",
      message: "Should have failed but succeeded (expected 401/Unauthorized)",
      error: response.data,
    });
    console.log("❌ FAILED - Should require authentication\n");
  } catch (error: any) {
    if (
      error.response?.status === 401 ||
      error.response?.data?.message?.includes("đăng nhập")
    ) {
      results.push({
        name: "GET dishes without token",
        status: "PASS",
        message: "Correctly rejected request without token",
      });
      console.log("✅ PASSED - Request correctly rejected\n");
    } else {
      results.push({
        name: "GET dishes without token",
        status: "FAIL",
        message: `Unexpected error: ${error.message}`,
        error: error.response?.data || error.message,
      });
      console.log("❌ FAILED - Unexpected error\n");
    }
  }

  // Test 2: Attempt login (assuming user exists)
  console.log("Test 2: Attempting to login...");
  let token: string | null = null;
  try {
    // You need to have a user created with username/email
    const loginResponse = await axios.post(`${API_URL}/api/v1/auth/login`, {
      email: "test@example.com", // Update with your test user
      password: "password123", // Update with the correct password
    });

    token = loginResponse.data?.data?.token;

    if (token) {
      results.push({
        name: "User Login",
        status: "PASS",
        message: "Successfully obtained authentication token",
      });
      console.log("✅ PASSED - Token obtained\n");
    } else {
      results.push({
        name: "User Login",
        status: "FAIL",
        message: "Login succeeded but no token returned",
      });
      console.log("❌ FAILED - No token returned\n");
    }
  } catch (error: any) {
    results.push({
      name: "User Login",
      status: "FAIL",
      message: `Login failed: ${error.message}`,
      error: error.response?.data || error.message,
    });
    console.log(`❌ FAILED - ${error.message}\n`);
  }

  // Test 3: Get dishes WITH token (should succeed)
  if (token) {
    console.log("Test 3: GET /dishes with valid token...");
    try {
      const response = await axios.get(`${API_URL}/api/v1/dishes`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });

      if (response.data?.data) {
        results.push({
          name: "GET dishes with valid token",
          status: "PASS",
          message: `Successfully fetched ${response.data.data.length} dishes`,
        });
        console.log(
          `✅ PASSED - Fetched ${response.data.data.length} dishes\n`
        );
      } else {
        results.push({
          name: "GET dishes with valid token",
          status: "FAIL",
          message: "Response missing data field",
        });
        console.log("❌ FAILED - Invalid response format\n");
      }
    } catch (error: any) {
      results.push({
        name: "GET dishes with valid token",
        status: "FAIL",
        message: `Request failed: ${error.message}`,
        error: error.response?.data || error.message,
      });
      console.log(`❌ FAILED - ${error.message}\n`);
    }
  }

  // Test 4: Get dishes with INVALID token (should fail)
  console.log("Test 4: GET /dishes with invalid token...");
  try {
    const response = await axios.get(`${API_URL}/api/v1/dishes`, {
      headers: {
        Cookie: "token=invalid_token_here",
      },
    });
    results.push({
      name: "GET dishes with invalid token",
      status: "FAIL",
      message: "Should have failed but succeeded",
      error: response.data,
    });
    console.log("❌ FAILED - Should reject invalid token\n");
  } catch (error: any) {
    if (
      error.response?.status === 401 ||
      error.response?.data?.message?.includes("đăng nhập")
    ) {
      results.push({
        name: "GET dishes with invalid token",
        status: "PASS",
        message: "Correctly rejected request with invalid token",
      });
      console.log("✅ PASSED - Invalid token correctly rejected\n");
    } else {
      results.push({
        name: "GET dishes with invalid token",
        status: "FAIL",
        message: `Unexpected error: ${error.message}`,
        error: error.response?.data || error.message,
      });
      console.log("❌ FAILED - Unexpected error\n");
    }
  }

  // Print Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50) + "\n");

  let passed = 0;
  let failed = 0;

  results.forEach((result) => {
    if (result.status === "PASS") {
      passed++;
      console.log(`✅ ${result.name}`);
      console.log(`   ${result.message}\n`);
    } else {
      failed++;
      console.log(`❌ ${result.name}`);
      console.log(`   ${result.message}`);
      if (result.error) {
        console.log(`   Error: ${JSON.stringify(result.error)}\n`);
      }
    }
  });

  console.log("=".repeat(50));
  console.log(`Total: ${passed} PASSED, ${failed} FAILED`);
  console.log("=".repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error("Test runner error:", error);
  process.exit(1);
});
