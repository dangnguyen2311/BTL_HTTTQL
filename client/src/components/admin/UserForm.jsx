import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { addUser, updateUser } from '../../services/api';

const { Option } = Select;

const UserForm = ({ selectedUser, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedUser) {
            form.setFieldsValue({
                userName: selectedUser.userName,
                email: selectedUser.email,
                role: selectedUser.role,
            });
        }
    }, [selectedUser, form]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            let response;
            
            if (selectedUser) {
                response = await updateUser(selectedUser._id, values);
            } else {
                response = await addUser(values);
            }

            if (response.success) {
                message.success(
                    selectedUser
                        ? 'User updated successfully'
                        : 'User created successfully'
                );
                onSuccess();
            }
        } catch (error) {
            message.error(
                selectedUser
                    ? 'Failed to update user'
                    : 'Failed to create user'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="mt-4"
        >
            <Form.Item
                name="userName"
                label="User Name"
                rules={[
                    {
                        required: true,
                        message: 'Please enter user name',
                    },
                ]}
            >
                <Input placeholder="Enter user name" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    {
                        required: true,
                        message: 'Please enter email',
                    },
                    {
                        type: 'email',
                        message: 'Please enter a valid email',
                    },
                ]}
            >
                <Input placeholder="Enter email" />
            </Form.Item>

            {!selectedUser && (
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter password',
                        },
                        {
                            min: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    ]}
                >
                    <Input.Password placeholder="Enter password" />
                </Form.Item>
            )}

            <Form.Item
                name="role"
                label="Role"
                rules={[
                    {
                        required: true,
                        message: 'Please select role',
                    },
                ]}
            >
                <Select placeholder="Select role">
                    <Option value="user">User</Option>
                    <Option value="admin">Admin</Option>
                </Select>
            </Form.Item>

            <Form.Item className="mb-0">
                <div className="flex justify-end gap-2">
                    <Button onClick={onSuccess}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {selectedUser ? 'Update' : 'Create'}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default UserForm; 