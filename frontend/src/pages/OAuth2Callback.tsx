import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setToken(token);
      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, setToken]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <p className="text-purple-300 text-lg animate-pulse">로그인 처리 중...</p>
    </div>
  );
}
