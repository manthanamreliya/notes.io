import app from "../app";
import { connectDB } from "../config/db";
import { env } from "../config/env";
import { UserModel } from "../models/User.model";
import http from "http";

async function runAuthTest() {
  console.log("Connecting to Database...");
  await connectDB();

  const server = http.createServer(app);
  let port = 0;

  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const addr = server.address() as any;
      port = addr.port;
      console.log(`Test server running on port ${port}`);
      resolve();
    });
  });

  const timestamp = Date.now();
  const testEmail = `testuser_${timestamp}@example.com`;
  const testPassword = "Password123!";
  const testName = "Auth Test User";
  const testRole = "student";

  const baseUrl = `http://localhost:${port}`;

  console.log("\n=========================================");
  console.log("STEP 1: Testing POST /api/auth/signup");
  console.log("=========================================");

  const signupPayload = JSON.stringify({
    name: testName,
    email: testEmail,
    mobileNumber: "9876543210",
    password: testPassword,
  });

  const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: signupPayload,
  });

  const signupStatus = signupRes.status;
  const rawSignupCookies = signupRes.headers.getSetCookie ? signupRes.headers.getSetCookie() : [signupRes.headers.get("set-cookie") || ""];
  const signupBody = await signupRes.json();

  console.log(`Signup Status Code: ${signupStatus}`);
  console.log("Signup Set-Cookie Headers:", rawSignupCookies);
  console.log("Signup Response Body:", JSON.stringify(signupBody, null, 2));

  console.log("\n--- Checking MongoDB User Document after Signup ---");
  const userInDbAfterSignup = await UserModel.findOne({ email: testEmail }).lean();
  console.log("User Document in MongoDB:", JSON.stringify(userInDbAfterSignup, null, 2));

  console.log("\n=========================================");
  console.log("STEP 2: Testing POST /api/auth/login");
  console.log("=========================================");

  const loginPayload = JSON.stringify({
    email: testEmail,
    password: testPassword,
  });

  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: loginPayload,
  });

  const loginStatus = loginRes.status;
  const rawLoginCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [loginRes.headers.get("set-cookie") || ""];
  const loginBody = await loginRes.json();

  console.log(`Login Status Code: ${loginStatus}`);
  console.log("Login Set-Cookie Headers:", rawLoginCookies);
  console.log("Login Response Body:", JSON.stringify(loginBody, null, 2));

  console.log("\n--- Checking MongoDB User Document after Login ---");
  const userInDbAfterLogin = await UserModel.findOne({ email: testEmail }).lean();
  console.log("User Document in MongoDB:", JSON.stringify(userInDbAfterLogin, null, 2));

  console.log("\n=========================================");
  console.log("SUMMARY OF CHECKS:");
  console.log(`1. Signup returned 201: ${signupStatus === 201 ? "PASS" : "FAIL"}`);
  const hasSignupAccessToken = rawSignupCookies.some((c: string) => c.includes("accessToken="));
  const hasSignupRefreshToken = rawSignupCookies.some((c: string) => c.includes("refreshToken="));
  console.log(`2. Signup Set-Cookie contains accessToken: ${hasSignupAccessToken ? "PASS" : "FAIL"}`);
  console.log(`3. Signup Set-Cookie contains refreshToken: ${hasSignupRefreshToken ? "PASS" : "FAIL"}`);
  console.log(`4. User present in MongoDB after Signup: ${userInDbAfterSignup ? "PASS" : "FAIL"}`);
  console.log(`5. Login returned 200: ${loginStatus === 200 ? "PASS" : "FAIL"}`);
  const hasLoginAccessToken = rawLoginCookies.some((c: string) => c.includes("accessToken="));
  const hasLoginRefreshToken = rawLoginCookies.some((c: string) => c.includes("refreshToken="));
  console.log(`6. Login Set-Cookie contains accessToken: ${hasLoginAccessToken ? "PASS" : "FAIL"}`);
  console.log(`7. Login Set-Cookie contains refreshToken: ${hasLoginRefreshToken ? "PASS" : "FAIL"}`);
  console.log("=========================================\n");

  server.close();
  process.exit(0);
}

runAuthTest().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
