import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { createClub } from '../../Redux/Slices/clubSlice'
import BaseLayout from '../../Layouts/BaseLayout'
import {AiOutlineArrowLeft} from 'react-icons/ai'

function CreateClub() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState({
      clubName: "" ,
      description: "" ,
      thumbnail : "" ,
      tagline: "" ,
      previewImage: ""
  })

  function handleImageUpload (e) {
    e.preventDefault()
    const uploadedImage = e.target.files[0]
    
    if(uploadedImage){
      const fileReader = new FileReader()
      fileReader.readAsDataURL(uploadedImage)
      fileReader.addEventListener('load',()=>{
        setUserDetails({
          ...userDetails ,
          previewImage: fileReader.result ,
          thumbnail: uploadedImage
        })
      })
    }

  }

  function handleUserInput (e) {
    const {name,value} = e.target
    setUserDetails({
      ...userDetails ,
      [name] : value
    })
  }

  async function handleFormSubmit (e) {
    e.preventDefault()

    if(!userDetails.clubName || !userDetails.description || !userDetails.tagline ){
      toast.error('All fields are required')
      return
    }

    // form-data is necessary whenever we need to send image at backend else data can be passed normally !
    const formData = new FormData()

    formData.append('clubName', userDetails.clubName)
    formData.append('tagline', userDetails.tagline)
    formData.append('description', userDetails.description)
    formData.append('thumbnail', userDetails.thumbnail)

    const response = await dispatch(createClub(formData))
    // console.log(response);

    if(response?.payload?.success){
      setUserDetails({
        clubName: "" ,
        description: "" ,
        thumbnail : "" ,
        tagline: "" ,
        previewImage: ""
      })
      navigate('/clubs')
    }

  }

  return (
    <BaseLayout>
      <div className='flex justify-center items-center h-[100vh]'>
      <form 
        onSubmit={handleFormSubmit} 
        className='flex flex-col justify-center g-5 rounded-lg p-4 w-[700px] my-10 shadow-[0_0_10px_black]  relative'>

          <Link className='absolute top-8 text-2xl link text-accent cursor-pointer'>
            <AiOutlineArrowLeft />
          </Link>

          <h1 className='text-center text-2xl font-bold mb-8'>
            Create Course
          </h1>

          <main className='grid grid-cols-2 gap-x-10'>
              <div className='gap-y-6'>
                  <div >
                      <label htmlFor="image_uploads" className='cursor-pointer'>
                        {
                          userDetails.previewImage? (
                            <img 
                            className='w-full h-44 m-auto border'
                              src={userDetails.previewImage} 
                              alt="club thumbnail" />
                          ) : (
                            <div className='w-full h-44 m-auto flex items-center justify-center border'>
                              <h1 className=' text-lg text-gray-400'>Upload your course thumbnail</h1>
                            </div>
                          )
                        }
                      </label>
                      <input 
                        type="file" 
                        className='hidden'
                        accept='.jpg, .jpeg, .png'
                        id='image_uploads'
                        name='image_uploads'
                        onChange={handleImageUpload}
                      />
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <label htmlFor="clubName" className='text-lg font-semibold'>Club Name </label>
                    <input 
                      type="text" 
                      required
                      name='clubName'
                      id='clubName'
                      placeholder='Enter Club Name'
                      className='bg-transparent px-2 py-1 border'
                      value={userDetails.clubName}
                      onChange={handleUserInput}
                    />
                  </div>
              </div>

              <div className='flex flex-col gap-1'>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="tagline" className='text-lg font-semibold'>Tagline </label>
                    <input 
                      type="text" 
                      required
                      name='tagline'
                      id='tagline'
                      placeholder='Enter tagline'
                      className='bg-transparent px-2 py-1 border'
                      value={userDetails.tagline}
                      onChange={handleUserInput}
                    />
                  </div> 
                  <div className="flex flex-col gap-2 mt-2">
                    <label htmlFor="description" className='text-lg font-semibold'>Description</label>
                    <textarea 
                      type="" 
                      required
                      name='description'
                      id='description'
                      placeholder='Enter description'
                      className='bg-transparent px-2 py-1 border resize-none '
                      value={userDetails.description}
                      onChange={handleUserInput}
                      rows='6'
                    />
                  </div> 


              </div>
          </main>

          <button 
            type='submit' 
            className='w-full bg-yellow-600 hover:bg-yellow-300 transition-all ease-in-out duration-300 mt-4 py-2 rounded-sm font-semibold text-lg cursor-pointer'>
              Create Course
          </button>
      </form>
      </div>
    </BaseLayout>
  )
}

export default CreateClub
