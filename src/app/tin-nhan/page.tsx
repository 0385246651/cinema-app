import { Metadata } from 'next';
import MessagesClient from './MessagesClient';

export const metadata: Metadata = {
  title: 'Tin nhắn | MovieApp',
  description: 'Nhắn tin với bạn bè',
};

export default function MessagesPage() {
  return <MessagesClient />;
}
