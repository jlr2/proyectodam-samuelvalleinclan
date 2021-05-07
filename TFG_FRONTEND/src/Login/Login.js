import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import './Login.css';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from './components/Title';
import Input from './components/Input';
import Item from './components/Item';
import Button from '../commons/RegularButton';
import ModalError from '../commons/ModalError';
import { makeStyles } from '@material-ui/core/styles';
import UsuarioDataService from "../Services/usuario.service";
import firebase from 'firebase';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: 2,
        color: '#fff',
    },
}));

let localstorageData = localStorage.getItem('account')

let lsd = JSON.parse(localstorageData)

const Login = () => {

    const classes = useStyles();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);

    const open = true;

    const [errors, setErrors] = useState({
        usernameError: false,
        passwordError: false
    })

    function handleChange(name, value) {
        switch (name) {
            case 'username':
                setErrors({ usernameError: false, passwordError: false });
                setHasErrors(false);
                setUsername(value);
                break;
            case 'password':
                setErrors({ usernameError: false, passwordError: false });
                setHasErrors(false);
                setPassword(value);
                break;
            default:
                console.log('no hay valores')
        }
    }

    function buscarUsuario() {
        var data = {
            usuario: username,
            contraseña: password
        };

        UsuarioDataService.findByUsuario(data)
            .then(response => {
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function showErrors() {
        setHasErrors(true);
        setErrors({ usernameError: true, passwordError: true })
    }

    function stopIsLoading() {
        setIsLoading(false);
        showErrors();
    }

    function ifMatch(user, pass) {
        if (user === "samuel@globalmail.com" && pass === "sam" ||
            user === lsd.username &&
            pass === lsd.password) {
            let ac = { user, pass, firstName: 'Samuel' }
            let account = JSON.stringify(ac)
            localStorage.setItem('account', account)
            setTimeout(() => setIsLogin(true), 2000)
        } else {
            setTimeout(() => stopIsLoading(), 2000)
        }
    }

    function handleOnClick() {
        buscarUsuario();
        setIsLoading(true);
        let login = { username, password }
        if (login) {
            ifMatch(username, password)
        }
    }

    function handleOnClickGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()

        const logeado = () => {
            window.location.href = "/bandejaEntrada"
        }

        firebase.auth().signInWithPopup(provider)
            .then(logeado)
            .catch(error => console.error(`Error: ${error.code}: ${error.message}`))
    }



    function clearErrorModal() {
        setHasErrors(false);
        setErrors({ usernameError: false, passwordError: false })
    }

    let params =
        errors.usernameError === false &&
        errors.passwordError === false
        ;

    return (
        <>

            { isLogin && <Redirect to='/bandejaEntrada' />}

            <div className='LoginContainer'>
                <div className='LoginContent'>
                    <div className='Login'>
                        <div className='LoginHigher' />
                        <div className='LoginLower'>
                            <Title text='¡Bienvenido a Global-Mail!' />

                            {hasErrors &&
                                <ModalError
                                    title='¡A ocurrido un error!'
                                    text="Lo siento, el usuario o contraseña son incorrectos."
                                    handleOnClick={clearErrorModal}
                                />
                            }

                            <div className='ItemUserLogin'>
                                <Item text='Correo' />
                                <Input
                                    attribute={{
                                        name: 'username',
                                        inputType: 'text',
                                        ph: ''
                                    }}
                                    handleChange={handleChange}
                                    param={errors.usernameError}
                                />
                            </div>
                            <div className='ItemPasswordLogin'>
                                <Item text='Contraseña' />
                                <Input
                                    attribute={{
                                        name: 'password',
                                        inputType: 'password',
                                        ph: ''
                                    }}
                                    handleChange={handleChange}
                                    param={errors.passwordError}
                                />
                            </div>

                            <Button
                                text='Log In'
                                handleOnClick={handleOnClick}
                                param={params}
                            />

                            <Button
                                text='Log In With Google'
                                handleOnClick={handleOnClickGoogle}
                                param={params}
                            />

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Link
                                    to='/recuperarContraseña'
                                    style={{ color: '#734488' }}
                                >
                                    <Item
                                        text='¿Perdiste tu contraseña?' />
                                </Link>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Link
                                    to='/createUser'
                                    style={{ color: '#734488' }}
                                >
                                    <Item
                                        text='¿No tienes cuenta? Regístrate' />
                                </Link>
                            </div>

                            {isLoading &&
                                <Backdrop open={open} className={classes.backdrop}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Login;