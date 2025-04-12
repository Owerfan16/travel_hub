"use client";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import ReactDOM from "react-dom";

export const Tooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      { name: "offset", options: { offset: [0, 10] } },
    ],
  });

  // Определяем, является ли устройство сенсорным
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && "ontouchstart" in window) {
      setIsTouch(true);
    }
  }, []);

  // Для сенсорных устройств скрывать тултип при клике вне его области
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent | TouchEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        referenceElement &&
        !referenceElement.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    if (isTouch) {
      document.addEventListener("mousedown", handleDocumentClick);
      document.addEventListener("touchstart", handleDocumentClick);
      return () => {
        document.removeEventListener("mousedown", handleDocumentClick);
        document.removeEventListener("touchstart", handleDocumentClick);
      };
    }
  }, [isTouch, referenceElement]);

  const tooltip = isVisible ? (
    <div
      ref={(node) => {
        setPopperElement(node);
        tooltipRef.current = node;
      }}
      style={styles.popper}
      {...attributes.popper}
      className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm z-[9999]"
    >
      {content}
      <div
        ref={setArrowElement}
        style={{
          ...styles.arrow,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          transform: `${
            styles.arrow.transform ? styles.arrow.transform : ""
          } rotate(180deg)`,
        }}
        className="absolute w-2 h-2 bg-black/80 left-1/2 top-full -translate-x-1/2 pointer-events-none"
      />
    </div>
  ) : null;

  // Выбираем набор обработчиков: для touch-устройств использовать onClick,
  // для остальных – onMouseEnter / onMouseLeave.
  const eventHandlers = isTouch
    ? {
        onClick: () => setIsVisible((prev) => !prev),
      }
    : {
        onMouseEnter: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false),
      };

  return (
    <>
      <div
        ref={setReferenceElement}
        {...eventHandlers}
        className="inline-block"
      >
        {children}
      </div>
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(tooltip, document.body)}
    </>
  );
};
