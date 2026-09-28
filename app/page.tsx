import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/actions/auth';

export default function HomePage() {
  redirect('/dashboard');
}
