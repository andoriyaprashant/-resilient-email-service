export class CircuitBreaker {
  private failureCount = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF' = 'CLOSED';
  private readonly failureThreshold = 3;
  private readonly resetTimeout = 10000;

  async call(fn: () => Promise<any>): Promise<any> {
    if (this.state === 'OPEN') throw new Error('Circuit is OPEN');

    try {
      const result = await fn();
      this.success();
      return result;
    } catch (err) {
      this.failure();
      throw err;
    }
  }

  private success() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private failure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      setTimeout(() => this.state = 'HALF', this.resetTimeout);
    }
  }
}
