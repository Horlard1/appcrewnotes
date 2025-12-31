import { View } from 'react-native';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Auth from '../pages/Auth';
import Home from '../pages/Home';
import { ToastProvider } from '@/hooks/useToast';

function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return <View style={{ flex: 1 }}>{user ? <Home /> : <Auth />}</View>;
}

export default function Index() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </ToastProvider>
  );
}
