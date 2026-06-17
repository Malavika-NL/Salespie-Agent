import React, { useEffect, useRef } from 'react';
import styles from './taskForm.module.css';
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
import { taskForm, clearTaskData } from './slice/taskFormSlice';
import { getUserDetails } from '../lead/slice/leadFormSlice';
import type { RootState } from '../../app/store';
import { type AnyAction } from 'redux';
import { clearTableData, taskFormData } from '../TaskTable/slice/taskTableSlice';
import { useNavigate } from 'react-router-dom';


interface FormData {
    task: string;
    description: string;
    start_date: string;
    end_date: string;
    assigned_to: string;
    //     status:string | null;
    //     outcome:string | null;
    //     last_update_date:string | null;
}



const TaskForm = () => {

    const dispatch = useDispatch();

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const data = useSelector((state: RootState) => state.taskForm.data);
    console.log(data)
    console.log(isFormSubmitted)

    const navigate = useNavigate();
    // useEffect(() => {
    //     if (isFormSubmitted && data?.message === 'Success')  {
    //         console.log(data)
    //       dispatch(clearTaskData());
    //       alert(' Task form submitted successfully !');
    //       navigate('/adminDashboard');

    //       setIsFormSubmitted(false); 
    //     }
    //     if (isFormSubmitted && data?.message === ' not Success'){
    //         alert(' Task form not submitted ');
    //         navigate('/adminDashboard');
    //     }
    //   }, [ isFormSubmitted,data]);
    const userDetails = useSelector((state: RootState) => state.userLoginAuth);
    console.log(userDetails.user.role)

    useEffect(() => {
        if (isFormSubmitted) {
            if (data?.message === 'Success') {
                console.log(data);
                dispatch(clearTaskData());
                dispatch(clearTableData());
                alert('Task form submitted successfully!');

                if (userDetails.user.role === 'admin') {
                    navigate('/adminDashboard');
                } else {
                    navigate('/userDashboard');
                }
                setIsFormSubmitted(false);
            } else if (data?.message === 'Failed') {
                console.log(data.message);
                alert('Task form Failed to  submitted.');
                setIsFormSubmitted(false);
                // Optionally handle failure state or additional logic here
            }
            // Reset the form submission state

        }
    }, [isFormSubmitted, data, dispatch, navigate]);

    const userData = useSelector((state: RootState) => state.getUserData.userData);
    console.log(userData)

    // useEffect(() => {
    //     const data = dispatch(taskFormData() as any);
    //     console.log(data)
    //   }, [dispatch]);

    useEffect(() => {
        dispatch(getUserDetails() as any);
    }, [dispatch]);

    const [formData, setFormData] = useState<FormData>({
        task: "",
        description: "",
        start_date: "",
        end_date: "",
        assigned_to: "",
        // status:"",
        // outcome:"",
        // last_update_date:"",

    });
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const taskTextareaRef = useRef<HTMLTextAreaElement>(null);
    const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const resizeTextArea = (textarea: HTMLTextAreaElement | null) => {
            if (textarea) {
                textarea.style.height = 'auto'; // Reset height to auto before calculating
                textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on content
            }
        };

        const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const textarea = e.target;
            resizeTextArea(textarea);
        };

        // Attach handleResize to the textareas
        if (taskTextareaRef.current) {
            taskTextareaRef.current.addEventListener('input', handleResize as any);
        }
        if (descriptionTextareaRef.current) {
            descriptionTextareaRef.current.addEventListener('input', handleResize as any);
        }

        // Cleanup event listeners
        return () => {
            if (taskTextareaRef.current) {
                taskTextareaRef.current.removeEventListener('input', handleResize as any);
            }
            if (descriptionTextareaRef.current) {
                descriptionTextareaRef.current.removeEventListener('input', handleResize as any);
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        dispatch(taskForm(formData) as any);

        console.log(isFormSubmitted)
    };

    console.log(formData)

    return (
        <div className={styles.outerContainer}>
            <div className={styles.formContainer}>
                <div>Task Form</div>
                <form className={styles.form} onSubmit={handleSubmit} >
                    <textarea
                        ref={taskTextareaRef}
                        name='task'
                        placeholder='Task'
                        onChange={handleChange}
                        value={formData.task || ''}
                        className={styles.inputItem}
                        rows={1} // Initial minimum rows
                        style={{ resize: 'none', overflow: 'hidden' }} // Disable manual resizing, hide scrollbars
                    />


                    <textarea
                        ref={descriptionTextareaRef}
                        name='description'
                        placeholder='Description'
                        onChange={handleChange}
                        value={formData.description || ''}
                        className={styles.inputItem}
                        rows={1} // Initial minimum rows
                        style={{ resize: 'none', overflow: 'hidden' }} // Disable manual resizing, hide scrollbars
                    />
                    <div className={styles.datecontainer}>
                        <label className={styles.label}> start Date  : </label>
                        <input
                            type='date'
                            name='start_date'
                            placeholder='startDate'
                            onChange={handleChange}
                            value={formData.start_date}
                            className={styles.inputItem}

                        />
                    </div>
                    <div className={styles.datecontainer}>
                        <label htmlFor='end_name' className={styles.label}> End Date  : </label>
                        <input
                            type='date'
                            name='end_date'
                            placeholder='endDate'
                            onChange={handleChange}
                            value={formData.end_date}
                            className={styles.inputItem}

                        />
                    </div>
                    <select
                        className={styles.rightSelect}
                        onChange={handleChange}
                        value={formData.assigned_to}
                        name='assigned_to'
                    >
                        <option value="">Assigned to </option>
                        {userData && userData.map((users, index) => (
                            <option key={index} value={users.id}>
                                {users.username}
                            </option>
                        ))}
                    </select>

                    {/* testing */}
                    {/* <input
                            type='text'
                            name='status'
                            placeholder='status'
                            onChange={handleChange}
                            value={formData.status || ''}
                            className={styles.inputItem}

                        />
                        <input
                            type='text'
                            name='outcome'
                            placeholder='outcome'
                            onChange={handleChange}
                            value={formData.outcome || ''}
                            className={styles.inputItem}

                        />
                        <input
                            type='date'
                            name='last_update_date'
                            placeholder='last_update_date'
                            onChange={handleChange}
                            value={formData.last_update_date || ''}
                            className={styles.inputItem}

                        /> */}

                    {/* testing ends */}
                    <div className={styles.buttonContainer}>
                        <button type='submit'>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskForm;
