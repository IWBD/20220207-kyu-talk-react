import 'material-icons/iconfont/material-icons.css';
import './styles.scss'

import _ from 'lodash'

const options = [ 'outlined', 'round', 'sharp', 'two-tone' ]

function Icon( props ) {
  return (
    <span className={'material-icons' + 
                    ( options.includes( props.option ) ? `-${props.option}` : '' ) + 
                    ( props.className ? ` ${props.className}` : '' ) } 
          style={{fontSize: props.fontSize, color: props.color, ...props.style}}>
      { props.iconName || props.children }
    </span>          
  )
  
}

export default Icon