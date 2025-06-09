import React from 'react';
import { SidebarTrigger } from './sidebar';
// import { Separator } from './separator';
import { ModeToggle } from '../mode-toggle';

const header = () => {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full justify-between px-4 lg:px-6">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          {/* <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Documents</h1> */}
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default header;
