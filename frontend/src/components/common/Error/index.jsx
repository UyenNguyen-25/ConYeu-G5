import { Button } from "antd";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorBoundary() {
  const navigate = useNavigate()
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div className="w-screen h-screen flex flex-col items-center justify-center">
    <div className="text-2xl font-bold mb-6">Oops, Somethings went wrong</div>
    <Button onClick={() => navigate(".")}>Back to Previous Page</Button>
  </div>;
}
