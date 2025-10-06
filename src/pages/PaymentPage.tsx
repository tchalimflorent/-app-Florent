import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import type { PaymentLink } from '@shared/types';
import { ArrowLeft, CreditCard, Loader2, Lock, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from '@/components/ui/sonner';
export function PaymentPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  useEffect(() => {
    if (!linkId) {
      setError('No payment link ID provided.');
      setIsLoading(false);
      return;
    }
    const fetchLink = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api<PaymentLink>(`/api/public/links/${linkId}`);
        setLink(data);
      } catch (err) {
        setError('This payment link is invalid or has been deleted.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLink();
  }, [linkId]);
  const handlePay = async () => {
    if (!linkId) return;
    setIsPaying(true);
    try {
      const updatedLink = await api<PaymentLink>(`/api/public/links/${linkId}/pay`, {
        method: 'POST',
      });
      setLink(updatedLink);
      toast.success('Payment Successful!', {
        description: 'Thank you for your payment.',
      });
    } catch (err) {
      toast.error('Payment Failed', {
        description: 'This link may have expired or already been paid. Please refresh.',
      });
      // Optionally re-fetch to get latest status
      const latestLink = await api<PaymentLink>(`/api/public/links/${linkId}`);
      setLink(latestLink);
    } finally {
      setIsPaying(false);
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#0F172A] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <div className="bg-slate-50 dark:bg-slate-900 p-6 text-center">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-12 w-48 mx-auto mt-2" />
            <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
          </div>
          <CardContent className="p-6">
            <Skeleton className="h-12 w-full" />
          </CardContent>
          <CardFooter className="bg-slate-50 dark:bg-slate-900 p-4">
            <Skeleton className="h-4 w-40 mx-auto" />
          </CardFooter>
        </Card>
      </div>
    );
  }
  if (error || !link) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] flex items-center justify-center text-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-display">Link Not Found</CardTitle>
            <CardDescription>{error || 'An unknown error occurred.'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go to Homepage
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0F172A] flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-900 p-6 text-center">
              <p className="text-sm text-muted-foreground">You are paying</p>
              <p className="text-5xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-2">
                ${link.amount.toFixed(2)}
              </p>
              <p className="text-muted-foreground mt-2">{link.description}</p>
            </div>
            <CardContent className="p-6">
              <Button onClick={handlePay} className="w-full h-12 text-lg" disabled={isPaying || link.status !== 'pending'}>
                {isPaying ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : link.status === 'paid' ? (
                  <CheckCircle className="mr-2 h-5 w-5" />
                ) : (
                  <CreditCard className="mr-2 h-5 w-5" />
                )}
                {link.status === 'paid' ? 'Paid Successfully' : link.status === 'expired' ? 'Link Expired' : 'Pay Now'}
              </Button>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900 p-4 flex items-center justify-center text-xs text-muted-foreground">
              <Lock className="mr-2 h-3 w-3" />
              <span>Secure payment powered by EdgePay</span>
            </CardFooter>
          </Card>
          <div className="text-center mt-4 text-sm text-slate-500">
            Built with ❤️ at Cloudflare
          </div>
        </motion.div>
      </AnimatePresence>
      <Toaster richColors position="top-center" />
    </div>
  );
}