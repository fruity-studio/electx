// import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker/dist/entry.nostyle'
import React from 'react'

function DatePicker(FieldProps) {
  return (
    <DateTimeRangePicker
      minDate={new Date()}
      className="w-full"
      {...FieldProps.field}
      onChange={(option) =>
        FieldProps.form.setFieldValue(FieldProps.field.name, option)
      }
    />
  )
}

export default DatePicker
