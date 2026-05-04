import { useEffect, useRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
    isError?: boolean;
}

export default function TextInput(
    { type = 'text', className = '', isFocused = false, ref, ...props }: TextInputProps
) {
    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused && localRef.current) {
            localRef.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 ' +
                className
            }
            ref={(node) => {
                localRef.current = node;
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref) {
                    (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                }
            }}
        />
    );
}
