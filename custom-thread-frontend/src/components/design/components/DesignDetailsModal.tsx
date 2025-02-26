import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDesignDetails } from "@/store";
import { ZodIssue } from "zod";
import { useToast } from "@/hooks/use-toast";

interface DesignDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
}

const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export function DesignDetailsModal({
    open,
    onOpenChange,
    onSave,
}: DesignDetailsModalProps) {
    const {
        details,
        setDetails,
        validateDetails,
        validationErrors,
        resetDetails,
    } = useDesignDetails();
    const { toast } = useToast();
    const [newTag, setNewTag] = useState("");

    const handleAddTag = () => {
        if (newTag.trim() && !details.tags.includes(newTag.trim())) {
            setDetails({ tags: [...details.tags, newTag.trim()] });
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setDetails({
            tags: details.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    const handleSave = () => {
        if (validateDetails()) {
            try {
                onSave();
                onOpenChange(false);
            } catch (error) {
                toast({
                    title: "Error",
                    description:
                        error instanceof Error
                            ? error.message
                            : "Failed to save design details",
                    variant: "destructive",
                });
            }
        } else {
            toast({
                title: "Validation Error",
                description: "Please check the form for errors",
                variant: "destructive",
            });
        }
    };

    const handleReset = () => {
        resetDetails();
        setNewTag("");
    };

    // Helper function to get field error message
    const getFieldError = (fieldName: string) => {
        if (!validationErrors) return null;
        return validationErrors.errors.find(
            (error: ZodIssue) => error.path[0] === fieldName
        )?.message;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[calc(100dvh-1.5rem)] w-[calc(100dvw-1.5rem)] sm:max-w-[600px] overflow-hidden">
                <ScrollArea className="max-h-[calc(100dvh-3rem)]">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={staggerContainer}
                    >
                        <DialogHeader className="flex flex-row items-center justify-between">
                            <motion.div
                                variants={fadeIn}
                                className="flex items-center gap-2"
                            >
                                <DialogTitle className="text-xl font-semibold">
                                    Design Details
                                </DialogTitle>
                                <Sparkles className="w-5 h-5 text-primary" />
                            </motion.div>
                            {(details.title ||
                                details.description ||
                                details.tags.length > 0) && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleReset}
                                    className="h-8 w-8"
                                    title="Reset Form"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            )}
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <motion.div variants={fadeIn} className="space-y-2">
                                <Label htmlFor="title" className="text-base">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Enter design title"
                                    value={details.title}
                                    onChange={(e) =>
                                        setDetails({ title: e.target.value })
                                    }
                                    className={cn(
                                        "transition-all duration-200 focus:ring-2 focus:ring-primary/20",
                                        getFieldError("title") &&
                                            "border-destructive"
                                    )}
                                />
                                {getFieldError("title") && (
                                    <p className="text-sm text-destructive">
                                        {getFieldError("title")}
                                    </p>
                                )}
                            </motion.div>
                            <motion.div variants={fadeIn} className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="text-base"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your design..."
                                    className={cn(
                                        "min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20",
                                        getFieldError("description") &&
                                            "border-destructive"
                                    )}
                                    value={details.description}
                                    onChange={(e) =>
                                        setDetails({
                                            description: e.target.value,
                                        })
                                    }
                                />
                                {getFieldError("description") && (
                                    <p className="text-sm text-destructive">
                                        {getFieldError("description")}
                                    </p>
                                )}
                            </motion.div>
                            <motion.div variants={fadeIn} className="space-y-2">
                                <Label className="text-base">
                                    Tags (Optional)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add tags..."
                                        value={newTag}
                                        onChange={(e) =>
                                            setNewTag(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        className={cn(
                                            "transition-all duration-200 focus:ring-2 focus:ring-primary/20",
                                            getFieldError("tags") &&
                                                "border-destructive"
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={handleAddTag}
                                        className="shrink-0 hover:scale-105 active:scale-95 transition-transform"
                                        disabled={details.tags.length >= 10}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {getFieldError("tags") && (
                                    <p className="text-sm text-destructive">
                                        {getFieldError("tags")}
                                    </p>
                                )}
                                <motion.div
                                    className="flex flex-wrap gap-2 mt-2"
                                    layout
                                >
                                    <AnimatePresence mode="popLayout">
                                        {details.tags.map((tag, index) => (
                                            <motion.div
                                                key={`${tag}-${index}`}
                                                initial={{
                                                    scale: 0.8,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    scale: 0.8,
                                                    opacity: 0,
                                                }}
                                                layout
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "px-2 py-1 text-sm flex items-center gap-1",
                                                        "hover:bg-secondary/80 transition-colors"
                                                    )}
                                                >
                                                    {tag}
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveTag(tag)
                                                        }
                                                        className="ml-1 hover:text-destructive focus:outline-none transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        </div>
                        <DialogFooter className="sm:justify-end gap-2 mt-6">
                            <motion.div
                                variants={fadeIn}
                                className="flex gap-2 w-full sm:w-auto"
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="hover:scale-105 active:scale-95 transition-transform"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    className={cn(
                                        "hover:scale-105 active:scale-95 transition-transform",
                                        "bg-gradient-to-r from-primary to-primary/80",
                                        "disabled:from-muted disabled:to-muted"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        Save Details
                                        <Sparkles className="w-4 h-4" />
                                    </span>
                                </Button>
                            </motion.div>
                        </DialogFooter>
                    </motion.div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
