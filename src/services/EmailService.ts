import { Email } from "../providers/types";
import { MockProviderA } from "../providers/ProviderA";
import { MockProviderB } from "../providers/ProviderB";
import { isRateLimited } from "../utils/rateLimiter";

export class EmailService {
  private providerA = new MockProviderA();
  private providerB = new MockProviderB();
  private sentEmails = new Set<string>();
  private statusLog: Record<string, string[]> = {};

  async sendEmail(email: Email): Promise<string> {
    if (this.sentEmails.has(email.id)) return "Duplicate: Already Sent";

    if (isRateLimited(email.to)) return "Rate limited";

    const providers = [this.providerA, this.providerB];

    for (let i = 0; i < providers.length; i++) {
      try {
        await this.retrySend(providers[i], email);
        this.sentEmails.add(email.id);
        this.track(email.id, `Success via Provider ${i + 1}`);
        return "Sent";
      } catch (err) {
        this.track(email.id, `Failed via Provider ${i + 1}: ${err}`);
      }
    }

    return "Failed";
  }

  private async retrySend(provider: any, email: Email, retries = 3, delay = 500): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await provider.send(email);
        return;
      } catch (err) {
        if (i < retries - 1) await this.sleep(delay * 2 ** i);
      }
    }
    throw new Error("All retries failed.");
  }

  private sleep(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  private track(id: string, message: string) {
    if (!this.statusLog[id]) this.statusLog[id] = [];
    this.statusLog[id].push(`${new Date().toISOString()} - ${message}`);
  }

  getStatus(id: string): string[] {
    return this.statusLog[id] || [];
  }
}
