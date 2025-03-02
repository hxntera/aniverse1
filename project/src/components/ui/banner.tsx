import { Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProfile } from '../../hooks/useProfile';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

interface BannerProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=2000';
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=20&blur=10';

export function Banner({ src: propSrc, alt = 'Banner', className, fallback }: BannerProps) {
  const { profile } = useProfile();
  const src = propSrc ?? profile?.banner_url;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState(PLACEHOLDER_IMAGE);

  useEffect(() => {
    if (!src) return;

    const img = new window.Image();
    img.src = src;

    const loadHighRes = () => {
      setImageUrl(src);
      setLoading(false);
      setError(false);
    };

    const handleError = () => {
      setImageUrl(FALLBACK_IMAGE);
      setLoading(false);
      setError(true);
    };

    img.onload = loadHighRes;
    img.onerror = handleError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const handleDownload = async () => {
    if (!src) return;

    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `banner-${Date.now()}.${blob.type.split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Banner downloaded successfully');
    } catch (error) {
      toast.error('Failed to download banner');
      console.error('Download error:', error);
    }
  };

  return (
    <div 
      className={cn(
        'group relative w-full overflow-hidden bg-secondary',
        'h-40 sm:h-48 md:h-56 lg:h-64', // Responsive heights
        className
      )}
    >
      <picture>
        {/* WebP format for modern browsers */}
        <source
          type="image/webp"
          srcSet={`
            ${imageUrl}?format=webp&w=640 640w,
            ${imageUrl}?format=webp&w=1200 1200w,
            ${imageUrl}?format=webp&w=1920 1920w
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
        {/* Fallback for browsers that don't support WebP */}
        <img
          src={imageUrl}
          srcSet={`
            ${imageUrl}?w=640 640w,
            ${imageUrl}?w=1200 1200w,
            ${imageUrl}?w=1920 1920w
          `}
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 100vw"
          alt={alt}
          loading="lazy"
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            loading ? 'opacity-50' : 'opacity-100'
          )}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
            setError(true);
            setLoading(false);
          }}
        />
      </picture>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute top-2 left-2 bg-destructive/90 text-white px-3 py-1 rounded-full text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
}