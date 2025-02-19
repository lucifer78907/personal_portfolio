import React from 'react'
import img1 from '../assets/gallery/image1.webp'
import img2 from '../assets/gallery/image2.webp'
import img3 from '../assets/gallery/image3.webp'

function Gallery() {
    return (
        <section className='p-4'>
            <h1 className='text-xl font-semibold text-amber-700/50'>I love to click pictures sooo...</h1>
            <p className='mt-2 text-sm text-right font-semibold text-amber-700/30'>Drumrolls ... (Ta daa)</p>
            <main className='mt-8 grid grid-cols-1 gap-2'>
                <figure>
                    <img src={img1} />
                </figure>
                <figure>
                    <img src={img2} />
                </figure>
                <figure>
                    <img src={img3} />
                </figure>
            </main>
        </section>
    )
}

export default Gallery