import './styles.scoped.scss'
import { useState, useEffect } from 'react'

function TextFiled( props ) {
  const [ value, setValue ] = useState( props.value || '' )

  const onChange = ( event ) => {
    if( props.onChange ) {
      props.onChange( event.target.value )
    } else {
      setValue( event.target.value )
    }
  }

  useEffect( () => {
    setValue( props.value )
  }, [props.value] )

  return (
    <div className={'text-field-wrapper ' + 
                    ( props.className || '' )}>
      <input className="text-field" 
             maxLength={props.maxLength} 
             minLength={props.minLength}
             placeholder={props.placeholder}
             value={value}
             onChange={onChange}></input>
    </div>
  )
}

export default TextFiled