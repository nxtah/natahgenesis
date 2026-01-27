import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../css/components/chatbot.css';

const BOT_IFRAME_SRC = 'https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2025/12/21/06/20251221062928-5WI0TC67.json';

export default function BotpressChat() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef(null);
  const originalOverflowRef = useRef(null);
  const EXIT_ANIM_MS = 520; // ms, should match CSS exit timing for desktop close animations

  // Request close: start closing animation then unmount after timeout
  function handleRequestClose() {
    if (isClosing) return; // already closing
    setIsClosing(true);

    // Immediately restore body scroll to avoid blocking while animating
    if (originalOverflowRef.current !== null) {
      document.body.style.overflow = originalOverflowRef.current || '';
      originalOverflowRef.current = null;
    } else {
      document.body.style.overflow = '';
    }

    closeTimeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      setOpen(false);
      closeTimeoutRef.current = null;
    }, EXIT_ANIM_MS);
  }

  // `handleRequestClose` is stable for this component and intentionally omitted from deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onOpen = () => {
      // If there was a pending close, cancel it and open again
      if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
      setIsClosing(false);
      setOpen(true);
    };
    const onClose = () => handleRequestClose();
    const onKey = (e) => { if (e.key === 'Escape') handleRequestClose(); };

    window.addEventListener('open-botpress', onOpen);
    window.addEventListener('close-botpress', onClose);
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('open-botpress', onOpen);
      window.removeEventListener('close-botpress', onClose);
      window.removeEventListener('keydown', onKey);
      if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null; }
    };
  }, []);

  useEffect(() => {
    // Focus the close button when opened for accessibility
    if (open && typeof document !== 'undefined') {
      const isDesktop = window.innerWidth >= 769;
      const btnId = isDesktop ? 'chatbot-close-outside' : 'chatbot-close';
      const btn = document.getElementById(btnId) || document.getElementById('chatbot-close');
      if (btn) btn.focus();
    }
  }, [open]);

  // Lock body scroll while chatbot is open (desktop and mobile) and restore on close
  useEffect(() => {
    if (!open) {
      if (originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current || '';
        originalOverflowRef.current = null;
      }
      return;
    }

    if (originalOverflowRef.current === null) {
      originalOverflowRef.current = document.body.style.overflow;
    }
    document.body.style.overflow = 'hidden';

    function ensureHidden() {
      if (open && document.body.style.overflow !== 'hidden') {
        document.body.style.overflow = 'hidden';
      }
    }

    window.addEventListener('resize', ensureHidden);
    window.addEventListener('orientationchange', ensureHidden);
    return () => {
      window.removeEventListener('resize', ensureHidden);
      window.removeEventListener('orientationchange', ensureHidden);
      if (originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current || '';
        originalOverflowRef.current = null;
      }
    };
  }, [open]);

  // Ensure correct viewport height for mobile browsers by setting --vh to 1% of window.innerHeight
  useEffect(() => {
    function setVh() {
      if (typeof window === 'undefined' || !window.innerHeight) return;
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }

    if (open) {
      setVh();
      window.addEventListener('resize', setVh);
      window.addEventListener('orientationchange', setVh);
    }

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
      // remove variable when closed to avoid side effects
      if (!open) document.documentElement.style.removeProperty('--vh');
    };
  }, [open]);

  if (!open && !isClosing) return null;

  const content = (
    <>
      {/* Backdrop: blur + dim the page behind the chatbot (click closes) */}
      <div
        className={`chatbot-backdrop ${isClosing ? 'chatbot-backdrop--closing' : 'chatbot-backdrop--open'}`}
        onClick={handleRequestClose}
        aria-hidden="true"
      />

      <div className={`chatbot-container ${isClosing ? 'chatbot-container--closing' : 'chatbot-container--open'}`} id="chatbot-container" role="dialog" aria-label="Chatbot" aria-modal="true" tabIndex={-1}>
        <iframe
          src={BOT_IFRAME_SRC}
          frameBorder="0"
          allow="autoplay; microphone; camera"
          className="botpress-iframe"
          title="Botpress Chat"
        />
        <button
          className="chatbot-close chatbot-close--inside"
          id="chatbot-close"
          aria-label="Tutup chatbot"
          onClick={handleRequestClose}
        >
          ×
        </button>
      </div>

      {/* Floating outside close button for desktop so it remains visible outside the modal */}
      <button
        className={`chatbot-close chatbot-close--outside ${isClosing ? 'chatbot-close--outside--closing' : ''}`}
        id="chatbot-close-outside"
        aria-label="Tutup chatbot"
        onClick={handleRequestClose}
      >
        ×
      </button>
    </>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
}
