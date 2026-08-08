import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState
} from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect) // Case-sensitive "reInit"
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

type PropType = ComponentPropsWithRef<'button'>

export const PrevButton = (props: PropType) => {
  const { children, disabled, className = '', ...restProps } = props

  return (
    <button
      className={`embla__button embla__button--prev ${className} ${
        disabled ? 'embla__button--disabled' : ''
      }`}
      type="button"
      disabled={disabled}
      {...restProps}
    >
      <ChevronLeft className="size-6" />
      {children}
    </button>
  )
}

export const NextButton = (props: PropType) => {
  const { children, disabled, className = '', ...restProps } = props

  return (
    <button
      className={`embla__button embla__button--next ${className} ${
        disabled ? 'embla__button--disabled' : ''
      }`}
      type="button"
      disabled={disabled}
      {...restProps}
    >
      <ChevronRight className="size-6" />
      {children}
    </button>
  )
}