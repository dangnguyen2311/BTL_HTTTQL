import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser } from '../../services/api';
import { setUserList } from '../../store/slices/userSlice';
import { Button, Table, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserForm from '../../components/admin/UserForm';

const UserManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userList } = useSelector((state) => state.user);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers();
            if (response.success) {
                dispatch(setUserList(response.data));
            }
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await deleteUser(userId);
            if (response.success) {
                message.success('User deleted successfully');
                fetchUsers();
            }
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEditUser(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteUser(record._id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Button type="primary" onClick={handleAddUser}>
                    Add New User
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={userList}
                loading={loading}
                rowKey="_id"
            />

            <Modal
                title={selectedUser ? 'Edit User' : 'Add New User'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={600}
            >
                <UserForm
                    selectedUser={selectedUser}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchUsers();
                    }}
                />
            </Modal>
        </div>
    );
};

export default UserManagement; 