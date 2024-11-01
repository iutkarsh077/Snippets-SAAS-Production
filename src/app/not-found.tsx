import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex pt-28 justify-center min-h-screen bg-white dark:bg-black">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-black dark:text-white">404</h1>
        <h2 className="text-4xl font-semibold mt-4 mb-6 text-black dark:text-white">Page Not Found</h2>
        <p className="text-lg mb-8 text-black dark:text-white">The page you're looking for doesn't exist or has been moved.</p>
        <Link 
          href="/" 
          className="px-6 py-3 text-white dark:text-black bg-black dark:bg-white rounded-md hover:bg-gray-800 transition-colors duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}