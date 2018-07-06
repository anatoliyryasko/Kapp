/**
 ANDROID iOS Fonts Setup :: https://medium.com/react-native-training/react-native-custom-fonts-ccc9aacf9e5e
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 dynamic Image : source={{ uri: imagebaseURL+responseData.data[i].item_icon }}

 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    FlatList,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Image,
    Alert,
    ScrollView,
    ActivityIndicator,
    BackHandler,
    Keyboard,
    AsyncStorage,
    Share,
    Platform,
    NetInfo,
    Animated,
    Easing,
    Dimensions,
    WebView,
    TouchableOpacity,
    Linking,
    ViewPropTypes
} from 'react-native';
import EZSideMenu from 'react-native-ezsidemenu';
import Icon from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CardView from 'react-native-cardview'
import {BubblesLoader, TextLoader} from 'react-native-indicator';
let PushNotification = require('react-native-push-notification');

const DEVICE_SCREEN = Dimensions.get('window');

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

let basketball_logo = require('./images/basketball.png');
let football_logo = require('./images/football.png');
let tennis_logo = require('./images/tennis.png');
let volleyball_logo = require('./images/volleyball.png');

export default class homeScreen extends React.Component {

    static navigationOptions = {
        title: 'Home',
        header: null
    };


    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            animation: new Animated.Value(0),
            scroll: true,
            bettingdata:[],
            isDetail:false,
            detailIndex:[],
            isLoading:true
        }
        this._renderItemView = this._renderItemView.bind(this);
        this.contentView = this.contentView.bind(this);
        this.detail = this._detail.bind(this);
        this.toggle = this._toggle.bind(this)
    }

    _toggle(flag) {
        console.log("toggle");

        if (this.refs.menu) {
            if(flag)
                this.refs.menu.open();
            else
                this.refs.menu.close();
        }

    }

    _detail(index) {
        this.state.detailIndex[index] = 1 - this.state.detailIndex[index];
        this.setState({
            detailIndex:this.state.detailIndex,
        }, () => {
            console.log(this.state.detailIndex);
        });
    }

    _renderItemView({item, index}){
        const {code,time,date,comment,league,prediction,odd,status,team1,team1logo,team2,team2logo} = item;
        let color1 = 'red',color2 ='red';
        if (status === 'Win'){color1='red';color2='green';}
        else if (status === 'Lose'){color1='green';color2='red';}
        else if (status === 'Waiting'){color1='gray';color2='gray';}
        return (
            <CardView
                id={item.id}
                style={{ flex:10 ,margin:4}}
                cardElevation={2}
                cardMaxElevation={2}
                cornerRadius={5}>
                <View style={{ flex:2, backgroundColor:'white',padding:10}}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Image style={{padding:5,alignSelf:'center',justifyContent:'center',resizeMode:'contain',width:100, height:100}} source={team1logo!=''?{uri:team1logo}:{uri:'http://www.identdentistry.ca/identfiles/no_image_available.png'}}/>
                            <Text style={{flex:1,color:color1,textAlign:'center',fontSize:18}}>{team1}</Text>
                        </View>
                        <View style={{justifyContent:'space-between'}}>
                            <View style={{backgroundColor:color1,borderRadius:40, marginTop:-40,height:50}}/>
                            <TouchableOpacity onPress={() => this._detail(index)}>
                                <EvilIcons name={!this.state.detailIndex===index?'arrow-down':'arrow-up'} color="black" size={30} style={{}} />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1}}>
                            <Image style={{flex:1,padding:5,alignSelf:'center',justifyContent:'center',resizeMode:'contain',width:100, height:100}} source={team2logo!=''?{uri:team2logo}:{uri:'http://www.identdentistry.ca/identfiles/no_image_available.png'}}/>
                            <Text style={{color:color2,textAlign:'center',fontSize:18}}>{team2}</Text>
                        </View>
                    </View>
                    {this.state.detailIndex===index?
                        <View style={{ flex:1}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={{}}>{code}</Text>
                                <Text style={{}}>{date + '-' + time}</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Text style={{}} numberOfLines={0}>{comment}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{flex:1,marginTop:5}}>{league}</Text>
                                <Text style={{flex:1,textAlign:'center',marginTop:5}}>{prediction}</Text>
                                <Text style={{flex:1,textAlign:'center',marginTop:5}}>{odd}</Text>
                            </View>
                        </View>
                        :<View style={{flex:1}}/>}
                </View>
            </CardView>
        );
    }

    contentView() {
        return <View style={styles.container}>
            <View style={{ flexDirection: 'row', paddingTop: 5, backgroundColor: '#e2e2e2' }}>
                <TouchableOpacity
                    onPress={()=>this.toggle(true)}
                    style={styles.button}
                >
                    <Icon name='menu' color="black" size={30} style={{justifyContent:'center',alignSelf:'center'}} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}/>
                <Image
                    source={require(`./images/logo_text.png`)}
                    style={[styles.button,{marginRight:10,resizeMode:'contain'}]}
                />
            </View>
            <ScrollView>
                {this.state.bettingdata.map((item, index)=>{
                    const {code,time,date,comment,league,prediction,odd,status,sports_name,team1,team1logo,team2,team2logo} = item;

                    let sports_image = basketball_logo;
                    if (sports_name === 'basketball')sports_image = basketball_logo;
                    else if (sports_name === 'football')sports_image = football_logo;
                    else if (sports_name === 'volleyball')sports_image = volleyball_logo;
                    else if (sports_name === 'tennis')sports_image = tennis_logo;

                    let color1 = 'red',color2 ='red';
                    if (status === 'Win'){color1='red';color2='green';}
                    else if (status === 'Lose'){color1='green';color2='red';}
                    else if (status === 'Waiting'){color1='gray';color2='gray';}

                    return (
                        <CardView
                            key={index}
                            id={item.id}
                            style={{ flex:10 ,margin:4}}
                            cardElevation={2}
                            cardMaxElevation={2}
                            cornerRadius={5}>
                            <TouchableOpacity onPress={() => this._detail(index)}>
                                <View style={{flex:1, backgroundColor:'white'}}>
                                    <View style={{position:'absolute', top:0,bottom:0,left:0,right:0,flex:1,flexDirection:'row',opacity: 0.3}}>
                                        <Image style = {this.state.detailIndex[index]===1?{flex:1,backgroundColor:'rgba(255,0,0,0)',alignSelf:'center',justifyContent:'center',resizeMode : 'contain', width:'100%', height:'100%'}:
                                            {flex:1,backgroundColor:'rgba(255,0,0,0)',alignSelf:'center',justifyContent:'center',resizeMode : 'contain', width:'50%', height:'50%'}}
                                               source = {sports_image} />
                                    </View>
                                    <View style={{ flex:2,padding:10}}>
                                        <View style={{flex:1,flexDirection:'row'}}>
                                            <View style={{flex:1}}>
                                                <Image style={{borderRadius:50,padding:5,alignSelf:'center',justifyContent:'center',resizeMode:'contain',width:100, height:100}} source={team1logo!=''?{uri:team1logo}:{uri:'http://www.identdentistry.ca/identfiles/no_image_available.png'}}/>
                                                <Text style={{flex:1,color:'black',textAlign:'center',fontSize:18}}>{team1}</Text>
                                            </View>
                                            <View style={{justifyContent:'space-between'}}>
                                                <View style={{backgroundColor:color1,borderRadius:40, marginTop:-40,height:50}}/>
                                                <TouchableOpacity onPress={() => this._detail(index)}>
                                                    <EvilIcons name={this.state.detailIndex[index] != 1 ?'arrow-down':'arrow-up'} color="black" size={30} style={{}} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{flex:1}}>
                                                <Image style={{borderRadius:50,flex:1,padding:5,alignSelf:'center',justifyContent:'center',resizeMode:'contain',width:100, height:100}} source={team2logo!=''?{uri:team2logo}:{uri:'http://www.identdentistry.ca/identfiles/no_image_available.png'}}/>
                                                <Text style={{color:'black',textAlign:'center',fontSize:18}}>{team2}</Text>
                                            </View>
                                        </View>
                                        {this.state.detailIndex[index]===1?
                                            <View style={{ flex:1}}>
                                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                    <Text style={{}}>{code}</Text>
                                                    <Text style={{}}>{date + '-' + time}</Text>
                                                </View>
                                                <View style={{flex:1}}>
                                                    <Text style={{}} numberOfLines={0}>{comment}</Text>
                                                </View>
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={{flex:1,marginTop:5}}>{league}</Text>
                                                    <Text style={{flex:1,textAlign:'center',marginTop:5}}>{prediction}</Text>
                                                    <Text style={{flex:1,textAlign:'center',marginTop:5}}>{odd}</Text>
                                                </View>
                                            </View>
                                            :<View style={{flex:1}}/>}
                                    </View>

                                </View>

                            </TouchableOpacity>
                        </CardView>
                    );
                })}
            </ScrollView>
        </View>
    }

    openURL = (url) => {
        this._toggle(false);
        Linking.openURL(url);
    }

    transList = (flag) => {
        this._toggle(false);
        if (!flag)this.getBetting(false);
        else this.getBetting(true);
    }

    menu(opacity) {
        const menu = (
            <Animated.View style={{ flex: 1, backgroundColor: 'transparent', opacity }}>
                <View style={{flexDirection:'row', paddingLeft:10, marginTop:20,width:'100%', height:40}}>
                    <TouchableOpacity onPress={() => this.transList(true)}>
                        <Image source={require('./images/tr_trans_icon.png')} style={{flex: 1,resizeMode:'contain',justifyContent:'center',alignItems:'center',flexDirection: "column"}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.transList(false)}>
                        <Image source={require('./images/en_trans_icon.png')} style={{flex: 1,resizeMode:'contain',justifyContent:'center',alignItems:'center',flexDirection: "column"}}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.openURL('https://www.facebook.com/pg/Kapp-1936094560054282/posts')}>
                    <View style={{flexDirection:'row', paddingLeft:10, marginTop:20}}>
                        <Icon name='facebook-with-circle' color="black" size={20} style={{justifyContent:'center',alignSelf:'center'}} />
                        <Text style={{color:'black',fontSize:25, marginLeft:10,justifyContent:'center',alignSelf:'center'}}>Facebook</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openURL('https://www.instagram.com/kappiletisim/')}>
                    <View style={{flexDirection:'row', paddingLeft:10, marginTop:20}}>
                        <Icon name='instagram-with-circle' color="black" size={20} style={{justifyContent:'center',alignSelf:'center'}} />
                        <Text style={{color:'black',fontSize:25, marginLeft:10,justifyContent:'center',alignSelf:'center'}}>Instagram</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openURL('https://twitter.com/TheKapptan')}>
                    <View style={{flexDirection:'row', paddingLeft:10, marginTop:20}}>
                        <Icon name='twitter-with-circle' color="black" size={20} style={{justifyContent:'center',alignSelf:'center'}} />
                        <Text style={{color:'black',fontSize:25, marginLeft:10,justifyContent:'center',alignSelf:'center'}}>Twitter</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openURL('mailto:kappiletisim@gmail.com')}>
                    <View style={{flexDirection:'row', paddingLeft:10, marginTop:20}}>
                        <MaterialCommunityIcons name='gmail' color="black" size={20} style={{justifyContent:'center',alignSelf:'center'}} />
                        <Text style={{color:'black',fontSize:25, marginLeft:10,justifyContent:'center',alignSelf:'center'}}>Gmail</Text>
                    </View>
                </TouchableOpacity>

            </Animated.View>
        );
        return menu
    }

    simpleMenu() {
        return <EZSideMenu
            menu={this.menu()}
            ref="menu">
            {!this.state.isLoading?this.contentView():
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <BubblesLoader color={'#1e90ff'}/>
                </View>}
        </EZSideMenu>
    }

    advancedMenu() {
        const menuWidth = DEVICE_SCREEN.width * 0.5;
        const opacity = this.state.animation.interpolate({
            inputRange: [0, menuWidth],
            outputRange: [0, 1],
        });
        return <EZSideMenu
            onMenuStateChaned={(isOpen) => { this.setState({ isOpen }) }}
            onPanMove={(x) => { console.log('onPanMove ' + x) }}
            onSliding={(x, persent) => { console.log('onSliding x ' + x + ' persent ' + persent) }}
            onPanStartMove={() => { this.setState({ scroll: false }) }}//adapt android
            onPanEndMove={() => { this.setState({ scroll: true }) }}//adapt android
            type={EZSideMenu.type.Default}
            menuStyle={styles.container}
            shadowStyle={{ backgroundColor: 'rgba(20,20,20,.7)' }}
            direction={EZSideMenu.direction.Left}
            ref="menu"
            position={this.state.animation}
            width={menuWidth}
            menu={this.menu(opacity)}
            panWidthFromEdge={100}
            animationFunction={(prop, value) => Animated.spring(prop, {
                friction: 10,
                toValue: value
            })}>
            {!this.state.isLoading?this.contentView():
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <BubblesLoader color={'#1e90ff'}/>
                </View>}
        </EZSideMenu>
    }

    getBetting(flag){
        let param = 'getbetting';
        if (flag)param = 'getbetting';
        else param = 'getbettingeng'
        fetch('http://kapp.website/betting/index.php?mode=' + param, {
            //fetch('http://facebook.github.io/react-native/movies.json', {
            method: 'get',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                //console.log(JSON.stringify(responseJson));
                let arrayVal = [];
                for (var i = 0 ; i < responseJson.length ;i++){
                    arrayVal.push(0);
                }
                this.setState({
                    bettingdata:responseJson,
                    isLoading:false,
                    detailIndex:arrayVal
                });
                console.log(this.state.bettingdata)
            })
            .catch((error) => {
                console.error(error);
            });

    }

    componentWillMount(){
        this.getBetting(true);
    }



    componentDidMount() {
        var self = this;
        setInterval( () => {
            fetch('http://kapp.website/betting/index.php?mode=getnotification', {
                //fetch('http://facebook.github.io/react-native/movies.json', {
                method: 'get',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then((response) => response.json())
                .then((responseJson) => {
                    console.log(JSON.stringify(responseJson));
                    if(responseJson.length > 0){
                        for (let i = 0 ; i < responseJson.length ; i++){
                            const {id,title,text} = responseJson[i];
                            console.log(title);
                            PushNotification.localNotification({
                                /* iOS and Android properties */
                                title: title, // (optional)
                                message: text, // (required)
                                largeIcon: 'app_images_logo', // (optional) default: "ic_launcher"
                                smallIcon: "app_images_logo", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            //console.log(result);
        }, 1500);

        BackHandler.addEventListener("hardwareBackPress", () => { Alert.alert(
            'Exit App',
            'Are you sure you want to exit app ?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => BackHandler.exitApp() },
            ],
            {
                cancelable: false
            }
        )
            return true;
        });
    }

    render() {
        return this.simpleMenu()
        //return this.advancedMenu()
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    button: {
        width: 44,
        height: 44,
        justifyContent:'center',
        alignSelf:'center'
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});