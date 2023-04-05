import { COLORS } from "./theme";

const  truckStatus = {
    IN_TRANSIT:{
        id:0,
        status:"In Transit",
        des:"Arrive cargo terminal",
        color: COLORS.gray
    },
    ARRAIVED_TERMINAL:{
        id:1,
        status:"Arrived Terminal",
        des:"Arrive cargo terminal",
        color:COLORS.yellow
    },
    UN_LOADING:{
        id:2,
        status:"Unloading",
        des:"Start Unloading",
        color:COLORS.blue
    },
    COMPLETED:{
        id:3,
        status:"Completed",
        des:"Complete",
        color:COLORS.green
    }
}
export default truckStatus;