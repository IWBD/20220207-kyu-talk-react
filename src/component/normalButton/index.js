import './styles.scss'

function NormalButton( props ) {
  return (
    <div className={'normal-button' + 
                    ( props.className ? ` ${props.className}` : '' ) } 
          style={{ width: props.width, height: props.height, ...props.style }}>
      {props.children}
    </div>
  )
}


export default NormalButton