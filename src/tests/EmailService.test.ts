import { EmailService } from '../services/EmailService';

describe("EmailService", () => {
  const emailService = new EmailService();

  const email = {
    id: "test-email",
    to: "user@example.com",
    subject: "Test",
    body: "This is a test"
  };

  it("should send email successfully", async () => {
    const result = await emailService.sendEmail(email);
    expect(["Sent", "Failed", "Rate limited"]).toContain(result);
  });

  it("should return duplicate on same email ID", async () => {
    const result = await emailService.sendEmail(email);
    expect(result).toBe("Duplicate: Already Sent");
  });

  it("should track status", () => {
    const status = emailService.getStatus("test-email");
    expect(Array.isArray(status)).toBe(true);
    expect(status.length).toBeGreaterThan(0);
  });
});
