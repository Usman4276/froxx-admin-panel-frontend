import { Box, Button, Grid, OutlinedInput } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AnimateButton from 'components/@extended/AnimateButton';
import React, { useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import instance from 'utils/axios';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Index() {
    const location = useLocation();
    const { description, source } = location.state;
    const { id } = useParams();
    const prevIdRef = useRef(id);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isLoading, setIsLoading] = React.useState(false);
    const [Input, setInput] = React.useState({
        question: ''
    });
    const [dialog, setDialog] = React.useState({
        open: false,
        close: false
    });
    const [ChildsData, setChildsData] = React.useState(null);
    const [ErrorMessage, setErrorMessage] = React.useState('');
    const [Status, setStatus] = React.useState({
        flag: '',
        title: ''
    });
    const [InputForDelete, setInputForDelete] = React.useState('');
    const [InputForEdit, setInputForEdit] = React.useState('');
    const handleClose = () => {
        setDialog({
            close: true
        });
    };
    let columnName = [];

    if (source === 'user') columnName = ['All Childs', 'Actions'];
    if (source === 'faq') columnName = ['Title', 'Description'];
    if (source === 'support') columnName = ['Description Of Problem', 'Location', 'File', 'Uploaded by', 'Created At'];

    const getAllChilds = async () => {
        let result;

        try {
            if (source === 'user') {
                if (!id)
                    return toast.error('Empty fields', {
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
                result = await instance.post('/api/admin/chatbot', {
                    id
                });
                if (!result.data.data) {
                    getAllChilds();
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
                if (!result.data.data.length && !description) return setErrorMessage('No child found');
                if (!result.data.data.length && description) return setErrorMessage(description);
            } else if (source === 'faq') {
                setIsLoading(true);
                result = await instance.post(`/api/admin/faqs/${id}`);
                if (!result.data.data) {
                    getAllChilds();
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
            } else if (source === 'support') {
                setIsLoading(true);
                result = await instance.post(`/api/admin/support/${id}`);
                if (!result.data.data) {
                    getAllChilds();
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
            } else null;

            setChildsData(result.data.data);
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

    const onEditHandler = async () => {
        try {
            setIsLoading(true);
            const result = await instance.put(`/api/admin/chatbot/editnode/${InputForEdit}`, {
                newName: Input.question && Input.question,
                description: Input.description && Input.description
            });
            getAllChilds();
            setIsLoading(false);
            toast.success(result.data.data, {
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

    const onDeleteHandler = async () => {
        try {
            setIsLoading(true);
            const result = await instance.post(`/api/admin/chatbot/${InputForDelete}`);
            getAllChilds();
            setIsLoading(false);
            toast.success(result.data.data, {
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

    React.useEffect(() => {
        getAllChilds();

        if (!token) return navigate('/');
    }, []);

    React.useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        if (prevIdRef.current !== id) {
            prevIdRef.current = id;
            window.location.reload();
        }
    }, [id]);

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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {columnName &&
                                            columnName.map((val, index) => {
                                                return (
                                                    <>
                                                        {source === 'user' && (
                                                            <TableCell
                                                                sx={{ textAlign: index >= 1 && 'end', paddingRight: index >= 1 && '8rem' }}
                                                                key={index}
                                                            >
                                                                {val}
                                                            </TableCell>
                                                        )}
                                                        {source === 'faq' && (
                                                            <TableCell
                                                                sx={{
                                                                    textAlign: index >= 1 && 'end',
                                                                    paddingRight: index >= 1 && '20rem',
                                                                    paddingLeft: '10rem'
                                                                }}
                                                                key={index}
                                                            >
                                                                {val}
                                                            </TableCell>
                                                        )}
                                                        {source === 'support' && <TableCell key={index}>{val}</TableCell>}
                                                    </>
                                                );
                                            })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ChildsData ? (
                                        <>
                                            {source === 'user' &&
                                                ChildsData.map((value) => {
                                                    return (
                                                        <TableRow>
                                                            {source === 'user' && (
                                                                <>
                                                                    <TableCell align="left">{value.name || value.description}</TableCell>

                                                                    <TableCell align="right">
                                                                        <Link
                                                                            to={`/dashboard/chatbot/details/${value._id}`}
                                                                            style={{ textDecoration: 'none' }}
                                                                            state={{ description: value.description, source: 'user' }}
                                                                        >
                                                                            <Button
                                                                                variant="contained"
                                                                                sx={{ marginRight: '10px' }}
                                                                                onClick={() => {
                                                                                    // setStatus({ flag: 'viewchild', title: 'View Child' });
                                                                                    // onView(row.question);
                                                                                }}
                                                                            >
                                                                                {value.description ? 'View' : 'View Childs'}
                                                                            </Button>
                                                                        </Link>
                                                                        <Button
                                                                            variant="contained"
                                                                            sx={{ marginRight: '10px' }}
                                                                            onClick={() => {
                                                                                setStatus({ flag: 'editchild', title: 'Edit Child' });
                                                                                setDialog({ open: true });
                                                                                setInputForEdit(value._id);

                                                                                {
                                                                                    value.name
                                                                                        ? setInput({
                                                                                              question: value.name,
                                                                                              description: ''
                                                                                          })
                                                                                        : setInput({
                                                                                              question: '',
                                                                                              description: value.description
                                                                                          });
                                                                                }
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                        <Button
                                                                            variant="contained"
                                                                            sx={{ marginRight: '10px' }}
                                                                            onClick={() => {
                                                                                setStatus({
                                                                                    flag: 'deletechild',
                                                                                    title: 'Are you sure you want to delete?'
                                                                                });
                                                                                setDialog({ open: true });
                                                                                setInputForDelete(value._id);
                                                                            }}
                                                                            color="error"
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </TableCell>
                                                                </>
                                                            )}
                                                        </TableRow>
                                                    );
                                                })}
                                            {source === 'faq' && (
                                                <>
                                                    <TableCell align="left" sx={{ paddingLeft: '2rem' }}>
                                                        {ChildsData.title}
                                                    </TableCell>

                                                    <TableCell align="left" sx={{ paddingLeft: '40rem', paddingRight: '2rem' }}>
                                                        {ChildsData.body}
                                                    </TableCell>
                                                </>
                                            )}
                                            {source === 'support' &&
                                                ChildsData.map((value) => {
                                                    return (
                                                        <>
                                                            <TableCell align="left">{value.dop}</TableCell>
                                                            <TableCell align="left">{value.location}</TableCell>
                                                            <TableCell align="left">
                                                                <a target="blank" href={value.path}>
                                                                    {value.filename}
                                                                </a>
                                                            </TableCell>
                                                            <TableCell align="left">{value.email}</TableCell>
                                                            <TableCell align="left">{value.createdAt}</TableCell>
                                                        </>
                                                    );
                                                })}
                                        </>
                                    ) : (
                                        <Box sx={{ padding: '2rem', textAlign: 'center' }}>{ErrorMessage}</Box>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>

            {/* ------------Dialog-------------- */}

            <Dialog onClose={handleClose} open={dialog.open}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>{Status.title}</DialogTitle>
                {Status.flag === 'editchild' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%' }}>
                                {Input.question ? (
                                    <OutlinedInput
                                        type="text"
                                        name="question"
                                        value={Input.question}
                                        onChange={(e) => {
                                            setInput({ ...Input, [e.target.name]: e.target.value });
                                        }}
                                        placeholder="Enter Title"
                                    />
                                ) : (
                                    <OutlinedInput
                                        type="text"
                                        name="description"
                                        value={Input.description}
                                        onChange={(e) => {
                                            setInput({ ...Input, [e.target.name]: e.target.value });
                                        }}
                                        placeholder="Enter Description"
                                    />
                                )}

                                <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                onEditHandler();
                                                setInput({
                                                    question: ''
                                                });
                                                setDialog({ close: true });
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}

                {Status.flag === 'deletechild' && (
                    <Box sx={{ display: 'flex', padding: '2rem', gap: '1rem', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => setDialog({ close: true })}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                onDeleteHandler('deletechild');
                                setDialog({ close: true });
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                )}
            </Dialog>
        </>
    );
}

export default Index;
