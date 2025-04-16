import React, { useState, useEffect } from 'react'
import { supabase } from '../SupabaseClient'

function GetProducts() {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    useEffect(() => {
        getProducts()
    }, [])

    async function getProducts() {
        setLoading(true)
        let { data: products, error } = await supabase
            .from('products')
            .select('*')
        if (error) {
            console.error('Error fetching products:', error.message)
        }
        setProducts(products || [])
        setLoading(false)
    }

    return (
        <>

            <div className="flex flex-col m-5">
                <div className="bg-gray-200 p-5 rounded h-1/2 w-1/2 flex justify-around items-start flex-col ">
                    <h1 className=" text-red-500 text-3xl font-bold underline" >
                        Products Name & Prices
                    </h1>
                    {
                        loading ? <p>Loading...</p> : products.map((product) => (
                            <li key={product.id}>{product.title} -- {product.price}</li>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default GetProducts
