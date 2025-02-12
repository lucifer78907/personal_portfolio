import React from 'react'
import catImg from '../../assets/cat.svg'
import codeImg from '../../assets/code.svg'
import coffeeImg from '../../assets/coffee.svg'

function Grid() {
    return (
        <section className='p-4 pt-0 flex flex-col gap-2 mb-12'>
            <h2 className='font-lexend text-xl font-semibold tracking-tighter text-amber-950'>sudo find /root/moreAboutMe</h2>
            <p className='tracking-tighter -mt-1 font-lexend text-right font-medium text-sm text-amber-700/50'>There's always more to tell</p>
            <main className='grid grid-cols-1 my-6'>
                <article className='bg-amber-100/30 backdrop-blur-md shadow-lg p-2 pt-0 rounded-xl border-2 border-amber-600'>
                    <h2 className='w-max p-2 rounded-b-xl justify-center mb-4 bg-amber-800 text-neutral-50 font-semibold tracking-wide'>Three Musketeers of Rudra</h2>
                    <main className='flex items-center gap-2'>
                        <div>
                            <img src={catImg} alt='A cat' />
                            <h3 className='text-center text-amber-600 font-medium'>Cat</h3>
                        </div>
                        <div>
                            <img src={codeImg} alt='Person' />
                            <h3 className='text-center text-amber-600 font-medium'>Code</h3>
                        </div><div>
                            <img src={coffeeImg} alt='A cat' />
                            <h3 className='text-center text-amber-600 font-medium'>Coffee</h3>
                        </div>
                    </main>
                </article>
            </main>
        </section >
    )
}

export default Grid