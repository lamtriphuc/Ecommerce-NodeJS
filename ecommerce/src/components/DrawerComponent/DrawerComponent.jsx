import { Drawer } from 'antd'
import React from 'react'

const DrawerComponent = ({ title = 'Drawer', placement = 'right', isOpen = false, children, ...rests }) => {
    return (
        <>
            <Drawer
                title={title}
                closable={{ 'aria-label': 'Close Button' }}
                placement={placement}
                open={isOpen}
                {...rests}
            >
                {children}
            </Drawer>
        </>
    )
}

export default DrawerComponent