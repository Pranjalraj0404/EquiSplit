import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Chip, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material'
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getEmailList } from '../../../services/auth';
import Loading from '../../loading';
import useResponsive from '../../../theme/hooks/useResponsive';
import { createGroupService } from '../../../services/groupServices';
import AlertBanner from '../../AlertBanner';
import configData from '../../../config.json'


export default function Creategroup() {
    const mdUp = useResponsive('up', 'md');
    const profile = JSON.parse(localStorage.getItem('profile'))
    const currentUser = profile?.emailId
    const [loading, setLoading] = useState(false);
    const [emailList, setEmailList] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
   
    //Formink schema 
    const groupSchema = Yup.object().shape({
        groupName: Yup.string().required('Group name is required'),
        groupDescription: Yup.string(),
        groupCurrency: Yup.string().required('Currency Type is required'),
        groupCategory: Yup.string().required('Category is required'),
    });

    const formik = useFormik({
        initialValues: {
            groupName: '',
            groupDescription: '',
            groupCurrency: '',
            groupCategory: '',
            groupMembers: [currentUser],
            groupOwner: currentUser
            
        },
        validationSchema: groupSchema,
        onSubmit: async () => {
            const create_response = await createGroupService(values, setAlert, setAlertMessage)
            window.location = configData.VIEW_GROUP_URL + create_response.data.Id
        },
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };


    

    useEffect(() => {
        const getEmails = async () => {
            setLoading(true)
            const response = await getEmailList()
            var list = response.data.user
            list.indexOf(currentUser) > -1 && list.splice(list.indexOf(currentUser), 1)
            setEmailList(list)
            setLoading(false)
        }
        getEmails()
        
        
    }, []);

    return (
        <Container>
            {loading ? <Loading /> :
                <>
                    <Typography variant="h4" pb={2} mb={3}>
                        Create New group
                    </Typography>
                    <AlertBanner showAlert={alert} alertMessage={alertMessage} severity = 'error' />
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3} sx={{ maxWidth: 800 }}>
                                <Grid item xs={12} >
                                    <TextField fullWidth
                                        type="text"
                                        name="groupName"
                                        id="outlined-basic"
                                        label="Group Name"
                                        variant="outlined"
                                        {...getFieldProps('groupName')}
                                        error={Boolean(touched.groupName && errors.groupName)}
                                        helperText={touched.groupName && errors.groupName}
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <TextField
                                        multiline
                                        rows={4}
                                        fullWidth
                                        name="groupDescription"
                                        id="outlined-basic"
                                        label="Group Description"
                                        variant="outlined"
                                        {...getFieldProps('groupDescription')}
                                        error={Boolean(touched.groupDescription && errors.groupDescription)}
                                        helperText={touched.groupDescription && errors.groupDescription}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        id="group-members"
                                        options={emailList}
                                        freeSolo
                                        value={values.groupMembers.filter(m => m !== currentUser)}
                                        onChange={(event, newValue) => {
                                            // Ensure currentUser is always part of the group
                                            if (!newValue.includes(currentUser)) {
                                                newValue.push(currentUser);
                                            }
                                            formik.setFieldValue('groupMembers', newValue);
                                        }}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Group Members"
                                                placeholder="Add members by email"
                                                helperText="You can add emails even if they are not registered."
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={6} >
                                    <FormControl fullWidth
                                        error={Boolean(touched.groupCurrency && errors.groupCurrency)}
                                    >
                                        <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                                        <Select
                                            name='groupCurrency'
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label="Currency"
                                            {...getFieldProps('groupCurrency')}
                                        >
                                            <MenuItem value={'INR'}>₹ INR</MenuItem>
                                            <MenuItem value={'USD'}>$ USD</MenuItem>
                                            <MenuItem value={'EUR'}>€ EUR</MenuItem>
                                        </Select>
                                        <FormHelperText>{touched.groupCurrency && errors.groupCurrency}</FormHelperText>

                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} >
                                    <FormControl fullWidth
                                        error={Boolean(touched.groupCategory && errors.groupCategory)}
                                    >
                                        <InputLabel id="group-category">Category</InputLabel>
                                        <Select
                                            name='groupCategory'
                                            labelId="group-category"
                                            id="demo-simple-select"
                                            label="Category"
                                            {...getFieldProps('groupCategory')}
                                        >
                                            <MenuItem value={'Home'}>Home</MenuItem>
                                            <MenuItem value={'Trip'}>Trip</MenuItem>
                                            <MenuItem value={'Office'}>Office</MenuItem>
                                            <MenuItem value={'Sports'}>Sports</MenuItem>
                                            <MenuItem value={'Others'}>Others</MenuItem>
                                        </Select>
                                        <FormHelperText>{touched.groupCategory && errors.groupCategory}</FormHelperText>

                                    </FormControl>
                                </Grid>

                                {mdUp && <Grid item xs={0} md={9}/> }
                                                  
                                <Grid item xs={6} md={3}>
                                    <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                                        Create Group
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </Form>
                    </FormikProvider>
                </>
            }
        </Container>
    )
}
