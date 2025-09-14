import { getCurrentUser } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const user = await getCurrentUser();
  
  // If user is not authenticated, redirect to login page
  if (!user) {
    redirect('/');
  }
  
  const handleLogout = async () => {
    'use server';
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">FlowSync AI</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
              <p className="text-gray-600 mb-8">Welcome to FlowSync AI! You've successfully authenticated with GitHub.</p>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
                <div className="flex items-center">
                  <img 
                    className="h-16 w-16 rounded-full" 
                    src={user.avatar_url || 'https://via.placeholder.com/100'} 
                    alt="Avatar" 
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{user.name || user.username}</h3>
                    <p className="text-gray-500">@{user.username}</p>
                    {user.email && <p className="text-gray-500">{user.email}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}