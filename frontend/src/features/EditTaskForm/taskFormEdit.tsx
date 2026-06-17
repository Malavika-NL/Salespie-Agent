import React, { useEffect } from 'react';
import styles from './taskFormEdit.module.css';
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react';
// import { taskForm } from './slice/taskFormSlice';
import { getUserDetails } from '../lead/slice/leadFormSlice';
import type { RootState } from '../../app/store';
import { refreshTokenReq } from '../Authslice/refreshToken';
import { useNavigate, useParams } from 'react-router-dom';
import { editTaskUser, fetchTaskUserById , clearTaskEditData} from './slice/editTask';
import { getCurrentDate } from '../currentDate/date';



interface FormData {
    id:string,
    task: string;
    description:string;
    start_date:string;
    end_date:string;
    assigned_to:string;
    status:string | null;
    outcome:string | null;
    last_update_date:string | null;
}



const TaskEditForm = () => {

    interface TaskData {
        id: string;
        task: string;
        description: string;
        start_date: string;
        end_date: string;
        assigned_to: string;
        status: string | null;
        outcome: string | null;
        last_update_date: string | null;
      }
      
    const dispatch = useDispatch();
    const { id } = useParams<{id : string}>();
    const userData = useSelector((state: RootState) => state.getUserData.userData);
    console.log('selected user : ',userData)
    const authToken = useSelector((state: RootState) => state.refreshTokenAuth);
    const taskData = useSelector((state: RootState) => state.taskFetchUserById.data) ;
    console.log(taskData)


    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const data = useSelector((state: RootState) => state.taskEditForm.response);
    console.log(data)
    console.log(isFormSubmitted)

    const userDetails = useSelector((state: RootState) => state.userLoginAuth);
    console.log(userDetails.user.role)
    
    const [currentDate, setCurrentDate] = useState<string>('');
    useEffect(() => {
        // Set initial date on component mount
        const date = getCurrentDate();
        setCurrentDate(date);
    }, []);
    const navigate = useNavigate();
    useEffect(() => {
        if (isFormSubmitted) {
            
            if (data?.message === 'Success') {
              console.log(data);
              dispatch(clearTaskEditData());
              alert('Task form editted successfully!');
              if(userDetails.user.role === 'admin' ){
                navigate('/adminDashboard');
            }else{
                navigate('/userDashboard');
            }
              setIsFormSubmitted(false);
            } else if (data?.message === 'Failed') {
              console.log(data.message);
              alert('Task form failed to edit.');
              dispatch(clearTaskEditData());
              setIsFormSubmitted(false);
            }
            console.log(data)
            // Reset the form submission state
          
          }
      }, [isFormSubmitted, data, dispatch, navigate]);

    useEffect(() => {
        if (!authToken) {
          dispatch(refreshTokenReq() as any);
        }
      }, [ authToken,dispatch]);

    useEffect(() => {
        dispatch(getUserDetails() as any);
      }, [dispatch]);
   
      useEffect(() => {
        if (id) {
          dispatch(fetchTaskUserById(id) as any);
          setFormData(prevFormData => ({
            ...prevFormData,
           id:id,
        }));
        }
      }, [dispatch, id]);

      

    const [formData, setFormData] = useState<FormData>({
        id:'',
        task: "",
        description : "",
        start_date: "",
        end_date:"",
        assigned_to:"",
        status:"",
        outcome:"",
        last_update_date:"",

    });

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            last_update_date:currentDate,
         
        }));
      }, []);

      console.log(currentDate)

    useEffect(() => {
        if (taskData) {
         setFormData(taskData as any)
        }
      }, [taskData]);
      console.log(formData)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
            last_update_date: currentDate,
        }));
    };


    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        dispatch(editTaskUser({formData}) as any);
    };
    
    return (
        <div className={styles.outerContainer}>
            <div className={styles.formContainer}>
                <div>Task Form</div>
                <form className={styles.form}  onSubmit={handleSubmit} >
                    <input
                        type='text'
                        name='task'
                        placeholder='Task'
                        onChange={handleChange}
                        value={formData.task}
                        className={styles.inputItem}
                        disabled
                    />
                    <input
                        type='text'
                        name='description'
                        placeholder='Description'
                        onChange={handleChange}
                        value={formData.description}
                        className={styles.inputItem}
                        disabled
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
                            disabled
                        />
                    </div>
                    <div className={styles.datecontainer}>
                        <label className={styles.label}> End Date  : </label>
                        <input
                            type='date'
                            name='end_date'
                            placeholder='endDate'
                            onChange={handleChange}
                            value={formData.end_date}
                            className={styles.inputItem}
                            disabled
                        />
                    </div>
                    <select
                            className={styles.rightSelect}
                            onChange={handleChange}
                            value={formData.assigned_to}
                            name='assigned_to'
                            disabled
                        >
                            <option value="">Assigned to </option>
                            {userData && userData.map((users, index) => (
                                <option key={index} value={users.username}>
                                    {users.username}
                                </option>
                            ))}
                        </select>

                    {/* testing */}
                    <input
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
                        {/* <input
                            type='date'
                            name='last_update_date'
                            placeholder='last_update_date'
                            onChange={handleChange}
                            value={formData.last_update_date || ''}
                            className={styles.inputItem}
                            // disabled

                        /> */}

                        {/* testing ends */}
                    <div className={styles.buttonContainer}>
                        <button type='submit'>Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskEditForm;
