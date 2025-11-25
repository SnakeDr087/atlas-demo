
import React from 'react';

interface ToggleSwitchProps {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
    disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled, disabled = false }) => {
    return (
        <button
            type="button"
            className={`${
                enabled ? 'bg-atlas-blue' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-atlas-blue disabled:bg-gray-300 disabled:cursor-not-allowed`}
            aria-pressed={enabled}
            onClick={() => { if (!disabled) setEnabled(!enabled); }}
            disabled={disabled}
        >
            <span className="sr-only">Use setting</span>
            <span
                className={`${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
        </button>
    );
};

export default ToggleSwitch;
