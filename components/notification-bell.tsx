"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
}

interface NotificationBellProps {
    notifications: Notification[];
    unreadCount: number;
}

export function NotificationBell({ notifications, unreadCount }: NotificationBellProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative rounded-none h-8 w-8 p-0">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-none border-2 border-border shadow-brutal p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border">
                    <h4 className="text-sm font-bold">Notificações</h4>
                    {unreadCount > 0 && (
                        <span className="text-[10px] text-muted-foreground">{unreadCount} nova(s)</span>
                    )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-muted-foreground">
                            Nenhuma notificação.
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`px-4 py-3 border-b border-border last:border-0 text-sm ${!n.read ? "bg-primary/5" : ""}`}
                            >
                                <p className="font-medium text-xs">{n.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1">
                                    {new Date(n.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
