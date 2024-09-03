import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#a9dff0] bg-[url('/logo.png')] bg-no-repeat bg-center bg-[length:250px]">
      <Outlet />
    </div>
  );
}
