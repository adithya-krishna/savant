import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { DeleteItemButton } from "@/components/delete-item-button";
import { Ellipsis } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { SectionTypes } from "@/app/global-types";

interface TableDropdownMenuProps {
  id: string;
  type: SectionTypes;
}

const TableDropdownMenu = ({ id, type }: TableDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/${type}/profile/${id}`}>View</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${type}/${id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteItemButton type={type} id={id} variant="menu-item" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableDropdownMenu;
