import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { PaymentLink } from '@shared/types';
import { format, formatDistanceToNow } from 'date-fns';
import { Copy, MoreVertical, Trash2, View, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePaymentLinkStore } from '@/lib/store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
type PaymentLinkCardProps = {
  link: PaymentLink;
};
const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-300/50',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-300/50',
  expired: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400 border-gray-400/50',
};
export function PaymentLinkCard({ link }: PaymentLinkCardProps) {
  const deletePaymentLink = usePaymentLinkStore((state) => state.deletePaymentLink);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const copyLink = () => {
    const url = `${window.location.origin}/pay/${link.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };
  const handleDelete = async () => {
    toast.promise(deletePaymentLink(link.id), {
      loading: 'Deleting link...',
      success: 'Payment link deleted.',
      error: 'Failed to delete link.',
    });
  };
  const isExpired = link.status === 'expired';
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="flex flex-col h-full transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-slate-900">
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle className="text-3xl font-bold font-mono text-slate-800 dark:text-slate-100">
              ${link.amount.toFixed(2)}
            </CardTitle>
            <CardDescription className="line-clamp-1">{link.description}</CardDescription>
          </div>
          <Badge className={cn('capitalize', statusStyles[link.status])}>{link.status}</Badge>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
          <p className="text-sm text-muted-foreground">
            Created on {format(new Date(link.createdAt), 'MMM d, yyyy')}
          </p>
          {link.expiresAt && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className={cn("text-sm flex items-center", isExpired ? "text-red-500" : "text-muted-foreground")}>
                    <Clock className="mr-1.5 h-4 w-4" />
                    {isExpired ? 'Expired' : 'Expires'} {formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{format(new Date(link.expiresAt), 'PPP p')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={copyLink}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          <AlertDialog>
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/pay/${link.id}`} target="_blank">
                    <View className="mr-2 h-4 w-4" />
                    View Public Page
                  </Link>
                </DropdownMenuItem>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/50"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the payment link.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}