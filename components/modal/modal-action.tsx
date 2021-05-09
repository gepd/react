import React, {
  MouseEvent,
  PropsWithoutRef,
  RefAttributes,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import css from 'styled-jsx/css'
import useTheme from '../use-theme'
import { useModalContext } from './modal-context'
import Button, { ButtonProps } from '../button/button'
import { getColors } from './styles'
import { NormalTypes } from 'components/utils/prop-types'

type ModalActionEvent = MouseEvent<HTMLButtonElement> & {
  close: () => void
}

interface Props {
  type?: NormalTypes
  className?: string
  disabled?: boolean
  onClick?: (event: ModalActionEvent) => void
}

const defaultProps = {
  className: '',
  disabled: false,
  type: 'default' as NormalTypes,
}

export type ModalActionProps = Props &
  typeof defaultProps &
  Omit<ButtonProps, keyof Props>

const ModalAction = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ModalActionProps>
>(
  (
    { type, className, children, onClick, disabled, ...props },
    ref: React.Ref<HTMLButtonElement | null>,
  ) => {
    const theme = useTheme()
    const btnRef = useRef<HTMLButtonElement>(null)
    const { close } = useModalContext()
    useImperativeHandle(ref, () => btnRef.current)

    const clickHandler = (event: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      const actionEvent = Object.assign({}, event, {
        close: () => close && close(),
      })
      onClick && onClick(actionEvent)
    }

    const { color, background } = useMemo(() => getColors(theme.palette, type), [
      theme.palette,
      type,
    ])

    const { className: resolveClassName, styles } = css.resolve`
      button.btn {
        font-size: 0.75rem;
        border: none;
        color: ${disabled ? theme.palette.foreground : color};
        background-color: ${disabled ? theme.palette.accents_1 : background};
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        flex: 1;
        height: 100%;
        border-radius: 0;
        min-width: 0;
      }
      button.btn:hover,
      button.btn:focus {
        color: ${disabled && theme.palette.foreground};
        background-color: ${disabled && theme.palette.accents_1};
      }
    `

    const overrideProps = {
      ...props,
      effect: false,
      ref: btnRef,
    }

    return (
      <Button
        className={`${resolveClassName} ${className}`}
        onClick={clickHandler}
        disabled={disabled}
        {...overrideProps}>
        {children}
        {styles}
      </Button>
    )
  },
)

type ModalActionComponent<T, P = {}> = React.ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>

type ComponentProps = Partial<typeof defaultProps> &
  Omit<Props, keyof typeof defaultProps> &
  Partial<Omit<ButtonProps, keyof Props>>

ModalAction.defaultProps = defaultProps

export default ModalAction as ModalActionComponent<HTMLButtonElement, ComponentProps>
