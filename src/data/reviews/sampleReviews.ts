import { Review, ReviewSummary } from '../../types';

export const SAMPLE_REVIEWS: Record<string, Review[]> = {
  'fw-001': [
    {
      id: 'rev-001',
      productId: 'fw-001',
      author: 'Rohit Sharma',
      rating: 5,
      date: '2 days ago',
      title: 'Best oversized fit I own',
      comment: 'The collar stays tight after washing, shoulders drop naturally without looking sloppy, and the 240 GSM weight feels super luxurious. Definitely grabbing another color.',
      verifiedBuyer: true,
      sizePurchased: 'L',
      fitRating: 'True to Size',
    },
    {
      id: 'rev-002',
      productId: 'fw-001',
      author: 'Aakash Verma',
      rating: 5,
      date: '1 week ago',
      title: 'Unreal pump cover!',
      comment: 'Gymshark quality right here. Heavy fabric holds shape during intense bench press workouts.',
      verifiedBuyer: true,
      sizePurchased: 'XL',
      fitRating: 'True to Size',
    },
    {
      id: 'rev-003',
      productId: 'fw-001',
      author: 'Devendra K.',
      rating: 4,
      date: '2 weeks ago',
      title: 'Great quality, slightly thick for humid summer',
      comment: 'Top tier cotton quality, but in extreme heat you will definitely feel how thick it is. Perfect for air-conditioned gyms and cool evenings though.',
      verifiedBuyer: true,
      sizePurchased: 'M',
      fitRating: 'True to Size',
    },
  ],
  'fw-003': [
    {
      id: 'rev-004',
      productId: 'fw-003',
      author: 'Siddharth M.',
      rating: 5,
      date: '3 days ago',
      title: 'Phone stays locked during sprints',
      comment: 'The liner compression pocket actually holds my iPhone without bouncing at all. Length sits right above the knee.',
      verifiedBuyer: true,
      sizePurchased: 'M',
      fitRating: 'True to Size',
    },
    {
      id: 'rev-005',
      productId: 'fw-003',
      author: 'Karan J.',
      rating: 5,
      date: '2 weeks ago',
      title: 'Deep squat approved',
      comment: 'No tight hip pinching at bottom of parallel squats. Premium feel.',
      verifiedBuyer: true,
      sizePurchased: 'L',
      fitRating: 'True to Size',
    },
  ],
  'fw-004': [
    {
      id: 'rev-006',
      productId: 'fw-004',
      author: 'Vikram Mehta',
      rating: 5,
      date: '4 days ago',
      title: 'Heavyweight perfection',
      comment: 'The double layer hood holds shape upright without flopping down. Super warm fleece interior.',
      verifiedBuyer: true,
      sizePurchased: 'L',
      fitRating: 'True to Size',
    },
  ],
  'fw-005': [
    {
      id: 'rev-007',
      productId: 'fw-005',
      author: 'Priya Patel',
      rating: 5,
      date: 'Yesterday',
      title: '100% squat proof and doesn’t roll down',
      comment: 'I tested these on heavy leg day with deep squats in bright gym lighting. Completely opaque, waistband stays put, and the subtle rib contour is so flattering!',
      verifiedBuyer: true,
      sizePurchased: 'S',
      fitRating: 'True to Size',
    },
    {
      id: 'rev-008',
      productId: 'fw-005',
      author: 'Ananya S.',
      rating: 5,
      date: '5 days ago',
      title: 'Worth every rupee',
      comment: 'Buttery soft and holds you in without suffocating your waist. Getting the slate grey pair too.',
      verifiedBuyer: true,
      sizePurchased: 'M',
      fitRating: 'True to Size',
    },
  ],
};

export const DEFAULT_PRODUCT_REVIEWS: Review[] = [
  {
    id: 'rev-default-1',
    productId: 'generic',
    author: 'Aman G.',
    rating: 5,
    date: '3 days ago',
    title: 'Fantastic athletic quality',
    comment: 'The fabric feels resilient and premium. Stitching is immaculate throughout.',
    verifiedBuyer: true,
    sizePurchased: 'M',
    fitRating: 'True to Size',
  },
  {
    id: 'rev-default-2',
    productId: 'generic',
    author: 'Neha R.',
    rating: 4,
    date: '1 week ago',
    title: 'Very comfortable and stylish',
    comment: 'Fits just right and looks great in the gym and casually outside. Fast delivery too.',
    verifiedBuyer: true,
    sizePurchased: 'S',
    fitRating: 'True to Size',
  },
];

export function calculateReviewSummary(reviews: Review[]): ReviewSummary {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      recommendedPercentage: 0,
    };
  }

  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  let recommendedCount = 0;

  reviews.forEach((r) => {
    const rounded = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    dist[rounded] = (dist[rounded] || 0) + 1;
    sum += r.rating;
    if (r.rating >= 4) recommendedCount++;
  });

  return {
    averageRating: Math.round((sum / reviews.length) * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution: dist,
    recommendedPercentage: Math.round((recommendedCount / reviews.length) * 100),
  };
}

