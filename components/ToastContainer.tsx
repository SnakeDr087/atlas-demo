import React from 'react';
import { useAppContext } from '../contexts/AppContext.tsx';
import Toast from './Toast.tsx';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useAppContext();

    return (
        <div className="fixed top-5 right-5 z-[100] w-full max-w-xs space-y-3">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastContainer;