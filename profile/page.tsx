'use client';

import AgentMemory from '@/components/AgentMemory';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id || 'demo-user';

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">👤 User Profile</h1>

      {/* Other profile details here */}

      <div className="mt-8">
        <AgentMemory userId={userId} />
      </div>
    </main>
  );
}
