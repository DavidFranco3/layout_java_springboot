interface InputLabelProps {
    value?: string;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
}

export default function InputLabel({ value, className = '', children, ...props }: InputLabelProps) {
    return (
        <label {...props} className={`block font-medium text-sm text-gray-700 ` + className}>
            {value ? value : children}
        </label>
    );
}
