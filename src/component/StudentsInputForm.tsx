import React, {   useState } from 'react'
import { Container } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import Moment from 'react-moment'

export default function StudentsInputForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [inputList, setInputList] = useState([
    { fullName: '', dateOfBirth: '', age: 0 },
  ])

  const [isViewList, setIsViewList] = useState(false)
  const URL = 'https://localhost:7055/v1/api/Students'

  const handleInputChange = (e, name, index) => {
    const { value } = e.target
    const list = [...inputList]
    list[index][name] = value
    setInputList(list)
  }

  const resetForm = () => { 
    setIsViewList(false)

    setInputList([...inputList, { fullName: '', dateOfBirth: '', age: 0 }])
    // this.setState({ inputList: [] });
    // setInputList([
    //   { fullName: '', dateOfBirth: '', age: 0 },
    // ])
    console.log(inputList)
  }

  const submitData = () => {
    if (inputList.length < 3) {
      toast.warning('Please input >= 30 students !')

      return
    }

    axios
      .post(URL, inputList)
      .then((response) => {
        setIsViewList(true) // flag to show list data
        setInputList(response.data)
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
    setInputList([...inputList, { fullName: '', dateOfBirth: '', age: 0 }])
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
                {inputList.map((x, i) => {
                  return (
                    <div key={i} className="row mb-3">
                      <div className="form-group col-md-1">
                        <h4>{i + 1}</h4>
                      </div>
                      <div className="form-group col-md-3">
                        <input
                          key={'fullname' + i}
                          {...register('fullName' + i, {
                            required: true,
                          })}
                          className="form-control"
                          onChange={(e) => handleInputChange(e, 'fullName', i)}
                        />
                        {errors['fullName' + i] && (
                          <span className="text-danger">
                            This field is required
                          </span>
                        )}
                      </div>
                      <div className="form-group col-md-3">
                        <DatePicker
                          selected={x.dateOfBirth}
                          className="form-control"
                          onChange={(date: Date) => setStartDate(date, i)}
                        />
                      </div>
                      <div className="form-group col-md-2">
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
                  <th scope="col">Age</th>
                </tr>
              </thead>
              <tbody>
                {inputList.map((x, i) => (
                  <tr key={i}>
                    <td>{x.fullName}</td>
                    <td>
                    <Moment format="MM/DD/YYYY">{x.dateOfBirth}</Moment>
                    </td>
                    <td>{x.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                resetForm()
              }}
            >
              Back
            </button>
          </div>
        )}
      </Container>
    </div>
  )
}
