import { Metadata } from 'next';
import AccountClient from './AccountClient';

export const metadata: Metadata = {
  title: 'Cài đặt tài khoản | MovieApp',
  description: 'Quản lý thông tin tài khoản của bạn',
};

export default function AccountPage() {
  return <AccountClient />;
}
