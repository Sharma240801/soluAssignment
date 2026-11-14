export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  sizePurchased?: string;
  fitRating?: 'Runs Small' | 'True to Size' | 'Runs Large';
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recommendedPercentage: number;
}

