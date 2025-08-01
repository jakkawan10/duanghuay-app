export function getUserRole(user: any): 'free' | 'premium' | 'vip' {
  return user?.role || 'free';
}
