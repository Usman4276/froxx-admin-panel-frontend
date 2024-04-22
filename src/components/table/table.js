import { FilePdfOutlined, FileWordOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, OutlinedInput } from '@mui/material';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import AnimateButton from 'components/@extended/AnimateButton';
import React from 'react';
import { Link } from 'react-router-dom';
import instance from 'utils/axios';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { renderPage } from 'store/reducers/menu';
import { MutatingDots } from 'react-loader-spinner';

function GTable({ columnName, rows, source }) {
    const dispatch = useDispatch();
    const { render } = useSelector((state) => state.menu);
    const [open, setOpen] = React.useState(render);
    const [dialog, setDialog] = React.useState({
        open: false,
        close: false
    });

    const [Input, setInput] = React.useState({
        question: '',
        lastNode: false,
        description: ''
    });

    const [GState, setGState] = React.useState({});
    const [InputForDelete, setInputForDelete] = React.useState('');
    const [InputForEdit, setInputForEdit] = React.useState({});
    const [tmpValue, setTmpValue] = React.useState('');
    const [tmpArray, setTmpArray] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [Status, setStatus] = React.useState({
        flag: '',
        title: ''
    });

    const onAddQuestionAnswer = async () => {
        if (Input.lastNode && !Input.description) {
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
        if (!Input.lastNode && !tmpArray.length)
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

        try {
            setIsLoading(true);
            const result = await instance.post('/api/admin/chatbot/add', {
                parent: Input.question,
                childs: tmpArray,
                resolved: Input.lastNode,
                description: Input.description
            });

            if (result.data.data) {
                setIsLoading(false);
                setOpen(!open);
                dispatch(renderPage({ render: !open }));
                return toast.success(result.data.data, {
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
        }
    };
    const onAddMultipleAnswers = async () => {
        if (!tmpArray.length)
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
        try {
            setIsLoading(true);
            const result = await instance.post('/api/admin/chatbot/update', {
                question: GState,
                answers: tmpArray,
                lastNode: Input.lastNode,
                description: Input.description
            });

            if (result.data.data) {
                setIsLoading(false);
                setOpen(!open);
                dispatch(renderPage({ render: !open }));
                return toast.error(result.data.data, {
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
        }
    };

    const onEditHandler = async (title) => {
        let result;
        try {
            if (title === 'editfaq') {
                setIsLoading(true);
                result = await instance.post('/api/user/faqs/edit', {
                    prevTitle: InputForEdit.title,
                    title: GState.title,
                    body: GState.body
                });
                if (result.data.message === 'success') {
                    setIsLoading(false);
                    setOpen(!open);
                    dispatch(renderPage({ render: !open }));
                    toast.success('Faq Updated Successfully', {
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
            } else if (title === 'editchild') {
                setIsLoading(true);
                result = await instance.put(`/api/admin/chatbot/editnode/${InputForEdit.nodeId}`, {
                    newName: Input.question && Input.question,
                    description: Input.description && Input.description
                });

                if (result.data.message === 'success') {
                    setIsLoading(false);
                    setOpen(!open);
                    dispatch(renderPage({ render: !open }));
                    toast.success('Child Updated Successfully', {
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
            } else if (title === 'edituser') {
                setIsLoading(true);
                result = await instance.post(`/api/admin/user/edit`, {
                    email: InputForEdit.email,
                    firstname: InputForEdit.firstname,
                    lastname: InputForEdit.lastname,
                    company: InputForEdit.company
                });

                if (result.data.data) {
                    setIsLoading(false);
                    setOpen(!open);
                    dispatch(renderPage({ render: !open }));
                    toast.success('User Updated Successfully', {
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
            } else null;
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
        }
    };

    const onDeleteHandler = async (title) => {
        let result;
        try {
            if (title === 'deleteuser') {
                setIsLoading(true);
                result = await instance.post('/api/user/delete', {
                    email: InputForDelete
                });
                if (result.data.message === 'success') {
                    setIsLoading(false);
                    setOpen(!open);
                    dispatch(renderPage({ render: !open }));
                    toast.success('User Deleted Successfully', {
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
            } else if (title === 'deletefaq') {
                setIsLoading(true);
                result = await instance.post('/api/user/faqs/delete', {
                    title: InputForDelete
                });
                if (result.data.message === 'success') {
                    setIsLoading(false);
                    setOpen(!open);
                    dispatch(renderPage({ render: !open }));
                    toast.success('Faq Deleted Successfully', {
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
            } else if (title === 'deletesupport') {
                setIsLoading(true);
                result = await instance.post('/api/user/support/delete', {
                    email: InputForDelete
                });
                if (result.data.message === 'success') {
                    setIsLoading(false);
                    setOpen(!open);
                    dispatch(renderPage({ render: !open }));
                    toast.success('Support Deleted Successfully', {
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
            } else if (title === 'deletedocument') {
                setIsLoading(true);
                result = await instance.post('/api/user/documents/delete', {
                    filename: InputForDelete
                });
                if (result.data.message === 'success') {
                    setIsLoading(false);
                    setOpen(!open);
                    dispatch(renderPage({ render: !open }));
                    toast.success('Document Deleted Successfully', {
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
            } else if (title === 'deletenode') {
                setIsLoading(true);
                result = await instance.post(`/api/admin/chatbot/${InputForDelete}`);
                if (result.data.message === 'success') {
                    setIsLoading(false);
                    setOpen(!open);
                    dispatch(renderPage({ render: !open }));
                    toast.success('Child Deleted Successfully', {
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
            } else null;
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
        }
    };

    const onView = async (id, title) => {
        let result;
        try {
            if (!id)
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
            if (title === 'viewfaq') {
                result = await instance.post(`/api/admin/faqs/${id}`);
            } else if (title === 'viewsupport') {
                result = await instance.post(`/api/admin/support/${id}`);
            } else null;

            if (!result.data.data)
                return toast.error(result.data.message, {
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

            setGState(result.data.data);
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
        }
    };

    const handleClose = () => {
        setDialog({
            close: true,
            open: false
        });
    };

    const handleClick = (event) => {
        event.preventDefault();
        const absolutePath = event.target.getAttribute('href');
        window.location.href = absolutePath;
    };

    return (
        <>
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
                                                        sx={{ textAlign: index >= 5 && 'end', paddingRight: index >= 5 && '5rem' }}
                                                        key={index}
                                                    >
                                                        {val}
                                                    </TableCell>
                                                )}
                                                {source === 'faq' && (
                                                    <TableCell
                                                        sx={{ textAlign: index >= 3 && 'end', paddingRight: index >= 3 && '5rem' }}
                                                        key={index}
                                                    >
                                                        {val}
                                                    </TableCell>
                                                )}
                                                {source === 'chatbot' && (
                                                    <TableCell
                                                        sx={{ textAlign: index >= 1 && 'end', paddingRight: index >= 1 && '10rem' }}
                                                        key={index}
                                                    >
                                                        {val}
                                                    </TableCell>
                                                )}
                                                {source === 'support' && (
                                                    <TableCell
                                                        sx={{ textAlign: index >= 5 && 'end', paddingRight: index >= 5 && '2rem' }}
                                                        key={index}
                                                    >
                                                        {val}
                                                    </TableCell>
                                                )}
                                                {source === 'document' && (
                                                    <TableCell
                                                        sx={{ textAlign: index >= 3 && 'end', paddingRight: index >= 3 && '2rem' }}
                                                        key={index}
                                                    >
                                                        {val}
                                                    </TableCell>
                                                )}
                                            </>
                                        );
                                    })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows &&
                                rows.map((row, index) => (
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        {source === 'user' && (
                                            <>
                                                <TableCell align="left">{row.firstname}</TableCell>
                                                <TableCell align="left">{row.lastname}</TableCell>
                                                <TableCell align="left">{row.company}</TableCell>
                                                <TableCell align="left">{row.email}</TableCell>
                                                <TableCell align="left">{row.createdAt}</TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        sx={{ marginRight: '10px' }}
                                                        onClick={() => {
                                                            setStatus({
                                                                flag: 'edituser',
                                                                title: 'Edit User'
                                                            });
                                                            setDialog({ open: true });
                                                            setInputForEdit({
                                                                email: row.email,
                                                                firstname: row.firstname,
                                                                lastname: row.lastname,
                                                                company: row.company
                                                            });
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        color="error"
                                                        variant="contained"
                                                        onClick={() => {
                                                            setStatus({
                                                                flag: 'deleteuser',
                                                                title: 'Are you sure you want to delete?'
                                                            });
                                                            setDialog({ open: true });
                                                            setInputForDelete(row.email);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
                                        {source === 'faq' && (
                                            <>
                                                <TableCell align="left">{row.title}</TableCell>
                                                <TableCell align="left">{row.body.split(' ')[0]}...</TableCell>
                                                <TableCell align="left">{row.createdAt}</TableCell>

                                                <TableCell align="right">
                                                    <Button
                                                        variant="contained"
                                                        sx={{ marginRight: '10px' }}
                                                        onClick={() => {
                                                            setStatus({ flag: 'viewfaq', title: 'Faq Details' });
                                                            setDialog({ open: true });
                                                            onView(row._id, 'viewfaq');
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        sx={{ marginRight: '10px' }}
                                                        onClick={() => {
                                                            setStatus({
                                                                flag: 'editfaq',
                                                                title: 'Edit Faq'
                                                            });
                                                            setDialog({ open: true });
                                                            setInputForEdit({
                                                                title: row.title,
                                                                body: row.body
                                                            });
                                                            setGState({ title: row.title, body: row.body });
                                                        }}
                                                        variant="contained"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setStatus({
                                                                flag: 'deletefaq',
                                                                title: 'Are you sure you want to delete?'
                                                            });
                                                            setDialog({ open: true });
                                                            setInputForDelete(row.title);
                                                        }}
                                                        color="error"
                                                        variant="contained"
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
                                        {source === 'support' && (
                                            <>
                                                <TableCell align="left">{row.dop.split(' ')[0]}...</TableCell>
                                                <TableCell align="left">{row.location}</TableCell>
                                                <TableCell align="left">Attachments({row.path.length})</TableCell>
                                                <TableCell align="left">{row.email}</TableCell>
                                                <TableCell align="left">{row.createdAt}</TableCell>
                                                <TableCell align="right">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'end',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            flexWrap: 'wrap'
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => {
                                                                setStatus({ flag: 'viewsupport', title: 'Support Details' });
                                                                setDialog({ open: true });
                                                                onView(row._id, 'viewsupport');
                                                            }}
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() => {
                                                                setStatus({
                                                                    flag: 'deletesupport',
                                                                    title: 'Are you sure you want to delete?'
                                                                });
                                                                setDialog({ open: true });
                                                                setInputForDelete(row.email);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                            </>
                                        )}
                                        {source === 'document' && (
                                            <>
                                                <TableCell align="left">
                                                    <a target="blank" href={`${process.env.REACT_APP_API_BASEURL}/${row.forAdmin}`}>
                                                        {row.filename}
                                                    </a>
                                                </TableCell>
                                                <TableCell align="left">
                                                    {row.ext === '.pdf' ? <FilePdfOutlined /> : <FileWordOutlined />}
                                                    {row.ext}
                                                </TableCell>
                                                <TableCell align="left">{row.createdAt}</TableCell>
                                                <TableCell align="right">
                                                    <Button
                                                        color="error"
                                                        variant="contained"
                                                        onClick={() => {
                                                            setStatus({
                                                                flag: 'deletedocument',
                                                                title: 'Are you sure you want to delete?'
                                                            });
                                                            setDialog({ open: true });
                                                            setInputForDelete(row.filename);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
                                        {source === 'chatbot' && (
                                            <>
                                                {row.description ? (
                                                    <TableCell align="left">{row.description.split(' ')[0]}...</TableCell>
                                                ) : (
                                                    <TableCell align="left">{row.name}</TableCell>
                                                )}

                                                {/* --------Actions-------- */}
                                                <TableCell align="right">
                                                    <Link
                                                        to={`/dashboard/chatbot/details/${row._id}`}
                                                        style={{ textDecoration: 'none' }}
                                                        state={{ description: row.description, source: 'user' }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            sx={{ marginRight: '10px' }}
                                                            // onClick={() => {
                                                            //     setStatus({ flag: 'viewchild', title: 'View Child' });
                                                            //     onView(row.question);
                                                            // }}
                                                        >
                                                            {row.description ? 'View' : 'View Childs'}
                                                        </Button>
                                                    </Link>

                                                    {row.description ? null : (
                                                        <Button
                                                            variant="contained"
                                                            sx={{ marginRight: '10px' }}
                                                            onClick={() => {
                                                                setStatus({ flag: 'addqa', title: 'Add Childs' });
                                                                setDialog({ open: true });
                                                                setInput({ question: row.name });
                                                            }}
                                                        >
                                                            Add
                                                        </Button>
                                                    )}

                                                    <Button
                                                        variant="contained"
                                                        sx={{ marginRight: '10px' }}
                                                        onClick={() => {
                                                            setStatus({ flag: 'editchild', title: 'Edit Childs' });
                                                            setDialog({ open: true });
                                                            setInputForEdit({ nodeId: row._id });

                                                            {
                                                                row.name
                                                                    ? setInput({ question: row.name, description: '' })
                                                                    : setInput({ question: '', description: row.description });
                                                            }
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        sx={{ marginRight: '10px' }}
                                                        onClick={() => {
                                                            setStatus({ flag: 'deletenode', title: 'Are you sure you want to delete?' });
                                                            setDialog({ open: true });
                                                            setInputForDelete(row._id);
                                                        }}
                                                        color="error"
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* ------------Dialog-------------- */}
            <Dialog onClose={handleClose} open={dialog.open}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem' }}>{Status.title}</DialogTitle>
                {Status.flag === 'addqa' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%' }}>
                            <OutlinedInput
                                type="text"
                                name="question"
                                value={Input.question}
                                // onChange={(e) => {
                                //     setInput({ ...Input, [e.target.name]: e.target.value });
                                // }}
                                placeholder="Enter Parent"
                            />

                            {/* Add New Answer login */}
                            {Input.lastNode ? (
                                <OutlinedInput
                                    type="text"
                                    value={Input.description}
                                    name="description"
                                    onChange={(e) => {
                                        setInput({ ...Input, [e.target.name]: e.target.value });
                                    }}
                                    placeholder="Enter description"
                                    multiline
                                    rows={3}
                                />
                            ) : (
                                <Box>
                                    <OutlinedInput
                                        type="text"
                                        value={tmpValue}
                                        name="answers"
                                        onChange={(e) => {
                                            setTmpValue(e.target.value);
                                        }}
                                        placeholder="Child"
                                    />
                                    <Tooltip title="Add This Child">
                                        <IconButton
                                            onClick={() => {
                                                if (!tmpValue)
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
                                                setTmpArray((val) => [...val, tmpValue]);
                                                setTmpValue('');
                                            }}
                                        >
                                            <PlusCircleOutlined style={{ fontSize: '1.6rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )}
                            <Box>
                                {tmpArray &&
                                    tmpArray.map((val, index) => {
                                        return (
                                            <Chip
                                                key={index}
                                                label={val}
                                                sx={{ marginRight: '10px', marginBottom: '10px' }}
                                                onDelete={() => {
                                                    const index = tmpArray.findIndex((value) => value === val);
                                                    tmpArray.splice(index, 1);
                                                    setTmpArray([...tmpArray]);
                                                }}
                                            />
                                        );
                                    })}
                            </Box>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={(e) => {
                                                setTmpArray([]);
                                                setInput({ ...Input, lastNode: e.target.checked });
                                            }}
                                        />
                                    }
                                    label="Mark as resolved"
                                />
                            </FormGroup>
                            <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
                                <AnimateButton>
                                    <Button
                                        disableElevation
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            onAddQuestionAnswer();
                                            setInput({
                                                question: '',
                                                lastNode: '',
                                                description: ''
                                            });
                                            setTmpArray([]);
                                            setTmpValue('');
                                            setDialog({ close: true });
                                        }}
                                    >
                                        Save
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Box>
                    </Box>
                )}

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
                                                onEditHandler('editchild');
                                                setInput({
                                                    question: '',
                                                    lastNode: '',
                                                    description: ''
                                                });
                                                setTmpArray([]);
                                                setTmpValue('');
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

                {Status.flag === 'updatechild' && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%' }}>
                                <OutlinedInput
                                    type="text"
                                    name="question"
                                    value={GState}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    placeholder="Question"
                                />

                                {/* Add New Answer login */}
                                <Box sx={{ display: 'flex', gap: '1rem' }}>
                                    <OutlinedInput
                                        type="text"
                                        value={tmpValue}
                                        name="answers"
                                        onChange={(e) => {
                                            setTmpValue(e.target.value);
                                        }}
                                        placeholder="Answer"
                                    />
                                    <Tooltip title="Add This Answer">
                                        <IconButton
                                            onClick={() => {
                                                if (!tmpValue)
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
                                                setTmpArray((val) => [...val, tmpValue]);
                                            }}
                                        >
                                            <PlusCircleOutlined style={{ fontSize: '1.6rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                {tmpArray &&
                                    tmpArray.map((val, index) => {
                                        return (
                                            <Chip
                                                key={index}
                                                label={val}
                                                onDelete={() => {
                                                    const index = tmpArray.findIndex((value) => value === val);
                                                    tmpArray.splice(index, 1);
                                                    setInput({ ...Input, answers: [...tmpArray] });
                                                }}
                                            />
                                        );
                                    })}

                                <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
                                    <AnimateButton>
                                        <Button
                                            disableElevation
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                onAddMultipleAnswers();
                                                setInput({
                                                    question: '',
                                                    lastNode: '',
                                                    description: ''
                                                });
                                                setTmpArray([]);
                                                setTmpValue('');
                                                setDialog({ close: true });
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}

                {Status.flag === 'viewchild' && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            width: '20rem',
                            padding: '2rem 0rem',
                            gap: '10px'
                        }}
                    >
                        {GState.answers &&
                            GState?.answers.map((val, index) => {
                                return <Chip key={index} label={val} sx={{ margin: '0rem 10px' }} />;
                            })}

                        {GState.description && <Chip label={GState.description} sx={{ margin: '0rem 10px' }} />}
                    </Box>
                )}

                {Status.flag === 'deletenode' && (
                    <Box sx={{ display: 'flex', padding: '2rem', gap: '1rem', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => setDialog({ close: true })}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                onDeleteHandler('deletenode');
                                setDialog({ close: true });
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                )}

                {Status.flag === 'deleteuser' && (
                    <Box sx={{ display: 'flex', padding: '2rem', gap: '1rem', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => setDialog({ close: true })}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                onDeleteHandler('deleteuser');
                                setDialog({ close: true });
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                )}

                {Status.flag === 'deletefaq' && (
                    <Box sx={{ display: 'flex', padding: '2rem', gap: '1rem', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => setDialog({ close: true })}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                onDeleteHandler('deletefaq');
                                setDialog({ close: true });
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                )}

                {Status.flag === 'editfaq' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%' }}>
                            <OutlinedInput
                                type="text"
                                value={GState.title}
                                name="title"
                                onChange={(e) => {
                                    setGState({ ...GState, [e.target.name]: e.target.value });
                                }}
                                placeholder="Title"
                            />
                            <OutlinedInput
                                type="text"
                                value={GState.body}
                                name="body"
                                onChange={(e) => {
                                    setGState({ ...GState, [e.target.name]: e.target.value });
                                }}
                                placeholder="Description"
                                multiline
                                rows={3}
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
                                            onEditHandler('editfaq');
                                            setDialog({ close: true });
                                            setGState({
                                                title: '',
                                                body: ''
                                            });
                                        }}
                                    >
                                        Update
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Box>
                    </Box>
                )}

                {Status.flag === 'edituser' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '20rem', padding: '2rem 0rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '80%' }}>
                            <OutlinedInput
                                type="text"
                                value={InputForEdit.firstname}
                                name="firstname"
                                onChange={(e) => {
                                    setInputForEdit({ ...InputForEdit, [e.target.name]: e.target.value });
                                }}
                                placeholder="Firstname"
                            />
                            <OutlinedInput
                                type="text"
                                value={InputForEdit.lastname}
                                name="lastname"
                                onChange={(e) => {
                                    setInputForEdit({ ...InputForEdit, [e.target.name]: e.target.value });
                                }}
                                placeholder="Lastname"
                            />
                            <OutlinedInput
                                type="text"
                                value={InputForEdit.company}
                                name="company"
                                onChange={(e) => {
                                    setInputForEdit({ ...InputForEdit, [e.target.name]: e.target.value });
                                }}
                                placeholder="Company"
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
                                            onEditHandler('edituser');
                                            setDialog({ close: true });
                                            setInputForEdit({});
                                        }}
                                    >
                                        Update
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </Box>
                    </Box>
                )}

                {Status.flag === 'deletesupport' && (
                    <Box sx={{ display: 'flex', padding: '2rem', gap: '1rem', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => setDialog({ close: true })}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                onDeleteHandler('deletesupport');
                                setDialog({ close: true });
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                )}

                {Status.flag === 'deletedocument' && (
                    <Box sx={{ display: 'flex', padding: '2rem', gap: '1rem', justifyContent: 'center' }}>
                        <Button variant="contained" onClick={() => setDialog({ close: true })}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                onDeleteHandler('deletedocument');
                                setDialog({ close: true });
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                )}

                {Status.flag === 'viewfaq' && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '40rem'
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem 2rem', width: '100%' }}>
                            <label htmlFor="title" style={{ fontWeight: 'bold' }}>
                                Title
                            </label>
                            <Box id="title" sx={{ border: 'solid #B6B6B6 1px', padding: '1rem', overflow: 'scroll', borderRadius: '5px' }}>
                                {GState.title}
                            </Box>
                            <label htmlFor="description" style={{ fontWeight: 'bold' }}>
                                Description
                            </label>
                            <Box
                                id="description"
                                sx={{
                                    border: 'solid #B6B6B6 1px',
                                    padding: '1rem',
                                    height: '10rem',
                                    overflow: 'scroll',
                                    borderRadius: '5px'
                                }}
                            >
                                {GState.body}
                            </Box>
                        </Box>
                    </Box>
                )}
                {Status.flag === 'viewsupport' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '40rem' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', padding: '2rem 2rem' }}>
                            <label htmlFor="dop" style={{ fontWeight: 'bold' }}>
                                Location
                            </label>
                            <Box
                                id="dop"
                                sx={{
                                    border: 'solid #B6B6B6 1px',
                                    padding: '1rem',
                                    overflow: 'scroll',
                                    borderRadius: '5px'
                                }}
                            >
                                {GState[0]?.location}
                            </Box>
                            <label htmlFor="body" style={{ fontWeight: 'bold' }}>
                                Description Of Problem
                            </label>
                            <Box
                                id="body"
                                sx={{
                                    border: 'solid #B6B6B6 1px',
                                    padding: '1rem',
                                    height: '10rem',
                                    overflow: 'scroll',
                                    borderRadius: '5px'
                                }}
                            >
                                {GState[0]?.dop}
                            </Box>
                            <label htmlFor="email" style={{ fontWeight: 'bold' }}>
                                Uploaded by
                            </label>
                            <Box
                                id="email"
                                sx={{
                                    border: 'solid #B6B6B6 1px',
                                    padding: '1rem',
                                    overflow: 'scroll',
                                    borderRadius: '5px'
                                }}
                            >
                                {GState[0]?.email}
                            </Box>
                            <label htmlFor="files" style={{ fontWeight: 'bold' }}>
                                Files
                            </label>
                            <Box
                                id="files"
                                sx={{
                                    border: 'solid #B6B6B6 1px',
                                    padding: '1rem',
                                    overflow: 'scroll',
                                    borderRadius: '5px'
                                }}
                            >
                                {GState[0]?.path.map((value) => {
                                    return (
                                        <a
                                            target="blank"
                                            href={`${process.env.REACT_APP_API_BASEURL}/${value.path}`}
                                            style={{ textDecoration: 'none', margin: '0px 6px' }}
                                        >
                                            {value.filename} <br />
                                        </a>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Dialog>
        </>
    );
}

export default GTable;
