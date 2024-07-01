function ErrorBoundary() {
  return (
    <div className="flex flex-col items-center h-full text-2xl font-semibold my-8">
      <p>Oops!</p>
      <p>Page Not Found</p>
    </div>
  );
}

export default ErrorBoundary;
