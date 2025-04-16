import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../SupabaseClient";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography } from "@mui/material";

export default function UserDetails() {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [userDetails, setUserDetails] = useState([])

    useEffect(() => {
        fetchUserDetails()
    }, [])

    let fetchUserDetails = async () => {
        try {
            let { data, error } = await supabase
                .from('userDetails')
                .select('*')
            if (error) {
                throw error;
            }
            setUserDetails(data || [])
        } catch (error) {
            console.error('Error fetching products:', error.message)
        }
    }

    const [editId, setEditId] = useState(null);
    const onSubmit = async (userData) => {
        if (editId !== null) {
            try {

                const { data, error } = await supabase
                    .from('userDetails')
                    .update(userData)
                    .eq('id', editId)
                    .select()
                if (error) {
                    console.log('Error fetching products:', error.message)
                }
                setUserDetails((prevUserDetails) =>
                    prevUserDetails.map((userDetail) =>
                        userDetail.id === editId ? { ...userDetail, ...userData } : userDetail
                    ))
                setEditId(null);
            } catch (error) {
                throw new Error('Error fetching products:', error.message)
            }
        }
        else {
            try {
                const { data, error } = await supabase
                    .from('userDetails')
                    .insert([
                        userData,
                    ])
                    .select()
                if (error) {
                    console.log(error)
                }
                setUserDetails([...userDetails, ...data])
            } catch (error) {
                console.log(error)
            }

        }
        reset();
    };

    const handleEdit = (id, name, email, mobile) => {
        setEditId(id);
        setValue("name", name);
        setValue("email", email);
        setValue("mobile", mobile);
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from("userDetails")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setUserDetails((prevUserDetails) => prevUserDetails.filter((userDetails) => userDetails.id !== id));
        } catch (error) {
            throw new Error('Error fetching products:', error.message)
        }
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
                Add User --
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    {...register("name", { required: "Name is required" })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth
                                    {...register("mobile", {
                                        required: "Mobile number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Enter a valid 10-digit mobile number",
                                        },
                                    })}
                                    error={!!errors.mobile}
                                    helperText={errors.mobile?.message}
                                />
                            </TableCell>
                            <TableCell>
                                <Button type="submit" variant="contained" color="primary">
                                    {editId !== null ? "Update" : "Add User"}
                                </Button>

                                {editId !== null && (
                                    <Button
                                        variant="outlined"

                                        onClick={() => {
                                            reset();
                                            setEditId(null);
                                        }}
                                        sx={{ m: 1, backgroundColor: 'green', color: "white" }}
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                        {userDetails.map((userDetail) => (
                            <TableRow key={userDetail.id}>
                                <TableCell>{userDetail.name}</TableCell>
                                <TableCell>{userDetail.email}</TableCell>
                                <TableCell>{userDetail.mobile}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="secondary" onClick={() => handleEdit(userDetail.id, userDetail.name, userDetail.email, userDetail.mobile)}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleDelete(userDetail.id)} sx={{ m: 1 }}>
                                        Remove
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </form>
        </TableContainer>
    );
}
