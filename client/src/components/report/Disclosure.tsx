import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

/**
 * 折叠披露：统一「展开依据 / 听原声 / 查看来源」的交互样式。
 * 默认收起，把三级细节收进「仓库」，只在需要时点开（对应渐进披露）。
 */

export interface DisclosureProps {
  label: string;
  count?: number;
  color?: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Disclosure({
  label,
  count,
  color = '#E95B35',
  defaultOpen = false,
  icon,
  className,
  children,
}: DisclosureProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className={className}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-[12px] border border-[#E6DDD3] bg-[#FBFAF7] px-3.5 py-2.5 text-left transition hover:bg-[#FFF3EE]"
        >
          <span className="flex items-center gap-1.5 text-[13px] font-black" style={{ color }}>
            {icon}
            {open ? label.replace(/^展开/, '收起') : label}
            {typeof count === 'number' && count > 0 && (
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[10.5px] font-black" style={{ color }}>
                {count}
              </span>
            )}
          </span>
          <ChevronDown
            size={16}
            className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
            style={{ color }}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-2.5">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default Disclosure;
