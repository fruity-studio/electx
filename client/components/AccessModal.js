import classnames from "classnames"
import { Formik } from "formik"
import React from "react"
import { UserCheck, UserPlus, Users } from "react-feather"

import Modal from "./Modal"

function AccessModal({
  closeModal,
  roles,
  handleRoleRequest,
  electionId,
  approveRoleRequest,
}) {
  const { role, roleRequest, requestId } = roles
  const handleSubmit = async (values, actions) => {
    await approveRoleRequest(electionId, values.request)
    actions.resetForm()
    closeModal()
  }

  const roleCanValidate = () => {
    let canValidate = "voter"
    switch (role) {
      case 4:
        canValidate = "state"
        break
      case 3:
        canValidate = "zone"
        break
      default:
        break
    }

    return canValidate
  }

  return (
    <div className="p-4 flex flex-1 flex-col">
      <h2 className="mb-3 font-semibold text-xl">Manage Poll Access</h2>
      <div className="mb-3 flex flex-1 flex-col w-full">
        <h3 className="text-base mb-2">Request Your Access Level:</h3>
        <div className="grid gap-4 grid-cols-3 w-full text-sm">
          {/* State Validator */}
          <div
            className={classnames(
              "border border-dashed rounded flex flex-col items-center justify-center pt-9 pb-3",
              {
                "opacity-20": role > 0 && role !== 3,
              }
            )}
          >
            <Users size={30} />
            <span>State Validator</span>
            {role < 1 && (roleRequest === 0 || roleRequest === 3) && (
              <button
                onClick={handleRoleRequest("state", roleRequest === 3)}
                className={classnames(
                  "mt-3 py-1 px-4 border-2 mr-2 self-center border-gray-300 hover:border-gray-500 bg-transparent rounded"
                )}
              >
                {roleRequest === 3 ? "Cancel" : "Request"}
              </button>
            )}
          </div>
          {/* Zone Validator */}
          <div
            className={classnames(
              "border border-dashed rounded flex flex-col items-center justify-center pt-9 pb-3",
              {
                "opacity-20": role > 0 && role !== 2,
              }
            )}
          >
            <UserPlus size={30} />
            <span>Zone Validator</span>
            {role < 1 && (roleRequest === 0 || roleRequest === 2) && (
              <button
                onClick={handleRoleRequest("zone", roleRequest === 2)}
                className="mt-3 py-1 px-4 border-2 mr-2 border-gray-300 hover:border-gray-500 bg-transparent rounded"
              >
                {roleRequest === 2 ? "Cancel Request" : "Request"}
              </button>
            )}
          </div>
          {/* Voter Access */}
          <div
            className={classnames(
              "border border-dashed rounded flex flex-col items-center justify-center pt-9 pb-3",
              {
                "opacity-20": role > 0 && role !== 1,
              }
            )}
          >
            <UserCheck size={30} />
            <span>Voter Access</span>
            {role < 1 && (roleRequest === 0 || roleRequest === 1) && (
              <button
                onClick={handleRoleRequest("voter", roleRequest === 1)}
                className="mt-3 py-1 px-4 border-2 mr-2 border-gray-300 hover:border-gray-500 bg-transparent rounded"
              >
                {roleRequest === 1 ? "Cancel Request" : "Request"}
              </button>
            )}
          </div>
        </div>
        {roleRequest > 0 && (
          <div className="text-xs p-3 mt-2 flex rounded w-full items-center justify-center bg-gray-50">
            {requestId}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col w-full">
        <Formik
          initialValues={{
            request: "",
          }}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <form className="w-full text-sm mt-2" onSubmit={props.handleSubmit}>
              {role > 1 && (
                <>
                  <h3 className="text-base mt-3 mb-2">
                    Validate {roleCanValidate()} access requests:
                  </h3>
                  <div className="flex flex-1 flex-row">
                    <div className="w-full mb-2 flex flex-1 flex-col">
                      {/* <div className="mb-1">
                      <label htmlFor="request">Request ID</label>
                    </div> */}
                      <input
                        type="text"
                        name="request"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.request}
                        placeholder="Request ID..."
                        className="flex w-full rounded p-3 bg-gray-200"
                      />
                    </div>
                    {/* <div className="w-4" />
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
                  </div> */}
                  </div>
                </>
              )}
              <div className="flex w-full flex-row items-center justify-end mt-3">
                <button
                  onClick={closeModal}
                  className="py-2 px-4 border-2 mr-2 border-gray-300 hover:border-gray-500 bg-transparent rounded"
                >
                  Close
                </button>
                {role > 1 && (
                  <input
                    type="submit"
                    value="Submit"
                    className="py-2 px-4 border-2 border-gray-300 hover:border-gray-500 bg-transparent rounded"
                  />
                )}
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Modal(AccessModal)
