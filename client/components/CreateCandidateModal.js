import { Formik } from 'formik'
import React from 'react'

import Modal from './Modal'

function CreateCandidateModal({ addNewCandidate, closeModal }) {
  const handleSubmit = async (values, actions) => {
    console.log(values)
    await addNewCandidate(values)
    actions.resetForm()
    closeModal()
  }

  return (
    <div className="p-4 flex flex-1 flex-col">
      <h2 className="mb-3 font-semibold text-xl">Add New Candidate</h2>
      <Formik
        initialValues={{
          name: "",
          party: "",
          manifesto: "",
        }}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <form className="w-full text-sm" onSubmit={props.handleSubmit}>
            <div className="flex flex-1 flex-row">
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
                  placeholder="Candidate Name..."
                  className="flex w-full rounded p-3 bg-gray-200"
                />
              </div>
              <div className="w-4" />
              <div className="w-full mb-2 flex flex-1 flex-col">
                <div className="mb-1">
                  <label htmlFor="party">Party</label>
                </div>
                <input
                  type="text"
                  name="party"
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.party}
                  placeholder="Party..."
                  className="flex w-full rounded p-3 bg-gray-200"
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="w-full mb-2 flex flex-1 flex-col">
                <div className="mb-1">
                  <label htmlFor="manifesto">Manifesto</label>
                </div>
                <textarea
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  value={props.values.manifesto}
                  placeholder="Candidate Manifesto"
                  name="manifesto"
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

export default Modal(CreateCandidateModal)
