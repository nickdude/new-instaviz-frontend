import React from 'react'

const BlackButton = ({ label }) => {
    return (
        <button className='bg-black font-inter text-white font-medium border border-black text-sm px-8 py-3 rounded-xl shadow-fancy'>{label}</button>
    )
}

export default BlackButton