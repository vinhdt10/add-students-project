import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import Moment from 'react-moment'
import _ from 'lodash'

export default function StudentsInputForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({defaultValues: {
    students: [{ fullName: '', dateOfBirth: '' }]
  }})
  let { fields, append, remove } = useFieldArray({
    control,
    name: 'students',
  })

  const [isViewList, setIsViewList] = useState(false)
  const URL = 'https://localhost:7055/v1/api/Students'

  const handleInputChange = (e, name, index) => {
    const { value } = e.target

    fields[index][name] = value
    fields = [...fields]
  }

  const resetForm = () => {
    setIsViewList(false)
    reset({ students: [{ fullName: '', dateOfBirth: '' }] })
  }

  const submitData = () => {
    if (fields.length < 3) {
      toast.warning('Please input >= 30 students !')

      return
    }

    axios
      .post(URL, fields)
      .then((response) => {
        setIsViewList(true) // flag to show list data
        toast.success('Successfully !')
      })
      .catch((error) => {
        toast.error(error)
      })
  }

  const setStartDate = (value, index) => {
    (fields[index] as any).dateOfBirth = value
  }

  const handleRemove = (index) => {
    remove(index)
  }
  const handLeadClick = () => {
    append({ fullName: '', dateOfBirth: '' })
  }
  return (
    <div>
      <ToastContainer />
      <Container className="content">
        {!isViewList && (
          <div className="row">
            <div className="col-sm-12">
              <h5 className="mt-3 mb-4 fw-bold">
                Dynamically add/remove students
              </h5>
              <form onSubmit={handleSubmit(submitData)}>
                <div className="row mb-3">
                  <div className="form-group col-md-1"></div>
                  <div className="form-group col-md-3">
                    <label>Full name *</label>
                  </div>
                  <div className="form-group col-md-3">
                    <label>Date of Birth - DOB</label>
                  </div>
                </div>
                {fields.map((x: any, i) => {
                  return (
                    <div key={i} className="row mb-3">
                      <div className="form-group col-md-1">
                        <h4>{i + 1}</h4>
                      </div>
                      <div className="form-group col-md-4">
                        <Controller
                          control={control}
                          name={`students.${i}.fullName`}
                          render={({ field }) => (
                            <input
                              key={i}
                              {...register(`students.${i}.fullName`, {
                                required: true,
                              })}
                              onChange={(e) => {
                                field.onChange(e)
                                handleInputChange(e, 'fullName', i)
                              }}
                              className="form-control"
                            />
                          )}
                        />

                        {!_.isEmpty(errors?.students?.[i]) &&
                          !_.isEmpty(errors?.students?.[i])?.fullName &&
                           (
                            <span className="text-danger">
                              This field is required
                            </span>
                          )}
                      </div>
                      <div className="form-group col-md-4">
                        <Controller
                          control={control}
                          name={`students.${i}.dateOfBirth`}
                          render={({ field }) => (
                            <DatePicker
                              placeholderText="Select date"
                              className="form-control"
                              onChange={(date) => {
                                field.onChange(date)
                                setStartDate(date, i)
                              }}
                              selected={field.value}
                            />
                          )}
                        />
                      </div>
                      <div className="form-group col-md-3">
                        {fields.length !== 1 && (
                          <button
                            className="btn btn-danger mx-1"
                            onClick={() => handleRemove(i)}
                          >
                            Remove
                          </button>
                        )}
                        {fields.length - 1 === i && (
                          <button
                            className="btn btn-success"
                            onClick={handLeadClick}
                          >
                            Add More
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div className="row">
                  <div className="col-sm-12">
                    <button className="btn btn-success" type="submit">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        {isViewList && (
          <div>
            <table className="table" width="100%">
              <thead>
                <tr>
                  <th scope="col">Full Name</th>
                  <th scope="col">Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((x: any, i) => (
                  <tr key={i}>
                    <td>{x.fullName}</td>
                    <td>
                      <Moment format="MM/DD/YYYY">{x.dateOfBirth}</Moment>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-outline-primary" onClick={resetForm}>
              Back
            </button>
          </div>
        )}
      </Container>
    </div>
  )
}
