import { SearchOutlined } from '@ant-design/icons';
import { Box, Button, Grid, OutlinedInput } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import AnimateButton from 'components/@extended/AnimateButton';
import React from 'react';
import { MutatingDots } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from 'utils/axios';
import GTable from '../../components/table/table';

function Index() {
    const navigate = useNavigate();
    const { render } = useSelector((state) => state.menu);
    const token = localStorage.getItem('token');
    const [inputValues, setInputValues] = React.useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        company: ''
    });
    const [AllUsersData, setUserData] = React.useState(null);
    const [Search, setSearch] = React.useState({ search: '' });
    const [FilterArray, setFilterArray] = React.useState('');
    const [CustomError, setCustomError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const [dialog, setDialog] = React.useState({
        open: false,
        close: false
    });
    const columnName = ['Firstname', 'Lastname', 'Company', 'Email', 'Created At', 'Actions'];

    const onCreateUserHandler = async () => {
        try {
            if (!inputValues.firstname || !inputValues.lastname || !inputValues.email || !inputValues.password || !inputValues.company)
                return toast.error('Empty Input Fields', {
                    position: 'top-center',
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                    transition: Flip
                });

            setIsLoading(true);
            const result = await instance.post('/api/user/register', {
                firstname: inputValues.firstname,
                lastname: inputValues.lastname,
                email: inputValues.email,
                password: inputValues.password,
                company: inputValues.company
            });

            if (!result.data.data) {
                getAllUsers();
                setIsLoading(false);
                toast.error(result.data.message, {
                    position: 'top-center',
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored',
                    transition: Flip
                });
                return;
            }

            setInputValues({
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                company: ''
            });
            setCustomError('');
            getAllUsers();
            setIsLoading(false);
            toast.success('User Registered Successfully', {
                position: 'top-center',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Flip
            });
        } catch (error) {
            toast.error(error.response.data.error, {
                position: 'top-center',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Flip
            });
            setIsLoading(false);
        }
    };

    const getAllUsers = async () => {
        const usersData = await instance.get('/api/user');
        setUserData(usersData.data.data);
    };

    const handleClose = () => {
        setDialog({
            close: true
        });
    };

    const searchHandler = () => {
        if (!Search.search) {
            setCustomError('');
            return;
        }
        const pattern = new RegExp(Search.search, 'i');
        const filteredArray = AllUsersData.filter((item) => {
            return pattern.test(item.firstname) || pattern.test(item.lastname) || pattern.test(item.company) || pattern.test(item.email);
        });
        if (!filteredArray.length) return setCustomError('No results found');
        setFilterArray(filteredArray);
        setCustomError('');
    };

    React.useEffect(() => {
        getAllUsers();
        if (!token) return navigate('/');
    }, [render]);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ToastContainer
                        position="top-center"
                        autoClose={1000}
                        hideProgressBar={true}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                        transition={Flip}
                    />
                    {isLoading ? (
                        <Box sx={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <MutatingDots
                                height="100"
                                width="100"
                                color="#5cbc5c"
                                secondaryColor="#5cbc5c"
                                radius="12.5"
                                ariaLabel="mutating-dots-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                        <OutlinedInput
                                            type="text"
                                            value={Search.search}
                                            name="search"
                                            onChange={(e) => {
                                                setSearch({ ...Search, search: e.target.value });
                                            }}
                                            placeholder="Search..."
                                            fullWidth
                                        />
                                        <Button
                                            variant="contained"
                                            sx={{ float: 'right', margin: '2rem 0rem' }}
                                            onClick={() => searchHandler()}
                                        >
                                            <SearchOutlined style={{ marginRight: '3px' }} /> Search
                                        </Button>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        sx={{ float: 'right', margin: '2rem 0rem' }}
                                        onClick={() => setDialog({ open: true })}
                                    >
                                        Add User
                                    </Button>
                                </Box>
                                {CustomError ? (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '40vh',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {CustomError}
                                    </Box>
                                ) : FilterArray.length ? (
                                    <GTable columnName={columnName} rows={FilterArray} source={'user'} />
                                ) : AllUsersData?.length ? (
                                    <GTable columnName={columnName} rows={AllUsersData} source={'user'} />
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '40vh',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        No User Found
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </Grid>
            </Grid>

            {/* ------------Dialog-------------- */}

            <Dialog onClose={handleClose} open={dialog.open}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>Add New User</DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%' }}>
                        <OutlinedInput
                            type="text"
                            value={inputValues.firstname}
                            name="firstname"
                            onChange={(e) => {
                                setInputValues({ ...inputValues, [e.target.name]: e.target.value });
                            }}
                            placeholder="Firstname"
                            fullWidth
                        />
                        <OutlinedInput
                            type="text"
                            value={inputValues.lastname}
                            name="lastname"
                            onChange={(e) => {
                                setInputValues({ ...inputValues, [e.target.name]: e.target.value });
                            }}
                            placeholder="Lastname"
                            fullWidth
                        />
                        <OutlinedInput
                            type="email"
                            value={inputValues.email}
                            name="email"
                            onChange={(e) => {
                                setInputValues({ ...inputValues, [e.target.name]: e.target.value });
                            }}
                            placeholder="Email"
                            fullWidth
                        />
                        <OutlinedInput
                            type="text"
                            value={inputValues.password}
                            name="password"
                            onChange={(e) => {
                                setInputValues({ ...inputValues, [e.target.name]: e.target.value });
                            }}
                            placeholder="Password"
                            fullWidth
                        />
                        <OutlinedInput
                            type="text"
                            value={inputValues.company}
                            name="company"
                            onChange={(e) => {
                                setInputValues({ ...inputValues, [e.target.name]: e.target.value });
                            }}
                            placeholder="Company"
                            fullWidth
                        />
                        <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        onCreateUserHandler();
                                        setInputValues({
                                            firstname: '',
                                            lastname: '',
                                            email: '',
                                            password: '',
                                            company: ''
                                        });
                                        setDialog({ close: true });
                                    }}
                                >
                                    Create User
                                </Button>
                            </AnimateButton>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}

export default Index;
