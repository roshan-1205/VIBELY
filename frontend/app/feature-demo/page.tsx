"use client"

import React from 'react';
import { HeroSection } from '@/components/ui/feature-carousel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const FeatureDemoPage: React.FC = () => {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1504051771394-dd2e66b2e08f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fGdpcmx8ZW58MHx8MHx8fDA%3D',
      alt: 'Professional portrait of a woman',
    },
    {
      src: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fGdpcmx8ZW58MHx8MHx8fDA%3D',
      alt: 'Scenic landscape with mountains and a lake',
    },
    {
      src: 'https://plus.unsplash.com/premium_photo-1670282392820-e3590c1c5c54?w=900&auto=format&fit=crop&q=60',
      alt: 'Artistic photo of a girl with flowers',
    },
    {
      src: 'https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGdpcmx8ZW58MHx8MHx8fDA%3D',
      alt: 'A dog wearing sunglasses',
    },
    {
      src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGdpcmx8ZW58MHx8MHx8fDA%3D',
      alt: 'Creative shot of a person from behind',
    },
  ];

  const title = (
    <>
      Edit Your{' '}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        Photos{' '}
      </span>
      on the Go
    </>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/hero">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Feature Carousel Demo</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">3D carousel with perspective effects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Carousel */}
      <HeroSection
        title={title}
        subtitle="Use all our AI-powered photo editing tools on your phone, available for all iOS and Android."
        images={images}
      />
    </div>
  );
};

export default FeatureDemoPage;