import { useEffect } from 'react';

type KeyboardShortcuts = {
    [key: string]: () => void;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts, active: boolean = true) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!active) return;

            const target = e.target as HTMLElement | null;
            const isTypingTarget = !!target && (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                target.isContentEditable
            );
            if (isTypingTarget) return;

            const shortcut = shortcuts[e.key];
            if (shortcut) {
                shortcut();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [shortcuts, active]);
}