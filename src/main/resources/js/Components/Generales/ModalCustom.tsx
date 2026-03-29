import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const ModalCustom = ({
    children,
    show = false,
    onClose = () => { },
    maxWidth = 'md', // sm, md, lg, xl, 2xl, full, 90w
}) => {
    // Map bootstrap sizes or custom sizes to Tailwind max-widths
    const sizeClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-4xl',
        xl: 'sm:max-w-6xl',
        '2xl': 'sm:max-w-7xl',
        '90w': 'sm:max-w-[90%]',
        full: 'sm:max-w-full sm:m-4',
    };

    const maxWidthClass = sizeClasses[maxWidth] || sizeClasses['md'];

    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50 modal-custom-wrapper" onClose={onClose}>
                <style>{`
                    html.dark .modal-custom-wrapper .bg-white {
                        background-color: #0f172a !important; /* Slate 900 */
                        border-color: #334155 !important;
                    }
                    html.dark .modal-custom-wrapper .text-gray-900 {
                        color: #f3f4f6 !important; /* Gray 100 */
                    }
                    html.dark .modal-custom-wrapper .text-gray-500,
                    html.dark .modal-custom-wrapper .text-gray-700 {
                        color: #94a3b8 !important; /* Slate 400 */
                    }
                `}</style>
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className={`relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidthClass} border border-transparent dark:border-slate-700 flex flex-col max-h-[90vh]`}
                            >
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// Subcomponentes
const ModalHeader = ({ children, closeButton = false, onClose }) => {
    return (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex justify-between items-center bg-opacity-80 dark:bg-opacity-80 shrink-0">
            <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                {children}
            </Dialog.Title>
            {closeButton && (
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                    <i className="fas fa-times"></i>
                </button>
            )}
        </div>
    );
};

const ModalBody = ({ children, className = '' }) => {
    return (
        <div className={`px-6 py-4 overflow-y-auto custom-scrollbar dark:text-gray-300 ${className}`}>
            {children}
        </div>
    );
};

const ModalFooter = ({ children }) => {
    return (
        <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-3 border-t border-gray-200 dark:border-slate-700 flex flex-row-reverse gap-2 shrink-0">
            {children}
        </div>
    );
};

// Asignar subcomponentes
ModalCustom.Header = ModalHeader;
ModalCustom.Body = ModalBody;
ModalCustom.Footer = ModalFooter;

export default ModalCustom;
