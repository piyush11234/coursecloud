 import {createSlice} from "@reduxjs/toolkit"

 const lectureSlice = createSlice({
     name:"lecture",
     initialState:{
         lecture:[]
     },
     reducers:{
         //actions
         setLecture:(state, action) => {
             state.lecture = action.payload;
         }
     }
 });

 export const {setLecture} = lectureSlice.actions;
 export default lectureSlice.reducer;