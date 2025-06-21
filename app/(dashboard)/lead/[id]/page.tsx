import { UserProfileData } from '@/app/types/user';
import { UserProfileCard } from '@/components/profile/user-profile-card';

const user: UserProfileData = {
  name: 'John Doe',
  avatarUrl: '/avatars/john.png',
  info: [
    { label: 'Community/Area', value: 'Item 1' },
    { label: 'Age', value: 'Item 2' },
    { label: 'Source', value: 'Item 3' },
  ],
  phone: '+91-XXXXXXXXXX',
  whatsapp: '+91-XXXXXXXXXX',
  email: 'john@email.com',
  tags: ['Lead', 'High Value'],
  alerts: [
    {
      id: 1,
      type: 'info',
      title: 'Item moved to "General" folder',
    },
    {
      id: 2,
      type: 'success',
      title: 'Action completed successfully',
    },
    {
      id: 3,
      type: 'error',
      title: 'An error has occurred',
    },
  ],
};

export default function Page() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* dynamic notes/status column here */}
      <div />
      <UserProfileCard data={user} />
    </div>
  );
}
