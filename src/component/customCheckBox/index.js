import _ from 'lodash'
import { useState, useEffect, useMemo } from 'react'

import Icon from '@component/icon'

//values
function CustomCheckBox( props ) {
  const [ value, setValue ] = useState( null )

  const onClickCheckBox = () => {
    if( props.onChange ) {
      let emitValue

      if( isMultiple ) {
        if( isChecked ) {
          if( props.falseValue === undefined ) {
            emitValue = _.filter( props.value, v => v !== trueValue )
          }
        } else {
          emitValue = [ ...props.value, trueValue ]
        }
      } else {
        emitValue = isChecked ? falseValue : trueValue 
      }

      props.onChange( emitValue )
    }

    setValue( isChecked ? falseValue : trueValue )
  }

  const isMultiple = useMemo( () => {
    return _.isArray( props.value )
  }, [props.value] )

  const trueValue = useMemo( () => {
    return props.trueValue !== undefined ? props.trueValue : true     
  }, [props.trueValue] )

  const falseValue = useMemo( () => {
    return props.falseValue !== undefined ? props.falseValue : false     
  }, [props.falseValue] )

  const isChecked = useMemo( () => {
    return isMultiple ? _.includes( props.value, value ) : trueValue === value
  }, [props.value, value] )

  useEffect( () => {
    isChecked && setValue( trueValue )   
    // return () => {
    //   console.log( props.value )
    // }
  }, [props.value] )
  
  return ( 
    <div className="custom-check-box-wrapper">
      <div className="check-box" onClick={() => onClickCheckBox()}>
        { isChecked ? 
          <Icon>check_circle</Icon> :
          <Icon>circle</Icon>}
      </div>
      <div className="label">
        
      </div>
    </div> 
  )
}

export default CustomCheckBox
