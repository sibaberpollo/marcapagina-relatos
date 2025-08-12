"use client"

import * as React from "react"
import {
  Home,
  Users,
  BookOpen,
  Heart,
  Settings,
  LifeBuoy,
  Send,
  User,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Avatar from 'react-avatar'

// Menu items.
const data = {
  navMain: [
    {
      title: "Dashboard",
    url: "/biblioteca-personal",
      icon: Home,
    },
    {
      title: "Autores",
      url: "/dashboard/autores",
      icon: Users,
      items: [
        {
          title: "Seguidos",
          url: "/dashboard/autores/seguidos",
        },
        {
          title: "Explorar",
          url: "/dashboard/autores/explorar",
        },
      ],
    },
    {
      title: "Lectura",
      url: "/dashboard/lectura",
      icon: BookOpen,
      items: [
        {
          title: "Leídos",
          url: "/dashboard/lectura/leidos",
        },
        {
          title: "Pendientes",
          url: "/dashboard/lectura/pendientes",
        },
        {
          title: "Favoritos",
          url: "/dashboard/lectura/favoritos",
        },
      ],
    },
    {
      title: "Mis Favoritos",
      url: "/dashboard/favoritos",
      icon: Heart,
    },
  ],
  navSecondary: [
    {
      title: "Soporte",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
            <Link href="/biblioteca-personal">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-sidebar-primary-foreground">
                  <span className="text-black font-bold">://</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Marca Página
                  </span>
                  <span className="truncate text-xs">Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Soporte</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2 p-2">
                {session?.user ? (
                  <>
                    <Avatar 
                      name={session.user.name || session.user.email || 'Usuario'} 
                      src={session.user.image || undefined} 
                      size="32" 
                      round 
                      textSizeRatio={2}
                      color="#FAFF00"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session.user.name || 'Usuario'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="ml-auto p-1 rounded hover:bg-accent"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <User className="h-6 w-6" />
                    <span>No autenticado</span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}