/**
 * Utility functions for DOM manipulation and element finding
 */

/**
 * Find an element in the DOM by selector with retry logic
 * Useful for finding elements that might not be immediately available
 * 
 * @param selector - CSS selector to find the element
 * @param maxAttempts - Maximum number of attempts to find the element
 * @param interval - Interval between attempts in milliseconds
 * @returns Promise that resolves to the element or null if not found
 */
export const findElementWithRetry = async (
  selector: string, 
  maxAttempts = 10, 
  interval = 100
): Promise<HTMLElement | null> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      return element;
    }
    
    // Wait for the next interval
    await new Promise(resolve => setTimeout(resolve, interval));
    attempts++;
  }
  
  console.warn(`Element with selector "${selector}" not found after ${maxAttempts} attempts`);
  return null;
};

/**
 * Get the position of an element relative to another element
 * 
 * @param sourceElement - The source element
 * @param targetElement - The target element
 * @returns Object with x and y coordinates
 */
export const getRelativePosition = (
  sourceElement: HTMLElement,
  targetElement: HTMLElement
): { x: number, y: number } => {
  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  
  return {
    x: targetRect.left - sourceRect.left + (targetRect.width / 2) - (sourceRect.width / 2),
    y: targetRect.top - sourceRect.top + (targetRect.height / 2) - (sourceRect.height / 2)
  };
};
