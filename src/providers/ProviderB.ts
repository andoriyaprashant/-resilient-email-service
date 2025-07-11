import { Email } from './types';

export class MockProviderB {
  async send(email: Email): Promise<boolean> {
    if (Math.random() < 0.5) {
      console.log("Provider B sent email successfully.");
      return true;
    } else {
      throw new Error("Provider B failed to send email.");
    }
  }
}
