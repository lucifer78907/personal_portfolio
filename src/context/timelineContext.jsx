import { useState, useCallback, createContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const timelineContext = createContext({
    tl: null,
    setTl: () => { },
    addAnimation: (animation, index) => { }
})


export const TimelineContextProvider = ({ children }) => {
    const [tl, setTl] = useState(gsap.timeline());


    const addAnimation = useCallback((animation, index) => {
        console.log("ADDED FROM", index)
        console.log('STATE AFTER ADDING', tl)
        tl && tl.add(animation, index)
    }, [tl])

    return <timelineContext.Provider value={{ tl, setTl, addAnimation }}>{children}</timelineContext.Provider>

}

export default timelineContext;