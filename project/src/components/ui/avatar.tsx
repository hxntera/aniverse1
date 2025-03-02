import { User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProfile } from '../../hooks/useProfile';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: React.ReactNode;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-40 h-40'
};

export function Avatar({ src: propSrc, alt = 'Avatar', size = 'md', className, fallback }: AvatarProps) {
  const { profile } = useProfile();
  const src = propSrc ?? profile?.avatar_url;

  return (
    <div className={cn(
      'relative rounded-full overflow-hidden bg-secondary',
      sizeClasses[size],
      className
    )}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400';
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
          {fallback || <User className="w-1/2 h-1/2" />}
        </div>
      )}
    </div>
  );
}