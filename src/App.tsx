import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AccessGate from "@/components/AccessGate";
import Index from "./pages/Index";
import PredictionForm from "./pages/PredictionForm";
import Dashboard from "./pages/Dashboard";
import CollectiveForm from "./pages/CollectiveForm";
import CollectiveDashboard from "./pages/CollectiveDashboard";
import TechnicalReport from "./pages/TechnicalReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <AccessGate onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/prediction" element={<PredictionForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/collective" element={<CollectiveForm />} />
            <Route path="/collective-dashboard" element={<CollectiveDashboard />} />
            <Route path="/technical-report" element={<TechnicalReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
