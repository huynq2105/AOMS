import icons from "./icons";
import { COLORS } from "./theme";
const featuresHomeData = [
    {
      id: 101,
      icon: icons.awb,
      color: COLORS.yellow,
      description: 'Inbound',
      bgColor:['#ffc465', '#ff9c5f'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'FactoryPickupScreen',
      srceenNavigagor: 'FactoryPickup',
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
      icon: icons.bill,
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
      icon: icons.awb,
      color: COLORS.yellow,
      description: 'Factory Pickup',
      bgColor:['#ffc465', '#ff9c5f'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'FactoryPickupScreen',
      srceenNavigagor: 'FactoryPickup',
    },
    {
      id: 202,
      icon: icons.flightDepart,
      color: COLORS.purple,
      description: 'ALSX Unloading',
      bgColor:['#fcaba8', '#fe6bba'],
      backgroundColor: COLORS.lightpurple,
      screenName: 'AlsxUnloadingScreen',
      srceenNavigagor: 'AlsxUnloading',
    },
  
    {
      id: 203,
      icon: icons.bill,
      color: COLORS.yellow,
      description: 'Weight Scaling',
      bgColor:['#7cf1fb', '#4ebefd'],
      backgroundColor: COLORS.lightyellow,
      screenName: 'InvoiceScreen',
      srceenNavigagor: 'Invoice',
    },
    {
        id: 204,
        icon: icons.bill,
        color: COLORS.yellow,
        description: 'Move Shipment',
        bgColor:['#7cf1fb', '#4ebefd'],
        backgroundColor: COLORS.lightyellow,
        screenName: 'InvoiceScreen',
        srceenNavigagor: 'Invoice',
      },
      {
        id: 205,
        icon: icons.bill,
        color: COLORS.yellow,
        description: 'Truck Transit',
        bgColor:['#7cf1fb', '#4ebefd'],
        backgroundColor: COLORS.lightyellow,
        screenName: 'TruckTransitScreen',
        srceenNavigagor: 'TruckTransit',
      },
      {
        id: 206,
        icon: icons.bill,
        color: COLORS.yellow,
        description: 'NBA Unloading',
        bgColor:['#7cf1fb', '#4ebefd'],
        backgroundColor: COLORS.lightyellow,
        screenName: 'NBAUnloadingScreen',
        srceenNavigagor: 'NBAUnloading',
      },
  ];
  export default {
    featuresHomeData,
    featuresExpData,
  };
  