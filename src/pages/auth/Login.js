import React, { Component } from 'react';
import { Text, View, TextInput, TouchableOpacity, AsyncStorage, ActivityIndicator, Keyboard } from 'react-native';

import axios from 'axios';
import qs from 'qs';
import styles from './style';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone_no: '',
            password: '',
            loading: false,
            message: ''
        }
    }

    showError = (msg) => {
        this.setState({
            message: msg, loading: false
        });
    }

    login = async () => {
        if (this.state.loading) return;
        Keyboard.dismiss()
        const { phone_no, password } = this.state;
        this.setState({ loading: true });

        if (phone_no === '' || password === '') {
            this.showError('Textfields cannot be blank!');
        } else {
            // Send data to server
            axios.post('http://francescogorini.com:1234/login', qs.stringify({
                phone_no: phone_no,
                password: password
            }), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }).then((response) => {
                // No error code thrown. Save JWT
                AsyncStorage.setItem('JWT', response.data.token)
                    .then(() => {
                        this.setState({ loading: false });
                        return this.props.navigation.navigate('Home');
                    });

            }, (error) => {
                console.log(error);
                this.showError(error.response.data);
            });
        }
    }

    render() {
        return (
            <View style={styles.wrapper}>
                <View style={styles.logoView}>
                    <Text style={styles.title}>FoxTrot</Text>
                    <Text style={styles.subTitle}>secure communications</Text>
                </View>
                <View style={styles.container}>
                    {this.state.message ? <Text style={styles.errorMsg}>{this.state.message}</Text> : null}
                    <TextInput placeholder="Phone no."
                        onChangeText={TextInputValue =>
                            this.setState({ phone_no: TextInputValue })}
                        underlineColorAndroid='transparent'
                        style={styles.input}
                    />
                    <TextInput placeholder="Password"
                        onChangeText={TextInputValue =>
                            this.setState({ password: TextInputValue })}
                        underlineColorAndroid='transparent'
                        secureTextEntry={true}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.button} onPress={() => this.login()}>
                        {this.state.loading
                            ? <ActivityIndicator />
                            : <Text style={styles.buttonText}>Login</Text>
                        }
                    </TouchableOpacity>

                    <Text style={styles.subTitle}>Or</Text>
                    <TouchableOpacity style={[styles.button, styles.buttonCyan]}
                        onPress={() => this.props.navigation.navigate('Signup')}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

