'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth';
import { StarRating } from '@/components/ui/StarRating';
import {
  ref,
  push,
  set,
  get,
  query,
  orderByChild,
  limitToLast,
  onValue,
  remove,
  update,
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { DB_PATHS } from '@/types/firebase';
import {
  MessageSquare,
  Send,
  Trash2,
  Edit2,
  MoreVertical,
  ThumbsUp,
  Clock,
  User,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  content: string;
  createdAt: number;
  updatedAt?: number;
  likes?: number;
  likedBy?: Record<string, boolean>;
}

interface MovieReviewsProps {
  movieSlug: string;
  movieName: string;
}

export function MovieReviews({ movieSlug, movieName }: MovieReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Form state
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);

  // Load reviews
  useEffect(() => {
    const reviewsRef = ref(database, `${DB_PATHS.comments}/${movieSlug}`);
    const reviewsQuery = query(reviewsRef, orderByChild('createdAt'), limitToLast(50));

    const unsubscribe = onValue(reviewsQuery, (snapshot) => {
      if (!snapshot.exists()) {
        setReviews([]);
        setLoading(false);
        return;
      }

      const data: Review[] = [];
      snapshot.forEach((child) => {
        data.push({
          id: child.key!,
          ...child.val(),
        });
      });

      // Sort newest first
      setReviews(data.reverse());
      setLoading(false);
    });

    return () => unsubscribe();
  }, [movieSlug]);

  // Check if user already reviewed
  const userReview = reviews.find((r) => r.userId === user?.uid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const reviewsRef = ref(database, `${DB_PATHS.comments}/${movieSlug}`);
      const newReviewRef = push(reviewsRef);
      
      await set(newReviewRef, {
        userId: user.uid,
        userName: user.displayName || 'Người dùng',
        userPhoto: user.photoURL || null,
        rating,
        content: content.trim(),
        createdAt: Date.now(),
        likes: 0,
      });

      setContent('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (reviewId: string) => {
    if (!editContent.trim()) return;

    try {
      const reviewRef = ref(database, `${DB_PATHS.comments}/${movieSlug}/${reviewId}`);
      await update(reviewRef, {
        content: editContent.trim(),
        rating: editRating,
        updatedAt: Date.now(),
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
      const reviewRef = ref(database, `${DB_PATHS.comments}/${movieSlug}/${reviewId}`);
      await remove(reviewRef);
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleLike = async (review: Review) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const reviewRef = ref(database, `${DB_PATHS.comments}/${movieSlug}/${review.id}`);
    const hasLiked = review.likedBy?.[user.uid];

    try {
      if (hasLiked) {
        await update(reviewRef, {
          likes: (review.likes || 1) - 1,
          [`likedBy/${user.uid}`]: null,
        });
      } else {
        await update(reviewRef, {
          likes: (review.likes || 0) + 1,
          [`likedBy/${user.uid}`]: true,
        });
      }
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-to-b from-violet-600 to-purple-600 rounded-full" />
          Đánh giá & Bình luận
          <span className="text-sm font-normal text-white/50">({reviews.length})</span>
        </h2>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <StarRating value={avgRating} readonly size="sm" />
            <span className="text-white/70">{avgRating.toFixed(1)}/5</span>
          </div>
        )}
      </div>

      {/* Write Review Form */}
      {!userReview && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            Viết đánh giá của bạn
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/60">Đánh giá:</span>
              <StarRating value={rating} onChange={setRating} size="md" />
            </div>

            {/* Content */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={user ? "Chia sẻ cảm nhận của bạn về phim này..." : "Đăng nhập để viết đánh giá"}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-violet-500/50 resize-none min-h-[100px]"
                disabled={!user}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={cn(
                'glass-card rounded-xl p-4',
                review.userId === user?.uid && 'border-violet-500/30'
              )}
            >
              {editingId === review.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/60">Đánh giá:</span>
                    <StarRating value={editRating} onChange={setEditRating} size="sm" />
                  </div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500/50 resize-none min-h-[80px]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(review.id)}
                      className="p-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {review.userPhoto ? (
                          <Image
                            src={review.userPhoto}
                            alt={review.userName}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{review.userName}</span>
                          {review.userId === user?.uid && (
                            <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full">
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <StarRating value={review.rating} readonly size="xs" />
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(review.createdAt)}
                          </span>
                          {review.updatedAt && (
                            <span className="text-xs">(đã sửa)</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {review.userId === user?.uid && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingId(review.id);
                            setEditContent(review.content);
                            setEditRating(review.rating);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                          title="Sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors text-white/50 hover:text-red-400"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <p className="mt-3 text-white/80 whitespace-pre-wrap">{review.content}</p>

                  {/* Like */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleLike(review)}
                      className={cn(
                        'flex items-center gap-1.5 text-sm transition-colors',
                        review.likedBy?.[user?.uid || '']
                          ? 'text-violet-400'
                          : 'text-white/50 hover:text-white'
                      )}
                    >
                      <ThumbsUp className={cn(
                        'w-4 h-4',
                        review.likedBy?.[user?.uid || ''] && 'fill-current'
                      )} />
                      <span>{review.likes || 0} thích</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
