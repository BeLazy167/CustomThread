import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartAnimationProps {
  isAnimating: boolean;
  onAnimationComplete: () => void;
  productImage?: string;
  targetRef: React.RefObject<HTMLElement>;
  quantity?: number;
}

/**
 * A component that provides a polished animation when adding items to cart
 * 
 * @param isAnimating - Whether the animation should be playing
 * @param onAnimationComplete - Callback function when animation completes
 * @param productImage - URL of the product image to animate
 * @param targetRef - Reference to the cart button element to animate towards
 * @param quantity - Number of items being added to cart
 */
export function AddToCartAnimation({
  isAnimating,
  onAnimationComplete,
  productImage,
  targetRef,
  quantity = 1
}: AddToCartAnimationProps) {
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<HTMLDivElement>(null);
  const [showSuccessIndicator, setShowSuccessIndicator] = useState(false);

  // Calculate the target position when the animation starts
  useEffect(() => {
    if (isAnimating && targetRef.current && animationRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const sourceRect = animationRef.current.getBoundingClientRect();
      
      setTargetPosition({
        x: targetRect.left - sourceRect.left + (targetRect.width / 2) - (sourceRect.width / 2),
        y: targetRect.top - sourceRect.top + (targetRect.height / 2) - (sourceRect.height / 2)
      });
    }
  }, [isAnimating, targetRef]);

  // Handle animation completion
  const handleAnimationComplete = () => {
    setShowSuccessIndicator(true);
    
    // Hide success indicator after 1.5 seconds
    setTimeout(() => {
      setShowSuccessIndicator(false);
      onAnimationComplete();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      <AnimatePresence>
        {isAnimating && (
          <motion.div 
            ref={animationRef}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              x: targetPosition.x,
              y: targetPosition.y,
              scale: 0.5,
              opacity: 0.8,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              type: 'spring',
              duration: 0.7,
              bounce: 0.3
            }}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className="relative">
              <motion.div
                className="h-16 w-16 rounded-full bg-background border-2 border-primary shadow-lg flex items-center justify-center overflow-hidden"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
              >
                {productImage ? (
                  <img 
                    src={productImage} 
                    alt="Product" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="h-8 w-8 text-primary" />
                )}
              </motion.div>
              
              {quantity > 1 && (
                <motion.div 
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {quantity}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessIndicator && (
          <motion.div
            className={cn(
              "absolute rounded-full bg-green-500 text-white shadow-lg",
              "flex items-center justify-center"
            )}
            style={{
              top: targetRef.current?.getBoundingClientRect().top,
              left: targetRef.current?.getBoundingClientRect().left,
              width: targetRef.current?.offsetWidth,
              height: targetRef.current?.offsetHeight,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <Check className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
