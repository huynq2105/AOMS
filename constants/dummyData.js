import icons from "./icons";
import images from "./images";
import { COLORS } from "./theme";
const featuresHomeData = [
    {
      id: 101,
      icon: icons.flightLanded,
      color: COLORS.yellow,
      description: 'Inbound',
      bgColor:['#ffc465', '#ff9c5f'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'InboundNavigator',
      srceenNavigagor: 'InboundNav',
    },
    {
      id: 102,
      icon: icons.flightDepart,
      color: COLORS.purple,
      description: 'Outbound',
      bgColor:['#fcaba8', '#fe6bba'],
      backgroundColor: COLORS.lightpurple,
      screenName: 'OutboundNavigator',
      srceenNavigagor: 'OutboundNav',
    },
  
    {
      id: 103,
      icon: icons.awb,
      color: COLORS.yellow,
      description: 'AWB details',
      bgColor:['#7cf1fb', '#4ebefd'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'InvoiceScreen',
      srceenNavigagor: 'Invoice',
    },
  
  ];

const featuresExpData = [
    {
      id: 201,
      icon: icons.awb_factory_pickup,
      color: COLORS.yellow,
      description: 'Factory Pickup',
      bgColor:['#ffc465', '#ff9c5f'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'FactoryPickupScreen',
      srceenNavigagor: 'FactoryPickup',
    },
    {
      id: 202,
      icon: icons.unloading,
      color: COLORS.purple,
      description: 'ALSX Unloading',
      bgColor:['#fcaba8', '#fe6bba'],
      backgroundColor: COLORS.lightpurple,
      screenName: 'AlsxUnloadingScreen',
      srceenNavigagor: 'AlsxUnloading',
    },
  
    {
      id: 203,
      icon: icons.TruckSeal,
      color: COLORS.yellow,
      description: 'Truck Seal',
      bgColor:['#7cf1fb', '#4ebefd'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'TruckSealScreen',
      srceenNavigagor: 'TruckSeal',
    },
    {
        id: 204,
        icon: icons.moveShipment,
        color: COLORS.yellow,
        description: 'Move Shipment',
        bgColor:['#7cf1fb', '#4ebefd'],
        backgroundColor: COLORS.lightyellow,
        screenName: 'InvoiceScreen',
        srceenNavigagor: 'Invoice',
      },
      {
        id: 205,
        icon: icons.truckTransit,
        color: COLORS.yellow,
        description: 'Truck Transit',
        bgColor:['#7cf1fb', '#4ebefd'],
        backgroundColor: COLORS.lightyellow,
        screenName: 'TruckTransitScreen',
        srceenNavigagor: 'TruckTransit',
      },
      {
        id: 206,
        icon: icons.awb_truck_location,
        color: COLORS.yellow,
        description: 'NBA Unloading',
        bgColor:['#7cf1fb', '#4ebefd'],
        backgroundColor: COLORS.lightyellow,
        screenName: 'NBAUnloadingScreen',
        srceenNavigagor: 'NBAUnloading',
      },
  ];
  const featuresImpData = [
    {
      id: 301,
      icon: icons.awb,
      color: COLORS.yellow,
      description: 'Pickup Awb',
      bgColor:['#ffc465', '#ff9c5f'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'PickupAwbScreen',
      srceenNavigagor: 'PickupAwb',
    },
    {
      id: 302,
      icon: icons.truckLoading,
      color: COLORS.purple,
      description: 'Truck Loading',
      bgColor:['#fcaba8', '#fe6bba'],
      backgroundColor: COLORS.lightpurple,
      screenName: 'TruckLoadingScreen',
      srceenNavigagor: 'TruckLoading',
    },
  
    {
      id: 303,
      icon: icons.unloading,
      color: COLORS.yellow,
      description: 'Truck Unloading',
      bgColor:['#7cf1fb', '#4ebefd'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'TruckUnloadingScreen',
      srceenNavigagor: 'TruckUnloading',
    },
  ]
  const irrData = [
    {
      id: 1,
      name: 'irrMsca',
      check:false,
      des:'Thiếu hàng/ MSCA'
    },
    {
      id: 2,
      name: 'irrCrushed',
      check:false,
      des:'Bẹp/ Crushed'
    },
    {
      id: 3,
      name: 'irrTorn',
      check:false,
      des:'Rách/ Torn'
    },
    {
      id: 4,
      name: 'irrBroken',
      check:false,
      des:'Vỡ/ Broken'
    },
    {
      id: 5,
      name: 'irrWithoutLabel',
      check:false,
      des:'Thiếu/ Không có nhãn'
    },
    {
      id: 6,
      name: 'irrMissSeal',
      check:false,
      des:'Rách/ Mất niêm phong'
    },
    {
      id: 7,
      name: 'irrFdca',
      check:false,
      des:'Thừa hàng/ FDCA'
    },
    {
      id: 8,
      name: 'irrHoled',
      check:false,
      des:'Thủng/ Holed'
    },
    {
      id: 9,
      name: 'irrWet',
      check:false,
      des:'Ướt/ Wet'
    },
    {
      id: 10,
      name: 'irrOpen',
      check:false,
      des:'Mở/ Open'
    },
    {
      id: 11,
      name: 'irrMissStrap',
      check:false,
      des:'Mất/ Đứt dây đai'
    },
    {
      id: 12,
      name: 'irrOther',
      check:false,
      des:'Lý do khác/ Other'
    },
  ]
  export default {
    featuresHomeData,
    featuresExpData,
    featuresImpData,
    irrData
  };
  