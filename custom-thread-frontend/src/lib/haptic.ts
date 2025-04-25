/**
 * Utility functions for haptic feedback
 */

/**
 * Trigger a vibration pattern if the device supports it
 * Falls back gracefully if vibration is not supported
 * 
 * @param pattern - Vibration pattern in milliseconds (alternating vibration and pause)
 */
export const vibrate = (pattern: number | number[]): void => {
  // Check if the browser supports vibration
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

/**
 * Predefined vibration patterns for different actions
 */
export const hapticPatterns = {
  // Light tap feedback
  light: 10,
  
  // Medium feedback for confirmations
  medium: 25,
  
  // Strong feedback for important actions
  strong: 35,
  
  // Success pattern (two short vibrations)
  success: [15, 50, 15],
  
  // Error pattern (one long vibration)
  error: 100,
  
  // Warning pattern (three short vibrations)
  warning: [10, 30, 10, 30, 10],
  
  // Add to cart pattern (short then medium)
  addToCart: [10, 20, 30],
};

/**
 * Trigger a success haptic feedback
 */
export const successHaptic = (): void => {
  vibrate(hapticPatterns.success);
};

/**
 * Trigger an error haptic feedback
 */
export const errorHaptic = (): void => {
  vibrate(hapticPatterns.error);
};

/**
 * Trigger an add to cart haptic feedback
 */
export const addToCartHaptic = (): void => {
  vibrate(hapticPatterns.addToCart);
};
