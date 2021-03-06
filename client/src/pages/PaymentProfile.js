import React, { useState, useEffect } from 'react';
// import { useCookies } from 'react-cookie';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import { Icon } from '@iconify/react';
import { Grid, Container, Typography, Card, Avatar, Stack, Button,Alert, } from '@mui/material';
import { useSelector } from "react-redux";




import Page from '../components/Page';



const axios = require('axios');


export default function PaymentProfile() {
    const data = useSelector((state) => state.profileReducer);
    const [servData, setServData] = useState('');
    const [QR, setQR] = useState('');
    const [error, setError] = useState(false);
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    const fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result)
        };
        reader.readAsDataURL(file);
    })
    const fileChangeHandler = (file) => {
        if (!file) {
            setImage('');
            return;
        }

        fileToDataUri(file)
            .then(dataUri => {
                setImage(dataUri)
            })

        console.log('image:', image);
    }

    const onSave = () => {
        if(image)
        {
            setError(false);
        axios.post('http://localhost:5000/users/uploadQR', { 'id': data.id, 'qr': image })
            .then((res) => {

                setQR('');
            })
            .catch((err) => {
                console.log("Error: ", err);
            })
        }
        else
        {
            setError(true);
        }
    }

    useEffect(() => {

        axios.post('http://localhost:5000/users/getPaymentDetails', { 'id': data.id })
            .then((res) => {

                let bufferOriginal = null;
                if (res.data[0]) {

                    bufferOriginal = Buffer.from(res.data[0]);
                    setQR(bufferOriginal.toString('utf8'));


                }

                setServData(res.data[1]);
            })
            .catch((err) => {
                console.log("Error", err);
            })
    }, [data.id, QR])
    return (
        <Page title="Payment Profile">
            <Container maxWidth="xl">

                <Grid container spacing={3} >
                    <Grid item xs={12} sm={12} md={12} align='center'>
                        <Stack spacing={3}>
                            <Typography variant="h4">Bharat QR - GPay, PhonePe, Paytm, UPI</Typography>
                            {/* <Avatar sx={{ width: 200, height: 200, alignSelf: 'center' }} alt="photoURL" variant="square" /> */}

                            {
                                QR ?
                                    <Avatar src={QR} sx={{ width: 200, height: 200, alignSelf: 'center' }} alt="photoURL" variant="square" />
                                    :
                                    <Avatar sx={{ width: 200, height: 200, alignSelf: 'center' }} alt="photoURL" variant="square" />
                            }
                            {
                                data.user_type === 'O' &&
                                (<Stack alignItems='center'>
                                    <Typography variant="subtitle">
                                        Upload a new QR code
                                    </Typography>

                                    <input
                                        accept="image/*"
                                        id="input-qr"
                                        type="file"
                                        // style={{display: 'none'}}
                                        onChange={(event) => { fileChangeHandler(event.target.files[0] || null) }}
                                    />
                                </Stack>)
                            }




                            <Typography variant="h6">Mobile number: {servData}</Typography>

                            {/* <Stack direction="row" alignItems='center'>
                            <Typography variant="h6">Take picture of the receipt</Typography>
                            <input accept='image/*' id='icon-button-file' type='file' capture='environment'/>
                            </Stack> */}
                            {
                                data.user_type === 'O' &&
                                <Button
                                    sx={{ width: "50%", alignSelf: "center" }}

                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={onSave}>
                                    Save
                                </Button>
                            }
                            {
                                error &&
                                <Alert severity="error">Please choose a QR to upload first!</Alert>
                            }
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}