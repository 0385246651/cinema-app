import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
  limitToLast,
  serverTimestamp,
} from 'firebase/database';
import { database } from '@/lib/firebase';

// ============================================
// FRIEND SYSTEM
// ============================================

/**
 * Send friend request
 */
export async function sendFriendRequest(
  fromUser: { uid: string; displayName: string | null; photoURL: string | null },
  toUserId: string
): Promise<void> {
  // Check if already friends or pending
  const existingRef = ref(database, `friends/${fromUser.uid}/${toUserId}`);
  const existing = await get(existingRef);
  if (existing.exists()) {
    throw new Error('Đã là bạn bè');
  }

  const pendingRef = ref(database, `friendRequests/${toUserId}/${fromUser.uid}`);
  const pending = await get(pendingRef);
  if (pending.exists()) {
    throw new Error('Đã gửi lời mời kết bạn');
  }

  // Create friend request
  await set(pendingRef, {
    fromUserId: fromUser.uid,
    fromUserName: fromUser.displayName || 'Người dùng',
    fromUserPhoto: fromUser.photoURL || null,
    toUserId,
    status: 'pending',
    createdAt: Date.now(),
  });
}

/**
 * Accept friend request
 */
export async function acceptFriendRequest(
  currentUser: { uid: string; displayName: string | null; photoURL: string | null },
  request: { fromUserId: string; fromUserName: string; fromUserPhoto?: string }
): Promise<void> {
  // Add to both users' friends list
  const updates: Record<string, any> = {};
  
  // Add friend for current user
  updates[`friends/${currentUser.uid}/${request.fromUserId}`] = {
    odUserId: request.fromUserId,
    userName: request.fromUserName,
    userPhoto: request.fromUserPhoto || null,
    addedAt: Date.now(),
  };
  
  // Add friend for requester
  updates[`friends/${request.fromUserId}/${currentUser.uid}`] = {
    odUserId: currentUser.uid,
    userName: currentUser.displayName || 'Người dùng',
    userPhoto: currentUser.photoURL || null,
    addedAt: Date.now(),
  };
  
  // Remove friend request
  updates[`friendRequests/${currentUser.uid}/${request.fromUserId}`] = null;
  
  await update(ref(database), updates);
}

/**
 * Reject friend request
 */
export async function rejectFriendRequest(
  currentUserId: string,
  fromUserId: string
): Promise<void> {
  await remove(ref(database, `friendRequests/${currentUserId}/${fromUserId}`));
}

/**
 * Remove friend
 */
export async function removeFriend(
  currentUserId: string,
  friendId: string
): Promise<void> {
  const updates: Record<string, any> = {};
  updates[`friends/${currentUserId}/${friendId}`] = null;
  updates[`friends/${friendId}/${currentUserId}`] = null;
  await update(ref(database), updates);
}

/**
 * Get friend requests
 */
export function subscribeFriendRequests(
  userId: string,
  callback: (requests: any[]) => void
): () => void {
  const requestsRef = ref(database, `friendRequests/${userId}`);
  
  const unsubscribe = onValue(requestsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const requests: any[] = [];
    snapshot.forEach((child) => {
      if (child.val().status === 'pending') {
        requests.push({ id: child.key, ...child.val() });
      }
    });
    callback(requests);
  });

  return () => off(requestsRef);
}

/**
 * Get friends list
 */
export function subscribeFriends(
  userId: string,
  callback: (friends: any[]) => void
): () => void {
  const friendsRef = ref(database, `friends/${userId}`);
  
  const unsubscribe = onValue(friendsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const friends: any[] = [];
    snapshot.forEach((child) => {
      friends.push({ odUserId: child.key, ...child.val() });
    });
    
    // Sort by last message time
    friends.sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0));
    callback(friends);
  });

  return () => off(friendsRef);
}

/**
 * Check if users are friends
 */
export async function areFriends(
  userId1: string,
  userId2: string
): Promise<boolean> {
  const friendRef = ref(database, `friends/${userId1}/${userId2}`);
  const snapshot = await get(friendRef);
  return snapshot.exists();
}

// ============================================
// PRIVATE MESSAGING
// ============================================

/**
 * Get chat ID for two users (sorted to ensure consistency)
 */
export function getChatId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_');
}

/**
 * Send private message
 */
export async function sendPrivateMessage(
  sender: { uid: string; displayName: string | null; photoURL: string | null },
  receiverId: string,
  message: string
): Promise<void> {
  const chatId = getChatId(sender.uid, receiverId);
  const messagesRef = ref(database, `privateMessages/${chatId}`);
  const newMessageRef = push(messagesRef);
  
  await set(newMessageRef, {
    chatId,
    senderId: sender.uid,
    senderName: sender.displayName || 'Người dùng',
    senderPhoto: sender.photoURL || null,
    receiverId,
    message,
    createdAt: Date.now(),
    read: false,
  });

  // Update last message in friends list for both users
  const updates: Record<string, any> = {};
  updates[`friends/${sender.uid}/${receiverId}/lastMessage`] = message;
  updates[`friends/${sender.uid}/${receiverId}/lastMessageAt`] = Date.now();
  updates[`friends/${receiverId}/${sender.uid}/lastMessage`] = message;
  updates[`friends/${receiverId}/${sender.uid}/lastMessageAt`] = Date.now();
  
  // Increment unread count for receiver
  const friendRef = ref(database, `friends/${receiverId}/${sender.uid}/unreadCount`);
  const unreadSnapshot = await get(friendRef);
  const currentUnread = unreadSnapshot.exists() ? unreadSnapshot.val() : 0;
  updates[`friends/${receiverId}/${sender.uid}/unreadCount`] = currentUnread + 1;
  
  await update(ref(database), updates);
}

/**
 * Subscribe to private messages
 */
export function subscribePrivateMessages(
  userId1: string,
  userId2: string,
  callback: (messages: any[]) => void
): () => void {
  const chatId = getChatId(userId1, userId2);
  const messagesRef = ref(database, `privateMessages/${chatId}`);
  const messagesQuery = query(messagesRef, orderByChild('createdAt'), limitToLast(100));
  
  const unsubscribe = onValue(messagesQuery, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const messages: any[] = [];
    snapshot.forEach((child) => {
      messages.push({ id: child.key, ...child.val() });
    });
    callback(messages);
  });

  return () => off(messagesRef);
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  currentUserId: string,
  friendId: string
): Promise<void> {
  const chatId = getChatId(currentUserId, friendId);
  const messagesRef = ref(database, `privateMessages/${chatId}`);
  const snapshot = await get(messagesRef);
  
  if (!snapshot.exists()) return;
  
  const updates: Record<string, any> = {};
  snapshot.forEach((child) => {
    const msg = child.val();
    if (msg.receiverId === currentUserId && !msg.read) {
      updates[`privateMessages/${chatId}/${child.key}/read`] = true;
    }
  });
  
  // Reset unread count
  updates[`friends/${currentUserId}/${friendId}/unreadCount`] = 0;
  
  if (Object.keys(updates).length > 0) {
    await update(ref(database), updates);
  }
}

/**
 * Get total unread messages count
 */
export function subscribeUnreadCount(
  userId: string,
  callback: (count: number) => void
): () => void {
  const friendsRef = ref(database, `friends/${userId}`);
  
  const unsubscribe = onValue(friendsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(0);
      return;
    }
    
    let totalUnread = 0;
    snapshot.forEach((child) => {
      totalUnread += child.val().unreadCount || 0;
    });
    callback(totalUnread);
  });

  return () => off(friendsRef);
}

// ============================================
// USER SEARCH
// ============================================

/**
 * Search users by display name (basic search)
 */
export async function searchUsers(
  searchTerm: string,
  currentUserId: string
): Promise<any[]> {
  // Note: Firebase doesn't support full-text search
  // This searches in user profiles if we have them
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  
  if (!snapshot.exists()) return [];
  
  const users: any[] = [];
  const term = searchTerm.toLowerCase();
  
  snapshot.forEach((child) => {
    const user = child.val();
    if (
      child.key !== currentUserId &&
      (user.displayName?.toLowerCase().includes(term) ||
       user.email?.toLowerCase().includes(term))
    ) {
      users.push({
        odUserId: child.key,
        ...user,
      });
    }
  });
  
  return users.slice(0, 20);
}

// ============================================
// ONLINE STATUS
// ============================================

/**
 * Update user online status
 */
export async function updateOnlineStatus(
  userId: string,
  isOnline: boolean
): Promise<void> {
  const statusRef = ref(database, `userStatus/${userId}`);
  await set(statusRef, {
    isOnline,
    lastSeen: Date.now(),
  });
}

/**
 * Subscribe to user online status
 */
export function subscribeUserStatus(
  userId: string,
  callback: (status: { isOnline: boolean; lastSeen: number }) => void
): () => void {
  const statusRef = ref(database, `userStatus/${userId}`);
  
  const unsubscribe = onValue(statusRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback({ isOnline: false, lastSeen: 0 });
      return;
    }
    callback(snapshot.val());
  });

  return () => off(statusRef);
}
