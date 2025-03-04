"use client";
import React, { createContext, ReactNode, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Role from "@/enums/role";
import { useLocale, useTranslations } from "next-intl";

const baseTPath = 'contexts.SideBar';

interface SideBarContextType {
  sidebarLinks: { title: string; path: string }[];
  showOffcanvas: boolean;
  handleClose: () => void;
  handleShow: () => void;
}

export const SideBarContext = createContext<SideBarContextType | undefined>(undefined);

interface SideBarProviderProps {
  children: ReactNode;
}

export const SideBarProvider: React.FC<SideBarProviderProps> = ({children}) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { user } = useUser();
  const memberRoles = user?.publicMetadata?.roles as Role[];
  const t = useTranslations(baseTPath);
  const locale = useLocale();

  const baseLinks = [
    { title: t('dashboard'), path: `/${locale}/dashboard`},
  ];

  const sidebarLinks = [...baseLinks];

  const adminLinks = [
    { title: t('blog'), path: `/${locale}/dashboard/blog` },
  ];

  const studentLinks = [
    { title: t('courses'), path: `/${locale}/dashboard/courses` },
  ];

  if (memberRoles?.includes(Role.ADMIN)) {
    adminLinks.forEach(newLink => {
      const isLinkExists = sidebarLinks.find(link => link.path === newLink.path);
      if (!isLinkExists) {
        sidebarLinks.push(newLink);
      }
    });
  }

  if (memberRoles?.includes(Role.STUDENT)) {
    studentLinks.forEach(newLink => {
      const isLinkExists = sidebarLinks.find(link => link.path === newLink.path);
      if (!isLinkExists) {
        sidebarLinks.push(newLink);
      }
    });
  }

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  return (
    <SideBarContext.Provider value={ {sidebarLinks, showOffcanvas, handleClose, handleShow} }>
      {children}
    </SideBarContext.Provider>
  );
}
