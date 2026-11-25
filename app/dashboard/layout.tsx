import DeshboardSidebar from "@/components/dashboard/DeshboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
     <SidebarProvider>
      <DeshboardSidebar/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;