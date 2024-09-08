
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PermissionDeniedPage = () => {
  const router = useRouter();

  useEffect(() => {
    document.title = "Permission Denied - VaultChain";
  }, []);

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold">403</h1>
        <p className="mt-4 text-lg">You don't have permission to access this page.</p>
        <button
          onClick={handleRedirect}
          className="mt-6 px-6 py-3 bg-red-500 text-black font-semibold rounded hover:bg-red-600"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default PermissionDeniedPage;
