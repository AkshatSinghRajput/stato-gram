export default function Loading() {
  // Create a loading component that will be displayed when the data is being fetched
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-white"></div>
      <p className="text-white text-lg font-bold ml-4">Loading...</p>
    </div>
  );
}
