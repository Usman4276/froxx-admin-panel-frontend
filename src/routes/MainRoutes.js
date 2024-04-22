import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const Users = Loadable(lazy(() => import('pages/users')));
const Faqs = Loadable(lazy(() => import('pages/faqs')));
const Chatbot = Loadable(lazy(() => import('pages/chatbot')));
const Support = Loadable(lazy(() => import('pages/support')));
const Document = Loadable(lazy(() => import('pages/document')));
const Details = Loadable(lazy(() => import('pages/detail')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/dashboard',
    element: <MainLayout />,
    children: [
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard/users',
            element: <Users />
        },
        {
            path: '/dashboard/faq',
            element: <Faqs />
        },
        {
            path: '/dashboard/chatbot',
            element: <Chatbot />
        },
        {
            path: '/dashboard/support',
            element: <Support />
        },
        {
            path: '/dashboard/document',
            element: <Document />
        },
        {
            path: '/dashboard/chatbot/details/:id',
            element: <Details />
        }
        // {
        //     path: 'color',
        //     element: <Color />
        // },
        // {
        //     path: 'sample-page',
        //     element: <SamplePage />
        // },
        // {
        //     path: 'shadow',
        //     element: <Shadow />
        // },
        // {
        //     path: 'typography',
        //     element: <Typography />
        // },
        // {
        //     path: 'icons/ant',
        //     element: <AntIcons />
        // }
    ]
};

export default MainRoutes;
