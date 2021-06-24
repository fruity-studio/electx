import { Field, Formik } from "formik"
import moment from "moment"
import React from "react"

import DatePicker from "./DatePicker"
import Modal from "./Modal"

function CreateElectionModal({ createElection, closeModal }) {
  const handleSubmit = async (values, actions) => {
    const { name, description, pollDates } = values
    const [_start, _end] = pollDates
    const pollStart = moment(_start).valueOf()
    const pollEnd = moment(_end).valueOf()

    await createElection({ name, description, pollStart, pollEnd })
    actions.resetForm({
      name: "",
      pollDates: [new Date(), new Date()],
      description: "",
    })
    closeModal()
  }

  return (
    <div className="p-4 flex flex-1 flex-col">
      <h2 className="mb-3 font-semibold text-xl">Create New Poll</h2>
      <Formik
        initialValues={{
          name: "",
          pollDates: [new Date(), new Date()],
          description: "",
        }}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <form className="w-full text-sm" onSubmit={props.handleSubmit}>
            <div className="flex flex-1 flex-col">
              <div className="w-full mb-2 flex flex-1 flex-col">
                <div className="mb-1">
                  <label htmlFor="name">Name</label>
                </div>
                <input
                  type="text"
                  name="name"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.name}
                  placeholder="X Poll 2023..."
                  className="flex w-full rounded p-3 bg-gray-200"
                />
              </div>
              <div className="w-4" />
              <div className="w-full mb-2 flex flex-1 flex-col">
                <div className="mb-1">
                  <label htmlFor="name">Poll Range</label>
                </div>
                <Field name="pollDates" component={DatePicker} />
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-full mb-2 flex flex-1 flex-col">
                <div className="mb-1">
                  <label htmlFor="description">Description</label>
                </div>
                <textarea
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.description}
                  placeholder="Poll Description"
                  name="description"
                  rows={5}
                  className="w-full p-3 rounded resize-none bg-gray-200"
                ></textarea>
              </div>
            </div>
            <div className="flex w-full flex-row items-center justify-end mt-3">
              <button
                onClick={closeModal}
                className="py-2 px-4 border-2 mr-2 border-gray-300 hover:border-gray-500 bg-transparent rounded"
              >
                Cancel
              </button>
              <input
                type="submit"
                value="Submit"
                className="py-2 px-4 border-2 border-gray-300 hover:border-gray-500 bg-transparent rounded"
              />
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default Modal(CreateElectionModal)
