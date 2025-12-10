export default function HeaderSection() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800/30 p-6 rounded-xl border border-gray-700/30 backdrop-blur-sm">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Admin Dashboard</h2>
        <p className="text-gray-400">Overview of bookstore performance and analytics</p>
      </div>
      <div className="mt-4 md:mt-0">
        <span className="text-sm text-gray-300 bg-gray-700/30 px-4 py-2 rounded-lg border border-gray-600/30 backdrop-blur-sm">
          Last updated: {new Date().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}