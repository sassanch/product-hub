import { describe, expect, it } from "vitest";
import { isAllowedGoogleProfile, isPublicAuthPath, safeCallbackPath } from "@/lib/auth-policy";

describe("Google Workspace authentication policy", () => {
  it("accepts only verified profiles from the configured hosted domain", () => {
    expect(isAllowedGoogleProfile({ email_verified: true, hd: "plei.com" }, "plei.com")).toBe(true);
    expect(isAllowedGoogleProfile({ email_verified: true, hd: "gmail.com" }, "plei.com")).toBe(false);
    expect(isAllowedGoogleProfile({ email_verified: true }, "plei.com")).toBe(false);
    expect(isAllowedGoogleProfile({ email_verified: false, hd: "plei.com" }, "plei.com")).toBe(false);
  });

  it("keeps redirects on internal paths", () => {
    expect(safeCallbackPath("/projects/abc?tab=notes#latest")).toBe("/projects/abc?tab=notes#latest");
    expect(safeCallbackPath("https://evil.example/steal")).toBe("/");
    expect(safeCallbackPath("//evil.example/steal")).toBe("/");
  });

  it("leaves only the login and Auth.js endpoints public", () => {
    expect(isPublicAuthPath("/login")).toBe(true);
    expect(isPublicAuthPath("/api/auth/callback/google")).toBe(true);
    expect(isPublicAuthPath("/")).toBe(false);
    expect(isPublicAuthPath("/api/roadmap")).toBe(false);
  });
});
