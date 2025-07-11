import { Email } from './types';

export class MockProviderA {
  async send(email: Email): Promise<boolean> {
    if (Math.random() < 0.7) {
      console.log("Provider A sent email successfully.");
      return true;
    } else {
      throw new Error("Provider A failed to send email.");
    }
  }
}
