'use client';

import React from 'react';
import { MovieReviews } from './MovieReviews';

interface MovieReviewsSectionProps {
  movieSlug: string;
  movieName: string;
}

export function MovieReviewsSection({ movieSlug, movieName }: MovieReviewsSectionProps) {
  return <MovieReviews movieSlug={movieSlug} movieName={movieName} />;
}
