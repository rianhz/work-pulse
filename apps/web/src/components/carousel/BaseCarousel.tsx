import React, { Activity } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay, { AutoplayOptionsType } from 'embla-carousel-autoplay' // 1. Import Autoplay
import { NextButton, PrevButton, usePrevNextButtons } from './BaseCarouselButton'
import { DotButton, useDotButton } from './BaseCarouselDotButton'

type PropType = {
  children: React.ReactNode
  options?: EmblaOptionsType
  showArrowButton?: boolean
  showDotButton?: boolean
  autoplay?: boolean // 2. Add toggle prop (optional, defaults to true)
  autoplayOptions?: AutoplayOptionsType // 3. Add options prop (optional)
}

const EmblaCarousel = (props: PropType) => {
  const { 
    children, 
    options, 
    showArrowButton = true, 
    showDotButton = true,
    autoplay = true,
    autoplayOptions = { delay: 4000, stopOnInteraction: false }
  } = props

  // 4. Instantiate plugins array based on the autoplay prop
  const plugins = autoplay ? [Autoplay(autoplayOptions)] : []

  // 5. Pass plugins as the 2nd argument to useEmblaCarousel
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    /* Make the root element relative so absolute buttons anchor to it */
    <div className="embla relative group w-full">
      
      <div className="embla__viewport overflow-hidden w-full" ref={emblaRef}>
        <div className="embla__container flex">
          {React.Children.map(children, (child, index) => (
            <div className="embla__slide min-w-0 flex-[0_0_100%] h-full" key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>

      <Activity mode={showArrowButton ? "visible" : "hidden"}>
        <PrevButton 
          onClick={onPrevButtonClick} 
          disabled={prevBtnDisabled} 
          className="opacity-50 group-hover:opacity-100 transition-all duration-300 absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md disabled:opacity-40 disabled:cursor-not-allowed" 
        />
        <NextButton 
          onClick={onNextButtonClick} 
          disabled={nextBtnDisabled} 
          className="opacity-50 group-hover:opacity-100 transition-all duration-300 absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md disabled:opacity-40 disabled:cursor-not-allowed" 
        />
      </Activity>

      <Activity mode={showDotButton ? "visible" : "hidden"}>
        <div className="embla__controls flex justify-center w-full gap-2 mt-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'w-2.5 h-2.5 rounded-full transition-colors cursor-pointer '.concat(
                index === selectedIndex ? 'bg-gray-800' : 'bg-gray-300'
              )}
            />
          ))}
        </div>
      </Activity>
    </div>
  )
}

export default EmblaCarousel