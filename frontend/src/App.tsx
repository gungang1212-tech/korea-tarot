import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ReadingNew from "@/pages/ReadingNew";
import ReadingResult from "@/pages/ReadingResult";
import Mypage from "@/pages/Mypage";
import MypageReadingDetail from "@/pages/MypageReadingDetail";
import OAuth2Callback from "@/pages/OAuth2Callback";
import { useAuthStore } from "@/stores/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/reading/new" element={<ReadingNew />} />
            <Route path="/reading/result/:id" element={<ReadingResult />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/mypage/readings/:id" element={<MypageReadingDetail />} />
          </Route>

          <Route path="/oauth2/callback" element={<OAuth2Callback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
