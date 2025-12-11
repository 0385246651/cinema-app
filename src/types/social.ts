// Friend and messaging Firebase types

export interface FriendRequest {
  id?: string;
  fromUserId: string;
  fromUserName: string;
  fromUserPhoto?: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

export interface Friend {
  odUserId: string;
  userName: string;
  userPhoto?: string;
  addedAt: number;
  lastMessage?: string;
  lastMessageAt?: number;
  unreadCount?: number;
}

export interface PrivateMessage {
  id?: string;
  chatId: string; // sorted combination of two userIds
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  receiverId: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export interface UserOnlineStatus {
visibleuserId: string;
  isOnline: boolean;
  lastSeen: number;
}
