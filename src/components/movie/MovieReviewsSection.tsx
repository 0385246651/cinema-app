'use client';

import React from 'react';
import { MovieReviews } from './MovieReviews';

interface MovieReviewsSectionProps {
  movieSlug: string;
  movieName: string;
  moviePoster?: string;
}

export function MovieReviewsSection({ movieSlug, movieName, moviePoster }: MovieReviewsSectionProps) {
  return <MovieReviews movieSlug={movieSlug} movieName={movieName} moviePoster={moviePoster} />;
}
