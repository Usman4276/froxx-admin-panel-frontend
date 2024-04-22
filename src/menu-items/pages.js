// assets
import {
    LoginOutlined,
    ProfileOutlined,
    UserOutlined,
    UnorderedListOutlined,
    RobotOutlined,
    CustomerServiceOutlined,
    FileOutlined
} from '@ant-design/icons';

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined,
    UserOutlined,
    UnorderedListOutlined,
    RobotOutlined,
    CustomerServiceOutlined,
    FileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'services',
    title: 'Services',
    type: 'group',
    children: [
        {
            id: 'user',
            title: 'Users',
            type: 'item',
            url: '/dashboard/users',
            icon: icons.UserOutlined,
            target: true
        },
        {
            id: 'faq',
            title: 'FAQs',
            type: 'item',
            url: '/dashboard/faq',
            icon: icons.UnorderedListOutlined,
            target: true
        },
        {
            id: 'chatbot',
            title: 'Chatbot',
            type: 'item',
            url: '/dashboard/chatbot',
            icon: icons.RobotOutlined,
            target: true
        },
        {
            id: 'support',
            title: 'Support Requests',
            type: 'item',
            url: '/dashboard/support',
            icon: icons.CustomerServiceOutlined,
            target: true
        },
        {
            id: 'document',
            title: 'Documents',
            type: 'item',
            url: '/dashboard/document',
            icon: icons.FileOutlined,
            target: true
        }
    ]
};

export default pages;
