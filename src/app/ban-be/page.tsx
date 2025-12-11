import { Metadata } from 'next';
import FriendsClient from './FriendsClient';

export const metadata: Metadata = {
  title: 'Bạn bè | MovieApp',
  description: 'Quản lý danh sách bạn bè',
};

export default function FriendsPage() {
  return <FriendsClient />;
}
