import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toSlug } from '../../utils'

const TypeProduct = ({ name }) => {
    const navigate = useNavigate()
    const handleNavigateType = (type) => {
        const slugType = toSlug(type)
        navigate(`/product/${slugType}`, { state: type })
    }
    return (
        <div style={{ padding: '0 10px', cursor: 'pointer' }} onClick={() => handleNavigateType(name)} >{name}</div>
    )
}

export default TypeProduct