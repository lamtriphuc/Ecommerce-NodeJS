import { Steps } from 'antd'
import React from 'react'

const StepComponent = ({ current = 0, items = [], labelPlacement = null }) => {
    return (
        <Steps
            labelPlacement={labelPlacement}
            current={current}
            items={items}
        />
    )
}

export default StepComponent