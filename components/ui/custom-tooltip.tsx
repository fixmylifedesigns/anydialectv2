'use client';

import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CustomTooltipProps {
  content: string;
  children?: React.ReactNode;
}

export function CustomTooltip({ content, children }: CustomTooltipProps) {
  const [showModal, setShowModal] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="inline-flex items-center gap-2">
        {children}
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Help</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">{content}</p>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-2">
            {children}
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}