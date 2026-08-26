import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col font-body bg-[#F8F9FA] dark:bg-[#071225] text-gray-900 dark:text-gray-100 transition-colors">
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
