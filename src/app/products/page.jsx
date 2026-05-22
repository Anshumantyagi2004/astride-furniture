import React from 'react'
import Product from './Product'
import Navbar from '@/components/Main/Navbar'
import Footer from '@/components/Main/Footer'

export default function page() {
    return (<>
        <Navbar />
        <Product />
        <Footer />
    </>)
}
