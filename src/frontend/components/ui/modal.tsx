"use client";

import { useEffect, useRef } from "react";
import { CloseIcon } from "./icons";

export function Modal({
  title,
  onClose,
  drawer = false,
  children,
}: {
  title: string;
  onClose: () => void;
  drawer?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (ref.current && !ref.current.open) {
      ref.current.showModal();
      if (window.matchMedia("(min-width: 768px)").matches) {
        ref.current.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      }
    }
  }, []);

  const placement = drawer
    ? "slide-in-right my-0 mr-0 ml-auto h-dvh max-h-none w-full max-w-md"
    : "sheet-up m-auto max-h-[90dvh] w-full max-w-lg rounded-xl max-md:mb-0 max-md:max-w-none max-md:rounded-b-none";

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) {
          onClose();
        }
      }}
      className={`bg-white text-ink ${placement}`}
    >
      <div className="flex flex-col gap-5 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-6">
        <div className="sticky top-0 z-10 -mx-5 flex items-start justify-between gap-3 bg-white px-5 pt-5 pb-2 md:-mx-6 md:px-6 md:pt-6">
          <h2 className="text-xl leading-snug font-semibold">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mt-2 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-ground"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
