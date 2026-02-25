import React from 'react'

const BlueTransparentButton = ({ label, onClick }) => {
    return (
        <button className='font-medium font-inter text-sm text-blue-600 border border-blue-600 px-8 py-3 rounded-xl shadow-custom hover:bg-blue-600 hover:text-white transition-colors' onClick={onClick}>{label}</button>
    )
}

export default BlueTransparentButton