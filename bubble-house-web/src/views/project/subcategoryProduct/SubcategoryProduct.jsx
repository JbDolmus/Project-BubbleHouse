import React from 'react'
import NavBarPrincipal from '../../../layouts/NavBarPrincipal'
import { FaPlus } from 'react-icons/fa6'

export default function SubcategoryProduct() {
    return (
        <>
            <NavBarPrincipal
                title={"Productos"}
            />

            <div className="flex flex-col items-center min-h-screen p-6">
                <h1 className="text-4xl font-bold text-white mb-6">Listado de Subcategorías</h1>
                <div className="flex flex-col items-center gap-3 mb-4 md:flex-row md:justify-start w-full max-w-4xl">
                    <button
                        type='button'
                        onClick={() => { }}
                        className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-32 py-4 md:px-6 md:py-2 md:flex-row rounded"
                    >
                        <FaPlus className="text-3xl md:text-xl md:mx-1" />
                        Nueva Subcategoría
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">

                </div>
            </div>
        </>
    )
}
