import React from 'react'

const WhiteButton = ({ icon, text, onClick, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`group bg-offWhite p-2 sm:p-3 w-32 sm:w-40 h-10 sm:h-11 rounded-lg shadow-custom flex items-center justify-center space-x-2 sm:space-x-3 text-xs sm:text-sm transition ${disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-black'
                }`}
        >
            <img src={icon} alt="" className={`w-4 h-4 sm:w-5 sm:h-5 ${!disabled && 'group-hover:invert group-hover:brightness-0'}`} />
            <span className={!disabled ? 'group-hover:text-white' : ''}>{text}</span>
        </button>

    )
}

export default WhiteButton