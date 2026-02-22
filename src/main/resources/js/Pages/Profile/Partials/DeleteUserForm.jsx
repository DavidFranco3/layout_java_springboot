import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={`${className} relative overflow-hidden`}>
            <header className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-500/10 dark:bg-red-400/10 rounded-xl">
                    <i className="fas fa-user-slash text-2xl text-red-600 dark:text-red-400"></i>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Eliminar Cuenta</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Una vez que tu cuenta sea eliminada, todos sus recursos y datos serán borrados permanentemente.
                    </p>
                </div>
            </header>

            <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl max-w-2xl">
                <p className="text-sm text-red-800 dark:text-red-300 mb-6">
                    Por favor, descarga cualquier dato o información que desees conservar antes de proceder con la eliminación.
                </p>

                <DangerButton
                    onClick={confirmUserDeletion}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-500/25 px-8 py-2.5 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    <i className="fas fa-trash-alt me-2"></i>
                    Eliminar Mi Cuenta
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden relative">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-red-500/5 rounded-full blur-3xl"></div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-4">
                        <i className="fas fa-exclamation-triangle text-red-500"></i>
                        ¿Estás seguro de eliminar tu cuenta?
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        Esta acción no se puede deshacer. Todos tus datos serán borrados permanentemente. Por favor, ingresa tu contraseña para confirmar.
                    </p>

                    <div className="group transition-all duration-200">
                        <InputLabel htmlFor="password" value="Contraseña de Confirmación" className="text-gray-700 dark:text-gray-300 font-semibold mb-2" />
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-red-500 transition-colors">
                                <i className="fas fa-key text-lg"></i>
                            </span>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="block w-full pl-12 py-4 text-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900/50 backdrop-blur-sm focus:border-red-500 focus:ring-red-500 rounded-2xl transition-all shadow-sm"
                                isFocused
                                placeholder="Tu contraseña"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-10 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 border-t border-gray-100 dark:border-slate-800 pt-6">
                        <SecondaryButton
                            onClick={closeModal}
                            className="w-full sm:w-auto px-8 py-2.5 rounded-xl border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all justify-center"
                        >
                            Cancelar
                        </SecondaryButton>

                        <DangerButton
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-500/25 px-8 py-2.5 rounded-xl transition-all justify-center"
                            disabled={processing}
                        >
                            {processing ? <i className="fas fa-circle-notch fa-spin me-2"></i> : <i className="fas fa-trash-alt me-2"></i>}
                            Confirmar Eliminación
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

