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
        title: '',
        body: ''
    });
    const [dialog, setDialog] = React.useState({
        open: false,
        close: false
    });
    const [Search, setSearch] = React.useState({ search: '' });
    const [FilterArray, setFilterArray] = React.useState('');
    const [CustomError, setCustomError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [FaqData, setFaqData] = React.useState(null);
    const columnName = ['Title', 'Description', 'Created At', 'Actions'];

    const onAddFaqHandler = async () => {
        try {
            if (!inputValues.title || !inputValues.body) {
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
            }
            setIsLoading(true);
            const result = await instance.post('/api/admin/faqs', {
                title: inputValues.title,
                body: inputValues.body
            });

            if (!result.data.data) {
                getAllFaqs();
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
                title: '',
                body: ''
            });
            setCustomError('');
            getAllFaqs();
            setIsLoading(false);
            toast.success('Faq Added Successfully', {
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

    const getAllFaqs = async () => {
        const faqData = await instance.get('/api/admin/faqs');
        setFaqData(faqData.data.data);
    };

    const searchHandler = () => {
        if (!Search.search) {
            setCustomError('');
            return;
        }
        const pattern = new RegExp(Search.search, 'i');
        const filteredArray = FaqData.filter((item) => {
            return pattern.test(item.title) || pattern.test(item.body);
        });
        if (!filteredArray.length) return setCustomError('No results found');
        setFilterArray(filteredArray);
        setCustomError('');
    };

    const handleClose = () => {
        setDialog({
            close: true
        });
    };

    React.useEffect(() => {
        getAllFaqs();
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
                                    Add FAQ
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
                                <GTable columnName={columnName} rows={FilterArray} source={'faq'} />
                            ) : FaqData?.length ? (
                                <GTable columnName={columnName} rows={FaqData} source={'faq'} />
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
                                    No Faq Found
                                </Box>
                            )}
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* ------------Dialog-------------- */}

            <Dialog onClose={handleClose} open={dialog.open}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>Add FAQ</DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%' }}>
                        <OutlinedInput
                            type="text"
                            value={inputValues.title}
                            name="title"
                            onChange={(e) => {
                                setInputValues({ ...inputValues, [e.target.name]: e.target.value });
                            }}
                            placeholder="Title"
                            fullWidth
                        />
                        <OutlinedInput
                            type="text"
                            value={inputValues.body}
                            name="body"
                            multiline
                            rows={3}
                            onChange={(e) => {
                                setInputValues({ ...inputValues, [e.target.name]: e.target.value });
                            }}
                            placeholder="Description"
                            fullWidth
                        />

                        <Box sx={{ marginTop: '2rem' }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        onAddFaqHandler();
                                        setInputValues({ title: '', body: '' });
                                        setDialog({ close: true });
                                    }}
                                >
                                    Create Faq
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
