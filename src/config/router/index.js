import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {
  Loading,
  GetStarted,
  RegisterOne,
  RegisterTwo,
  RegisterThree,
  CurryImagePicker,
  SignIn,
  Home,
  Profile,
  DetailMarker,
  Chat,
  ListChat,
} from '../../containers/pages';

const SignInStack = createStackNavigator(
  {
    Loading,
    GetStarted,
    RegisterOne,
    RegisterTwo,
    RegisterThree,
    CurryImagePicker,
    SignIn,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Loading',
  },
);

const HomeStack = createStackNavigator(
  {Home, Profile, DetailMarker, Chat, ListChat},
  {
    headerMode: 'none',
    initialRouteName: 'Home',
  },
);

const Router = createSwitchNavigator(
  {
    SignInStack,
    HomeStack,
  },
  {
    headerMode: 'none',
    initialRouteName: 'SignInStack',
  },
);

export default createAppContainer(Router);
