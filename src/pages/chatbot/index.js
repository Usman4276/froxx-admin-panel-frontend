import { Box, Button, Grid, OutlinedInput } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import AnimateButton from 'components/@extended/AnimateButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import instance from 'utils/axios';
import GTable from '../../components/table/table';
import { MutatingDots } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Index() {
    const navigate = useNavigate();
    const { render } = useSelector((state) => state.menu);
    const token = localStorage.getItem('token');
    const [isLoading, setIsLoading] = React.useState(false);

    const [Input, setInput] = React.useState({
        question: ''
    });
    const columnName = ['All Nodes', 'Actions'];
    const [dialog, setDialog] = React.useState({
        open: false,
        close: false
    });
    const [AllChildsData, setChildsData] = React.useState(null);

    const handleClose = () => {
        setDialog({
            close: true
        });
    };

    const onAddDefaultQuestionHandler = async () => {
        try {
            const result = await instance.post('/api/admin/chatbot/add', {
                parent: Input.question,
                isDefault: true
            });
            setIsLoading(true);
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

            setInput({
                question: ''
            });
            getAllChilds();
            setIsLoading(false);
            toast.success('Default Parent Added Successfully', {
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

    const getAllChilds = async () => {
        const result = await instance.get('/api/admin/chatbot/childs');

        setChildsData(result.data.data);
    };

    React.useEffect(() => {
        getAllChilds();
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
                            <Box sx={{ width: '100%' }}>
                                <Button
                                    variant="outlined"
                                    sx={{ float: 'right', margin: '2rem 0rem' }}
                                    onClick={() => setDialog({ open: true })}
                                >
                                    Add Default Parent
                                </Button>
                            </Box>
                            {AllChildsData?.length ? (
                                <GTable columnName={columnName} rows={AllChildsData} source={'chatbot'} />
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
                                    No Childs Found
                                </Box>
                            )}
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* ------------Dialog-------------- */}

            <Dialog onClose={handleClose} open={dialog.open}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>Add Default Parent</DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', width: '80%' }}>
                        <OutlinedInput
                            type="text"
                            value={Input.question}
                            name="question"
                            onChange={(e) => {
                                setInput({ ...Input, [e.target.name]: e.target.value });
                            }}
                            placeholder="Default Parent"
                        />

                        <Box sx={{ marginTop: '1rem' }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        onAddDefaultQuestionHandler();
                                        setDialog({ close: true });
                                        setInput('');
                                    }}
                                >
                                    Add
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
