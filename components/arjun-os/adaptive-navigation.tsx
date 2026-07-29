"use client";

import { useEffect, useState } from "react";
import { useOSActions, useOSState } from "@/lib/arjun-os/os-context";
import { PHOTO_VIEWER_EVENT } from "@/lib/arjun-os/constants";
import { APP_META, type AppId } from "@/lib/arjun-os/types";
import { DockTile, type DockIconName } from "./icons";
import { cn } from "@/utils/cn";

const items: Array<{ id: AppId; icon: DockIconName }> = [
  { id: "profile", icon: "home" },
  { id: "work", icon: "work" },
  { id: "experience", icon: "experience" },
  { id: "research", icon: "research" },
  { id: "life", icon: "life" },
];

export function PhoneTabBar() {
  const { activeAppId, island } = useOSState();
  const { selectTab } = useOSActions();
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    const onPhoto = (event: Event) => {
      setPhotoOpen(Boolean((event as CustomEvent<boolean>).detail));
    };
    window.addEventListener(PHOTO_VIEWER_EVENT, onPhoto);
    return () => window.removeEventListener(PHOTO_VIEWER_EVENT, onPhoto);
  }, []);

  if (photoOpen || (island.expanded && island.mode !== "compose")) return null;

  return (
    <nav className="os-phone-tabs" aria-label="Portfolio sections">
      {items.map(({ id, icon }) => {
        const active = (activeAppId ?? "profile") === id;
        return (
          <button
            key={id}
            type="button"
            className={cn("os-phone-tab", active && "os-phone-tab-active")}
            aria-label={APP_META[id].dockLabel}
            aria-current={active ? "page" : undefined}
            onClick={() => selectTab(id, active)}
          >
            <DockTile name={icon} active={active} />
            <span>{APP_META[id].dockLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function TabletSidebar() {
  const { activeAppId } = useOSState();
  const { selectTab, openResume } = useOSActions();
  return (
    <aside className="os-tablet-sidebar" aria-label="Portfolio sections">
      <p className="px-3 pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-os-muted">Arjun OS</p>
      <nav className="space-y-1">
        {items.map(({ id, icon }) => {
          const active = (activeAppId ?? "profile") === id;
          return (
            <button key={id} type="button" onClick={() => selectTab(id, active)} className={cn("os-tablet-sidebar-item", active && "os-tablet-sidebar-item-active")} aria-current={active ? "page" : undefined}>
              <DockTile name={icon} active={active} />
              <span>{APP_META[id].dockLabel}</span>
            </button>
          );
        })}
      </nav>
      <button type="button" onClick={openResume} className="os-tablet-sidebar-item mt-auto">
        <DockTile name="resume" />
        <span>Resume</span>
      </button>
    </aside>
  );
}
