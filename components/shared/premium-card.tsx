"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PremiumCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ReactNode;
    className?: string;
    iconClassName?: string;
}

export function PremiumCard({
    title,
    value,
    description,
    icon,
    className,
    iconClassName
}: PremiumCardProps) {
    return (
        <Card className={cn("rounded-none border-2 border-border bg-card shadow-brutal-white", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {title}
                </CardTitle>
                <div className={cn("text-muted-foreground", iconClassName)}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{value}</div>
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
