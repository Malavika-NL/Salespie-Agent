import styles from './editOpportunityStatus.module.css'
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { getCurrentDate } from '../../currentDate/date';
import type { RootState } from '../../../app/store';
import { clearOpportunityEditData, editOpportunityUser, fetchOpportunityUserById } from '../../EditOpportunityForm/slice/editOpportunity';
import { refreshTokenReq } from '../../Authslice/refreshToken';
import { clearTaskEditData, editTaskUser, fetchTaskUserById } from '../../EditTaskForm/slice/editTask';
import { getUserDetails } from '../../lead/slice/leadFormSlice';



interface FormData {
    id: string;
    account_holder: string;
    account_name: string;
    opportunity: string;
    make: string | null;
    sub_make: string | null;
    sub_make_brand: string | null;
    pic: string;
    contact_person: string;
    designation: string;
    department: string;
    mobile_number: string;
    email_id: string;
    location: string;
    state: string;
    city: string;
    address: string;
    opportunity_description: string;
    qty: string;
    values: string;
    exp_closure_date: string;
    exp_po_date: string;
    remarks?: string | null;
    stage: string;
    lost_reason?: string | null;
    hardware_amount: number;
    software_amount: number;
    consumables_amount: number;
    automation_amount: number;
    solution_amount: number;
    maintenance_amount: number;
    others_amount: number;
    total_amount: number;
    status:string | null;
    vertical:string | null;
}



const OpportuntiyStatusEditForm = () => {


    const dispatch = useDispatch();
    const { id } = useParams<{id : string}>();
    const userData = useSelector((state: RootState) => state.getUserData.userData);
    console.log('selected user : ',userData)
    const authToken = useSelector((state: RootState) => state.refreshTokenAuth);
    const user = useSelector((state: RootState) => state.opportunityFetchUserById.selectedUser);
    console.log('currrent user',user)


    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const data = useSelector((state: RootState) => state.opportunityEditForm.response);
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
                dispatch(clearOpportunityEditData());
                alert('Opportunity form editted successfully!');
                if (userDetails.user.role === 'admin') {
                    navigate('/adminDashboard');
                } else {
                    navigate('/userDashboard');
                }
                setIsFormSubmitted(false);
            } else if (data?.message === 'Failed') {
                console.log(data.message);
                alert('Opportunity form failed to edit.');
                dispatch(clearOpportunityEditData());
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

    // useEffect(() => {
    //     dispatch(getUserDetails() as any);
    //   }, [dispatch]);
   
      useEffect(() => {
        if (id) {
            dispatch(fetchOpportunityUserById(id) as any);
            setFormData(prevFormData => ({
                ...prevFormData,
                id: id,

            }));
        }
    }, [dispatch, id]);

      

    const [formData, setFormData] = useState<FormData>({
        id: '',
        account_holder: '',
        account_name: '',
        opportunity: '',
        make: '',
        sub_make: '',
        sub_make_brand: '',
        pic: '',
        contact_person: '',
        designation: '',
        department: '',
        mobile_number: '',
        email_id: '',
        location: '',
        state: '',
        city: '',
        address: '',
        opportunity_description: '',
        qty: '',
        values: '',
        exp_closure_date: '',
        exp_po_date: '',
        remarks: '',
        stage: '',
        lost_reason: '',
        hardware_amount: 0,
        software_amount: 0,
        consumables_amount: 0,
        automation_amount: 0,
        solution_amount: 0,
        maintenance_amount: 0,
        others_amount: 0,
        total_amount: 0,
        status:'',
        vertical:'',
    });
    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            last_update_date:currentDate,
         
        }));
      }, []);

      console.log(currentDate)

      useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);
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
        dispatch(editOpportunityUser({ formData }) as any);
    };


    return (
        <div className={styles.outerContainer}>
            <div className={styles.formContainer}>
                <div>Opportunity Status Form</div>
                <form className={styles.form}  onSubmit={handleSubmit} >
                    <input
                        type='text'
                        name='task'
                        placeholder='Task'
                        onChange={handleChange}
                        value={formData.account_name}
                        className={styles.inputItem}
                        disabled
                    />
                    <input
                        type='text'
                        name='description'
                        placeholder='Description'
                        onChange={handleChange}
                        value={formData.opportunity}
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
                            value={formData.exp_closure_date}
                            className={styles.inputItem}
                            disabled
                        />
                    </div>
                   
                    

                    {/* testing */}
                    
                        <input
                            type='text'
                            name='outcome'
                            placeholder='outcome'
                            onChange={handleChange}
                            value={formData.total_amount}
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
                        <input
                            type='text'
                            name='status'
                            placeholder='status'
                            onChange={handleChange}
                            value={formData.status || ''}
                            className={styles.inputItem}

                        />
                    <div className={styles.buttonContainer}>
                        <button type='submit' className={styles.button}>Update</button>
                    </div>
                </form>
            </div>
        </div>

    )

}

export default OpportuntiyStatusEditForm




