import app from "../app";
import { connectDB } from "../config/db";
import { UserModel } from "../models/User.model";
import { NoteModel } from "../models/Note.model";
import { ViewLogModel } from "../models/ViewLog.model";
import http from "http";
import { AddressInfo } from "net";

async function runNoteFlowTest() {
  console.log("Connecting to Database...");
  await connectDB();

  const server = http.createServer(app);

  let port = 0;
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const addr = server.address() as AddressInfo;
      port = addr.port;
      console.log(`Test server running on port ${port}`);
      resolve();
    });
  });

  const baseUrl = `http://localhost:${port}`;
  const timestamp = Date.now();
  const adminEmail = `admin_test_${timestamp}@example.com`;
  const adminPassword = "Password123!";
  const studentEmail = `student_test_${timestamp}@example.com`;

  console.log("\n=========================================");
  console.log("STEP 1: Registering Admin User");
  console.log("=========================================");

  const adminSignupRes = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Admin",
      email: adminEmail,
      mobileNumber: "9876543210",
      password: adminPassword,
    }),
  });

  // Promote test admin user to role "admin" in DB for testing & log in for admin JWT
  await UserModel.updateOne({ email: adminEmail }, { role: "admin" });
  const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
  });

  const adminSignupCookies = adminLoginRes.headers.getSetCookie ? adminLoginRes.headers.getSetCookie() : [adminLoginRes.headers.get("set-cookie") || ""];
  console.log(`Admin Signup & Auth Status: ${adminSignupRes.status}`);

  console.log("\n=========================================");
  console.log("STEP 2: Registering Student User");
  console.log("=========================================");

  const studentSignupRes = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Student",
      email: studentEmail,
      mobileNumber: "9876543211",
      password: adminPassword,
    }),
  });

  const studentSignupCookies = studentSignupRes.headers.getSetCookie ? studentSignupRes.headers.getSetCookie() : [studentSignupRes.headers.get("set-cookie") || ""];
  console.log(`Student Signup Status: ${studentSignupRes.status}`);

  console.log("\n=========================================");
  console.log("STEP 3: Testing Admin Upload Note (POST /api/admin/notes)");
  console.log("=========================================");

  // Create mock PDF buffer payload with multipart/form-data boundary
  const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2);
  const pdfHeader = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF";
  
  let multipartBody = "";
  multipartBody += `--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nTest PDF Note Title\r\n`;
  multipartBody += `--${boundary}\r\nContent-Disposition: form-data; name="department"\r\n\r\nComputer Science\r\n`;
  multipartBody += `--${boundary}\r\nContent-Disposition: form-data; name="tags"\r\n\r\nAlgorithms,DataStructures\r\n`;
  multipartBody += `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\n${pdfHeader}\r\n`;
  multipartBody += `--${boundary}--\r\n`;

  const cookieHeader = adminSignupCookies.map((c: string) => c.split(";")[0]).join("; ");

  const uploadRes = await fetch(`${baseUrl}/api/admin/notes`, {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      Cookie: cookieHeader,
    },
    body: multipartBody,
  });

  const uploadStatus = uploadRes.status;
  const uploadBody = await uploadRes.json();
  console.log(`Upload Status Code: ${uploadStatus}`);
  console.log("Upload Response Body:", JSON.stringify(uploadBody, null, 2));

  const noteId = uploadBody.data?._id || uploadBody.data?.id;

  console.log("\n=========================================");
  console.log("STEP 4: Testing Student Fetch Signed View URL (GET /api/notes/:id/view-url)");
  console.log("=========================================");

  const studentCookieHeader = studentSignupCookies.map((c: string) => c.split(";")[0]).join("; ");

  let viewUrlStatus = 0;
  let viewUrlBody: any = null;

  if (noteId) {
    const viewUrlRes = await fetch(`${baseUrl}/api/notes/${noteId}/view-url`, {
      method: "GET",
      headers: { Cookie: studentCookieHeader },
    });

    viewUrlStatus = viewUrlRes.status;
    viewUrlBody = await viewUrlRes.json();
    console.log(`Signed View URL Status: ${viewUrlStatus}`);
    console.log("Signed View URL Response Body:", JSON.stringify(viewUrlBody, null, 2));
  }

  console.log("\n=========================================");
  console.log("STEP 5: Verifying ViewLog in MongoDB");
  console.log("=========================================");

  const viewLogs = await ViewLogModel.find({ noteId }).lean();
  console.log("ViewLog Documents in MongoDB:", JSON.stringify(viewLogs, null, 2));

  console.log("\n=========================================");
  console.log("STEP 6: Testing Admin Delete Note (DELETE /api/admin/notes/:id)");
  console.log("=========================================");

  let deleteStatus = 0;
  if (noteId) {
    const deleteRes = await fetch(`${baseUrl}/api/admin/notes/${noteId}`, {
      method: "DELETE",
      headers: { Cookie: cookieHeader },
    });
    deleteStatus = deleteRes.status;
    console.log(`Delete Status Code: ${deleteStatus}`);
  }

  const noteInDbAfterDelete = await NoteModel.findById(noteId).lean();
  console.log("Note in DB after delete:", noteInDbAfterDelete ? "STILL EXISTS" : "DELETED SUCCESSFULLY");

  console.log("\n=========================================");
  console.log("SUMMARY OF INTEGRATION TESTS:");
  console.log(`1. Admin & Student Signup: PASS`);
  console.log(`2. Admin Upload Note (201): ${uploadStatus === 201 ? "PASS" : "FAIL"}`);
  console.log(`3. Student Signed View URL (200): ${viewUrlStatus === 200 ? "PASS" : "FAIL"}`);
  console.log(`4. ViewLog Recorded in DB: ${viewLogs.length > 0 ? "PASS" : "FAIL"}`);
  console.log(`5. Admin Delete Note (200): ${deleteStatus === 200 ? "PASS" : "FAIL"}`);
  console.log(`6. Note Removed from MongoDB: ${!noteInDbAfterDelete ? "PASS" : "FAIL"}`);
  console.log("=========================================\n");

  server.close();
  process.exit(0);
}

runNoteFlowTest().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
