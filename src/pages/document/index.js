import { SearchOutlined } from '@ant-design/icons';
import { Box, Button, Grid, OutlinedInput } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import AnimateButton from 'components/@extended/AnimateButton';
import React from 'react';
import { MutatingDots } from 'react-loader-spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import instance from 'utils/axios';
import GTable from '../../components/table/table';
import { renderPage } from 'store/reducers/menu';

function Index() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { render } = useSelector((state) => state.menu);
    const token = localStorage.getItem('token');
    const [AllDocumentData, setDocumentData] = React.useState(null);
    const columnName = ['File', 'Type', 'CreatedAt', 'Action'];
    const formdata = new FormData();
    const [isLoading, setIsLoading] = React.useState(false);
    const [open, setOpen] = React.useState(render);

    const [Search, setSearch] = React.useState({ search: '' });
    const [FilterArray, setFilterArray] = React.useState('');
    const [CustomError, setCustomError] = React.useState('');

    const [dialog, setDialog] = React.useState({
        open: false,
        close: false
    });

    const [dialog1, setDialog1] = React.useState({
        open: false,
        close: false
    });

    const handleClose = () => {
        setDialog({
            close: true
        });
    };
    const handleClose1 = () => {
        setDialog({
            close: true
        });
    };

    const [state, setState] = React.useState('');

    const onUploadFileHandler = async (file) => {
        formdata.append('attachment', file);

        try {
            if (!formdata.has('attachment'))
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
            const result = await instance.post('/api/admin/documents', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-rapidapi-host': 'file-upload8.p.rapidapi.com',
                    'x-rapidapi-key': 'your-rapidapi-key-here'
                }
            });

            if (!result.data.message) {
                getAllDocuments();
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

            setCustomError('');
            getAllDocuments();
            setIsLoading(false);
            dispatch(renderPage({ render: !open }));
            toast.success('Document Added Successfully', {
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

    const getAllDocuments = async () => {
        const documentData = await instance.get('/api/admin/documents');
        setDocumentData(documentData.data.allDocs);
    };

    const searchHandler = () => {
        if (!Search.search) {
            setCustomError('No results found');
            window.location.reload();
            return;
        }
        const pattern = new RegExp(Search.search, 'i');
        const filteredArray = AllDocumentData.filter((item) => {
            return pattern.test(item.type) || pattern.test(item.filename);
        });

        if (!filteredArray.length) return setCustomError('No results found.');
        setFilterArray(filteredArray);
        setCustomError('');
    };

    React.useEffect(() => {
        getAllDocuments();
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
                            <Box
                                sx={{
                                    width: '100%',
                                    margin: '1rem 0rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
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
                                <input
                                    type="file"
                                    id="actual"
                                    name="attachment"
                                    hidden
                                    onChange={(e) => {
                                        setDialog1({ open: true });
                                        setState(e.target.files[0]);
                                    }}
                                />
                                <label
                                    htmlFor="actual"
                                    style={{
                                        border: 'solid #2196f3',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: '#2196f3',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Choose File
                                </label>
                            </Box>
                            {CustomError ? (
                                CustomError
                            ) : FilterArray.length ? (
                                <GTable columnName={columnName} rows={FilterArray} source={'document'} />
                            ) : AllDocumentData?.length ? (
                                <GTable columnName={columnName} rows={AllDocumentData} source={'document'} />
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
                                    No Document Found
                                </Box>
                            )}
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* ----Dialog---- */}
            <Dialog onClose={handleClose} open={dialog.open}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>Upload Document</DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center' }}>
                        <input
                            type="file"
                            id="actual"
                            name="attachment"
                            hidden
                            onChange={(e) => {
                                formdata.append('attachment', e.target.files[0]);
                            }}
                        />
                        <label htmlFor="actual">Choose File</label>
                        <AnimateButton>
                            <Button
                                disableElevation
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    onUploadFileHandler();
                                    setDialog({ close: true });
                                    // setDialog1({ open: true });
                                }}
                            >
                                Upload
                            </Button>
                        </AnimateButton>
                    </Box>
                </Box>
            </Dialog>

            {/* ----Dialog---- */}
            <Dialog onClose={handleClose1} open={dialog1.open}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>
                    Are your sure you want to upload this file?
                </DialogTitle>
                <Box sx={{ display: 'flex', padding: '2rem', gap: '1rem', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={() => setDialog1({ close: true })}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                            onUploadFileHandler(state);
                            setDialog1({ close: true });
                        }}
                    >
                        Confirm
                    </Button>
                </Box>
            </Dialog>
        </>
    );
}

export default Index;
