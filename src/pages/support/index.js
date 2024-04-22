import { Box, Grid, Button, OutlinedInput } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import instance from 'utils/axios';
import GTable from '../../components/table/table';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Index() {
    const navigate = useNavigate();
    const { render } = useSelector((state) => state.menu);
    const token = localStorage.getItem('token');

    const [supportData, setSupportData] = React.useState([]);
    const columnName = ['Description Of Problem', 'Location', 'Files', 'Uploaded by', 'Created At', 'Actions'];

    const getAllSupport = async () => {
        const supportData = await instance.get('/api/admin/support');
        setSupportData(supportData.data.allDocs);
    };

    const [Search, setSearch] = React.useState({ search: '' });
    const [FilterArray, setFilterArray] = React.useState('');
    const [CustomError, setCustomError] = React.useState('');

    const searchHandler = () => {
        if (!Search.search) {
            setCustomError('No results found');
            window.location.reload();
            return;
        }
        const pattern = new RegExp(Search.search, 'i');
        const filteredArray = supportData.filter((item) => {
            return pattern.test(item.dop) || pattern.test(item.location) || pattern.test(item.filename) || pattern.test(item.email);
        });

        if (!filteredArray.length) return setCustomError('No results found.');
        setFilterArray(filteredArray);
        setCustomError('');
    };

    React.useEffect(() => {
        getAllSupport();
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
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
                            <Button variant="contained" sx={{ float: 'right', margin: '2rem 0rem' }} onClick={() => searchHandler()}>
                                <SearchOutlined style={{ marginRight: '3px' }} /> Search
                            </Button>
                        </Box>

                        {CustomError ? (
                            <Box sx={{ width: '100%', textAlign: 'center' }}>{CustomError}</Box>
                        ) : FilterArray.length ? (
                            <GTable columnName={columnName} rows={FilterArray} source={'support'} />
                        ) : supportData?.length ? (
                            <GTable columnName={columnName} rows={supportData} source={'support'} />
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
                                No Support Found
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default Index;
