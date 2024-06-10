import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosInstance"

const initialState = {
    companyData : []
}

export const getAllCompanies = createAsyncThunk('/company/get', async () => {
    try {
        const response = axiosInstance.get('/company')
        // console.log('hhh',(await response).data.company);
        toast.promise(response, {
            success: 'Company loaded successfully !',
            loading: 'Loading company data',
            error: 'Error in loading companies'
        })

        return (await response).data.company
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

const companySlice = createSlice({
    name:'company',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(getAllCompanies.fulfilled, (state, action) => {
            if(action.payload){
                state.companyData = [...action.payload]
            }
            // console.log('state',state.companyData);
        })
    }
})

export default companySlice.reducer