import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const Sidebar= () => { 
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 flex flex-col space-y-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
                <span className="sr-only">Add to cart</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add to cart</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="sr-only">Add to favorites</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Add to favorites</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
export default Sidebar