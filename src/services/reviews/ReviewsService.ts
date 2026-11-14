import { Review, ReviewSummary } from '../../types';
import { SAMPLE_REVIEWS, DEFAULT_PRODUCT_REVIEWS, calculateReviewSummary } from '../../data/reviews/sampleReviews';

export interface ProductReviewsResponse {
  reviews: Review[];
  summary: ReviewSummary;
}

export class ReviewsService {
  // Flag to simulate provider outage or API network failure
  private static simulateError: boolean = false;

  /**
   * Toggle error simulation on/off for testing and demonstration.
   */
  static setSimulateError(shouldError: boolean): void {
    this.simulateError = shouldError;
  }

  static getIsSimulatingError(): boolean {
    return this.simulateError;
  }

  /**
   * Fetches reviews and ratings for a given product ID.
   * Simulates third-party review provider API call (e.g. Judge.me / Yotpo).
   */
  static async getProductReviews(productId: string): Promise<ProductReviewsResponse> {
    // Simulate API roundtrip latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (this.simulateError) {
      throw new Error('Reviews are temporarily unavailable. Please try again.');
    }

    const reviews = SAMPLE_REVIEWS[productId] || DEFAULT_PRODUCT_REVIEWS;
    const summary = calculateReviewSummary(reviews);

    return {
      reviews,
      summary,
    };
  }

  /**
   * Submit a new customer review (mock operation).
   */
  static async submitReview(
    productId: string,
    review: Omit<Review, 'id' | 'date'>
  ): Promise<Review> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (this.simulateError) {
      throw new Error('Reviews service is temporarily unavailable.');
    }

    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      productId,
      date: 'Just now',
    };

    if (!SAMPLE_REVIEWS[productId]) {
      SAMPLE_REVIEWS[productId] = [];
    }
    SAMPLE_REVIEWS[productId].unshift(newReview);

    return newReview;
  }
}

