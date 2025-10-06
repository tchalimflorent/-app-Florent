import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { usePaymentLinkStore } from '@/lib/store';
import { DollarSign, FileText, Filter, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CreatePaymentLinkSheet } from './CreatePaymentLinkSheet';
import { PaymentLinkCard } from './PaymentLinkCard';
import { AnimatePresence } from 'framer-motion';
export function PaymentLinksDashboard() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const paymentLinks = usePaymentLinkStore((state) => state.paymentLinks);
  const isLoading = usePaymentLinkStore((state) => state.isLoading);
  const fetchPaymentLinks = usePaymentLinkStore((state) => state.fetchPaymentLinks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  useEffect(() => {
    fetchPaymentLinks();
  }, [fetchPaymentLinks]);
  const filteredLinks = useMemo(() => {
    return paymentLinks
      .filter((link) => {
        if (statusFilter !== 'all' && link.status !== statusFilter) {
          return false;
        }
        if (searchTerm && !link.description.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });
  }, [paymentLinks, searchTerm, statusFilter]);
  const stats = useMemo(() => {
    return paymentLinks.reduce(
      (acc, link) => {
        if (link.status === 'paid') {
          acc.totalRevenue += link.amount;
        }
        if (link.status === 'pending') {
          acc.pendingAmount += link.amount;
        }
        return acc;
      },
      { totalRevenue: 0, pendingAmount: 0 }
    );
  }, [paymentLinks]);
  const renderSkeletons = () => (
    Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg bg-white dark:bg-slate-900">
        <div className="flex justify-between items-start">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    ))
  );
  const renderEmptyState = () => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full">
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">No payment links yet</h3>
      <p className="mt-2 text-muted-foreground">Get started by creating your first payment link.</p>
      <Button className="mt-6" onClick={() => setIsSheetOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Create New Link
      </Button>
    </div>
  );
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white">
            Payment Links
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your payment links and view their status.
          </p>
        </div>
        <Button size="lg" onClick={() => setIsSheetOpen(true)} className="hidden sm:flex">
          <Plus className="mr-2 h-5 w-5" /> Create New Link
        </Button>
        <Button size="icon" onClick={() => setIsSheetOpen(true)} className="sm:hidden">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">${stats.pendingAmount.toFixed(2)}</div>}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white dark:bg-slate-900 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by description..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {isLoading
            ? renderSkeletons()
            : filteredLinks.length > 0
            ? filteredLinks.map((link) => <PaymentLinkCard key={link.id} link={link} />)
            : paymentLinks.length === 0 ? renderEmptyState() : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                <p className="text-muted-foreground">No links match your search criteria.</p>
              </div>
            )}
        </AnimatePresence>
      </div>
      <CreatePaymentLinkSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}