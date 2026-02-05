import { test, expect } from "@playwright/test";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

test.describe("Users API", () => {
  test("list users returns a non-empty array", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/users`);

    // Basic response sanity
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();

    // Shape checks
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const firstUser = body[0];
    expect(firstUser).toHaveProperty("id");
    expect(firstUser).toHaveProperty("name");
    expect(firstUser).toHaveProperty("email");
  });

  test("create user echoes back sent fields", async ({ request }) => {
    const payload = {
      title: "Test post from Playwright",
      body: "Hello from api-users.spec.ts",
      userId: 1,
    };

    const response = await request.post(`${API_BASE_URL}/posts`, {
      data: payload,
    });

    expect(response.status()).toBeGreaterThan(200);
    expect(response.status()).toBeLessThan(300);

    const body = await response.json();

    expect(body.title).toBe(payload.title);
    expect(body.body).toBe(payload.body);
    expect(body.userId).toBe(payload.userId);
    expect(body).toHaveProperty("id");
  });
});
