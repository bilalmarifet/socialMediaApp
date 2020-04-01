import React, { Component } from "react";
import { View, FlatList, ActivityIndicator,Button,Text} from "react-native";
import { NavigationScreenProp, NavigationState, SafeAreaView } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../../../components";
import styles from "./styles";
import { AvatarItem } from "../../../components";
import { logoutUserService } from "../../../redux/services/user";
import {Thumbnail,Icon} from 'native-base'
import {
  fetchImageData,
  fetchMoreImageData
} from "../../../redux/actions/fetch";
import { TouchableOpacity } from "react-native-gesture-handler";
import { showMessage } from "react-native-flash-message";
import { colors } from "../../../constants";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  fetchImageData: (page?: number, limit?: number) => void;
  fetchMoreImageData: (page?: number, limit?: number) => void;
  imageData: any;
  loading: boolean;
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
  change :boolean;
}

class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 1,
      limit: 20,
      change : false,
    };
  }

  componentDidMount() {
    const { fetchImageData } = this.props;
    const { page, limit } = this.state;
    fetchImageData(page, limit);
    // this.props.navigation.setParams({cart: 1});
  }

  handleLogout = () => {
    const { navigation } = this.props;
    logoutUserService().then(() => {
      navigation.navigate("AuthStack");
    });
  };

  static navigationOptions = ({navigation }) => {

   return {
    title: 'Ürünler',
    headerStyle: {
      height: 70
    },
  headerRight: 
  (navigation.state.params && navigation.state.params.cart ) ? <TouchableOpacity style={{borderWidth:1,borderRadius:5,padding:5,flexDirection:'row',marginRight:10}}><Icon name="cart"></Icon>
  
  <Text style={{alignSelf:'center',marginLeft:10}}>{navigation.state.params.cart} TL</Text>
   
  </TouchableOpacity> : null
   }
  };
  renderPlusButton(){
    showMessage({
      message: "Hello World",
      description: "This is our second message",
      type: "success",
    });
    if(this.state.change) {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <View >
        <View style={{borderWidth:1,flexDirection:'row'}}>
          <TouchableOpacity onPress={()=> {
             this.props.navigation.setParams({cart: cart - 100});
            this.setState({change : !this.state.change})}}><Icon name="minus" type="MaterialCommunityIcons" /></TouchableOpacity>
          <Text style={{alignSelf:'center'}}>{this.state.page}</Text>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.setParams({cart: cart + 100});
            this.setState({page:this.state.page + 1})}}><Icon name="plus" type="MaterialCommunityIcons" /></TouchableOpacity>
          </View> 
       </View>
      )
    }
    else {
      let cart = this.props.navigation.getParam('cart') ?? 0
      return (
        <TouchableOpacity onPress={()=> {
          this.props.navigation.setParams({cart: cart + 100});
          this.setState({change : !this.state.change})}}>
<Icon name="ios-add-circle" style={{color : colors.accent}}/>
       </TouchableOpacity>
      )
    }
  }

  render() {
    const { navigation, imageData, fetchMoreImageData, loading } = this.props;
    const { page, limit } = this.state;
    return (
      <View style={styles.container}>
       
      
        <FlatList
        contentContainerStyle={{paddingTop:20}}
          data={[1,2,2,2]}

          keyExtractor={item => item.id}
          renderItem={({ item }: itemProp) => {
            return (
             <View style={{marginHorizontal:10,borderWidth:1,padding:10,borderRadius:5,justifyContent:'space-between',flexDirection:'row',marginBottom:10}}>
               <Text style={{alignSelf:'center'}}>
                 Damacana Su
               </Text>

              {this.renderPlusButton()}
               </View>
            );
          }}
          
        />
      </View>
    );
  }
}

const mapStateToProps = (state: any) => ({
  imageData: state.data,
  loading: state.loading
});

function bindToAction(dispatch: any) {
  return {
    fetchImageData: (page?: number, limit?: number) =>
      dispatch(fetchImageData(page, limit)),
    fetchMoreImageData: (page?: number, limit?: number) =>
      dispatch(fetchMoreImageData(page, limit))
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(Home);
