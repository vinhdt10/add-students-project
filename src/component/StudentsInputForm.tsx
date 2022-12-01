import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

export default function StudentsInputForm() {
  const [inputList, setInputList] = useState([
    { fullName: '', dateOfBirth: '' },
  ])
  const URL = 'http://localhost:3000/students'

  const handleInputChange = (e, index) => {
    const { name, value } = e.target
    const list = [...inputList]
    list[index][name] = value
    setInputList(list)
  }

  const submitData = () => {
    axios
      .post(URL, inputList)
      .then(() => {
        toast.success('Successfully !')
      })
      .catch((error) => {
        toast.error(error)
      })
  }

  const setStartDate = (value, index) => {
    let list = [...inputList]

    list[index].dateOfBirth = value
    setInputList(list)
  }

  const handleRemove = (index) => {
    const list = [...inputList]
    list.splice(index, 1)
    setInputList(list)
  }

  const handLeadClick = () => {
    setInputList([...inputList, { fullName: '', dateOfBirth: '' }])
  }
  return (
    <div>
      <ToastContainer />
      <Container className="content">
        <div className="row">
          <div className="col-sm-12">
            <h5 className="mt-3 mb-4 fw-bold">
              Dynamically add/remove students
            </h5>

            {inputList.map((x, i) => {
              return (
                <div className="row mb-3">
                  <div className="form-group col-md-4">
                    <label>Full name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      onChange={(e) => handleInputChange(e, i)}
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label>Date of Birth - DOB</label>
                    <DatePicker
                      selected={x.dateOfBirth}
                      className="form-control"
                      onChange={(date: Date) => setStartDate(date, i)}
                    />
                  </div>
                  <div className="form-group col-md-2 mt-4">
                    {inputList.length !== 1 && (
                      <button
                        className="btn btn-danger mx-1"
                        onClick={() => handleRemove(i)}
                      >
                        Remove
                      </button>
                    )}
                    {inputList.length - 1 === i && (
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
          </div>
          <div className="row">
            <div className="col-sm-12">
              <button className="btn btn-success" onClick={submitData}>
                Save
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
