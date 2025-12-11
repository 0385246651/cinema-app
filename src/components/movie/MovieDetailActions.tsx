'use client';

import React from 'react';
import { MovieActions } from '@/components/movie/MovieActions';
import type { MovieDetail } from '@/types';

interface MovieDetailActionsProps {
  movie: MovieDetail['movie'];
}

export function MovieDetailActions({ movie }: MovieDetailActionsProps) {
  return <MovieActions movie={movie} />;
}
