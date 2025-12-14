import { Building2, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Organization } from '@/types';

interface HeaderProps {
  organizations: Organization[];
  selectedOrg: Organization | null;
  onSelectOrg: (org: Organization) => void;
  onCreateOrg: () => void;
}

export function Header({ organizations, selectedOrg, onSelectOrg, onCreateOrg }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">ProjectHub</span>
          </div>

          <div className="h-6 w-px bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                {selectedOrg ? (
                  <>
                    <span className="font-medium">{selectedOrg.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </>
                ) : (
                  <>
                    <span className="text-muted-foreground">Select organization</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {organizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => onSelectOrg(org)}
                  className="cursor-pointer"
                >
                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  {org.name}
                </DropdownMenuItem>
              ))}
              {organizations.length > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem onClick={onCreateOrg} className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                New organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
