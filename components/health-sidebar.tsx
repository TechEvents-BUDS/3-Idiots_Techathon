"use client"

import { useState } from "react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Activity, FileText, MessageSquare } from "lucide-react";
import { PDFReport } from "./pdf-report";
import { AIChat } from "./ai-chat";
import { YoutubeVideos } from "./youtube-videos";

export const HealthSidebar = () => {
   const [activeSection, setActiveSection] = useState("pdf-report");

   return (
      <SidebarProvider>
         <Sidebar>
            <SidebarHeader>
               <h2 className="px-4 text-lg font-semibold">Health App Dashboard</h2>
            </SidebarHeader>
            <SidebarContent>
               <SidebarGroup>
                  <SidebarGroupLabel className="sr-only">Sections</SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu>
                        <SidebarMenuItem>
                           <SidebarMenuButton onClick={() => setActiveSection("pdf-report")} isActive={activeSection === 'pdf-report'}>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>PDF Report</span>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                           <SidebarMenuButton onClick={() => setActiveSection("youtube-videos")} isActive={activeSection === 'youtube-videos'}>
                              <Activity className="mr-2 h-4 w-4" />
                              <span>Youtube Videos</span>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                           <SidebarMenuButton onClick={() => setActiveSection("ai-chat")} isActive={activeSection === 'ai-chat'}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              <span>AI Chat</span>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            </SidebarContent>
         </Sidebar>
         <div className="p-4 w-full">
            {activeSection === 'pdf-report' && <PDFReport />}
            {activeSection === 'ai-chat' && <AIChat />}
            {activeSection === 'youtube-videos' && <YoutubeVideos />}
         </div>
      </SidebarProvider>
   )
};