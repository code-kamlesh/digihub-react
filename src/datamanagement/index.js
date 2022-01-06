import beneficiayReducer from './beneficiaryReducer.js'
import {combineReducers} from 'redux'

const allReducers = combineReducers({
    beneficiay:beneficiayReducer
});

export default allReducers;