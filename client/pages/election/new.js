// import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { Field, Formik } from 'formik'
import { useEffect, useState } from 'react'

import { DatePicker } from '../../components'

export default function New() {
  useEffect(async () => {
    // manage the rest here
    // const elResponse = await props.contractActionsFactory("createElection", [
    //   "Bliss Election",
    //   "Some X election",
    //   1624058862,
    //   1624663615,
    //   3,
    // ])
    // const { id } = await props.getReturnValue(elResponse)
    // props.router.push(`election/${id}`)
    // console.log(res)
  }, [])

  const createNewElection = async (values, actions) => {
    console.log(values)
  }

  return (
    <div className="flex flex-col items-center justify-center self-center max-w-sm py-2">
      <Formik
        initialValues={{
          name: "",
          description: "",
          pollDates: [new Date(), new Date()],
          adminsCount: 3,
        }}
        onSubmit={createNewElection}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} className="text-sm">
            {/* Name */}
            <input
              type="text"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.name}
              placeholder="Election Name"
              name="name"
              className="w-full p-2 rounded border border-gray-300 mb-2"
            />
            {/* Description */}
            <textarea
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.description}
              placeholder="Election Description"
              name="description"
              rows={5}
              className="w-full p-2 rounded border border-gray-300 mb-2 resize-none"
            ></textarea>
            {/* Date Range Picker */}
            <Field name="pollDates" className="w-full" component={DatePicker} />
            {/* Maximum Number Of Admins */}
            <input
              type="number"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.adminsCount}
              placeholder="Admin Count"
              name="adminsCount"
              className="w-full p-2 rounded border border-gray-300 mb-2"
            />

            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 hover:bg-blue-400 text-gray-100 rounded w-full"
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  )
}
