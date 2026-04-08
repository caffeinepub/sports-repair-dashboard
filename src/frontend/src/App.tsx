import { Toaster } from "@/components/ui/sonner";
import {
  BarChart2,
  Building2,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Store,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CustomerJobSheet } from "./components/CustomerJobSheet";
import { DealerJobForm } from "./components/DealerJobForm";
import { DealerServiceBill } from "./components/DealerServiceBill";
import { JobDetail } from "./components/JobDetail";
import { JobForm } from "./components/JobForm";
import { ServiceBill } from "./components/ServiceBill";
import { ShopJobForm } from "./components/ShopJobForm";
import type { JobWithId } from "./hooks/useQueries";
import { seedIfNeeded } from "./lib/seed";
import { BookingsPage } from "./pages/BookingsPage";
import { Dashboard } from "./pages/Dashboard";
import { DealerJobsList } from "./pages/DealerJobsList";
import { JobsList } from "./pages/JobsList";
import { LoginPage } from "./pages/LoginPage";
import { PublicWebsite } from "./pages/PublicWebsite";
import { Reports } from "./pages/Reports";
import { ShopJobsList } from "./pages/ShopJobsList";

type Page =
  | "dashboard"
  | "jobs"
  | "reports"
  | "shopjobs"
  | "bookings"
  | "dealers";

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "jobs" as Page, label: "All Jobs", icon: ClipboardList },
  { id: "shopjobs" as Page, label: "Shop Jobs", icon: Store },
  { id: "dealers" as Page, label: "Dealers", icon: Building2 },
  { id: "bookings" as Page, label: "Bookings", icon: CalendarCheck },
  { id: "reports" as Page, label: "Reports", icon: BarChart2 },
];

function pageTitle(page: Page): string {
  if (page === "dashboard") return "Dashboard Overview";
  if (page === "reports") return "Reports & Analytics";
  if (page === "shopjobs") return "Sports Shop Jobs";
  if (page === "bookings") return "Customer Bookings";
  if (page === "dealers") return "Dealer Jobs";
  return "Job Sheet Management";
}

export default function App() {
  // ─── Public / Admin routing via URL hash ───────────────────────────────────
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const handler = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // Show public website for everyone except when hash is exactly #admin
  if (route !== "#admin") {
    return <PublicWebsite />;
  }

  // ─── Admin dashboard (below this point) ───────────────────────────────────
  return <AdminApp />;
}

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("srd_auth") === "true",
  );
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editJob, setEditJob] = useState<JobWithId | null>(null);
  const [detailJob, setDetailJob] = useState<JobWithId | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [billJob, setBillJob] = useState<JobWithId | null>(null);
  const [billOpen, setBillOpen] = useState(false);
  const [shopFormOpen, setShopFormOpen] = useState(false);
  const [editShopJob, setEditShopJob] = useState<JobWithId | null>(null);
  const [dealerFormOpen, setDealerFormOpen] = useState(false);
  const [editDealerJob, setEditDealerJob] = useState<JobWithId | null>(null);
  const [dealerBillJob, setDealerBillJob] = useState<JobWithId | null>(null);
  const [dealerBillOpen, setDealerBillOpen] = useState(false);
  const [customerSheetJob, setCustomerSheetJob] = useState<JobWithId | null>(
    null,
  );
  const [customerSheetSerialNo, setCustomerSheetSerialNo] = useState<
    number | undefined
  >(undefined);
  const [customerSheetOpen, setCustomerSheetOpen] = useState(false);

  useEffect(() => {
    seedIfNeeded();
  }, []);

  function handleLogin() {
    localStorage.setItem("srd_auth", "true");
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem("srd_auth");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  function openNewJob() {
    setEditJob(null);
    setFormOpen(true);
  }

  function openEditJob(job: JobWithId) {
    setEditJob(job);
    setFormOpen(true);
  }

  function openViewJob(job: JobWithId) {
    setDetailJob(job);
    setDetailOpen(true);
  }

  function openBill(job: JobWithId) {
    setBillJob(job);
    setBillOpen(true);
  }

  function openCustomerSheet(job: JobWithId, serialNo?: number) {
    setCustomerSheetJob(job);
    setCustomerSheetSerialNo(serialNo);
    setCustomerSheetOpen(true);
  }

  function openNewShopJob() {
    setEditShopJob(null);
    setShopFormOpen(true);
  }

  function openEditShopJob(job: JobWithId) {
    setEditShopJob(job);
    setShopFormOpen(true);
  }

  function openNewDealerJob() {
    setEditDealerJob(null);
    setDealerFormOpen(true);
  }

  function openEditDealerJob(job: JobWithId) {
    setEditDealerJob(job);
    setDealerFormOpen(true);
  }

  function openDealerBill(job: JobWithId) {
    setDealerBillJob(job);
    setDealerBillOpen(true);
  }

  function navigate(p: Page) {
    setPage(p);
    setSidebarOpen(false);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
          onKeyDown={(e) => e.key === "Escape" && closeSidebar()}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 sidebar-gradient flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              CF Sports Repair
            </p>
            <p className="text-white/60 text-xs">Admin Dashboard</p>
          </div>
          <button
            type="button"
            className="ml-auto lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => navigate(id)}
              data-ocid={`nav.${id}.link`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                page === id
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}

          {/* Separator */}
          <div className="my-2 border-t border-white/10" />

          <button
            type="button"
            onClick={() => {
              openNewJob();
              setSidebarOpen(false);
            }}
            data-ocid="nav.new_job.button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            New Job
          </button>
          <button
            type="button"
            onClick={() => {
              openNewShopJob();
              setSidebarOpen(false);
            }}
            data-ocid="nav.new_shop_job.button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <Store className="h-4 w-4 shrink-0" />
            New Shop Job
          </button>
          <button
            type="button"
            onClick={() => {
              openNewDealerJob();
              setSidebarOpen(false);
            }}
            data-ocid="nav.new_dealer_job.button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <Building2 className="h-4 w-4 shrink-0" />
            New Dealer Job
          </button>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/40 text-xs">CF Sports Repair</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b shadow-xs px-4 sm:px-6 py-3.5 flex items-center gap-4 shrink-0 no-print">
          <button
            type="button"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
            data-ocid="nav.menu.button"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:block">
            <h2 className="font-semibold text-sm capitalize">
              {pageTitle(page)}
            </h2>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              AD
            </div>
            <button
              type="button"
              onClick={handleLogout}
              data-ocid="auth.logout.button"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-md hover:bg-destructive/10"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {page === "dashboard" && (
            <Dashboard
              onNavigateJobs={() => navigate("jobs")}
              onViewJob={openViewJob}
            />
          )}
          {page === "jobs" && (
            <JobsList
              onNewJob={openNewJob}
              onViewJob={openViewJob}
              onEditJob={openEditJob}
              onPrintSheet={(job, srNo) => openCustomerSheet(job, srNo)}
            />
          )}
          {page === "shopjobs" && (
            <ShopJobsList
              onNewShopJob={openNewShopJob}
              onViewJob={openViewJob}
              onEditJob={openEditShopJob}
              onPrintSheet={openBill}
            />
          )}
          {page === "dealers" && (
            <DealerJobsList
              onNewDealerJob={openNewDealerJob}
              onViewJob={openViewJob}
              onEditJob={openEditDealerJob}
              onPrintSheet={openDealerBill}
            />
          )}
          {page === "bookings" && <BookingsPage />}
          {page === "reports" && <Reports />}
        </main>

        {/* Footer */}
        <footer className="border-t bg-card px-6 py-3 text-xs text-muted-foreground flex justify-center shrink-0 no-print">
          © {new Date().getFullYear()} CF Sports Repair. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="text-primary ml-1 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </footer>
      </div>

      <JobForm open={formOpen} onOpenChange={setFormOpen} editJob={editJob} />
      <ShopJobForm
        open={shopFormOpen}
        onOpenChange={setShopFormOpen}
        editJob={editShopJob}
      />
      <DealerJobForm
        open={dealerFormOpen}
        onOpenChange={setDealerFormOpen}
        editJob={editDealerJob}
      />
      <JobDetail
        job={detailJob}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={(job) => {
          setDetailOpen(false);
          openEditJob(job);
        }}
        onGenerateBill={(job) => {
          setDetailOpen(false);
          openBill(job);
        }}
        onCustomerSheet={(job) => {
          setDetailOpen(false);
          openCustomerSheet(job);
        }}
      />
      <ServiceBill job={billJob} open={billOpen} onOpenChange={setBillOpen} />
      <DealerServiceBill
        job={dealerBillJob}
        open={dealerBillOpen}
        onOpenChange={setDealerBillOpen}
      />
      <CustomerJobSheet
        job={customerSheetJob}
        open={customerSheetOpen}
        onOpenChange={setCustomerSheetOpen}
        serialNo={customerSheetSerialNo}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
}
