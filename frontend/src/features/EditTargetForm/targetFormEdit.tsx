import styles from './targetFormEdit.module.css'
import { useState, useEffect, useRef } from 'react';
import { getCurrentDate } from '../currentDate/date'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTargetUserById } from './slice/targetFormEdit';
import { editTargetUser , clearTargetEditData } from './slice/targetFormEdit';
import { refreshTokenReq } from '../Authslice/refreshToken';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../../app/store';


interface FormData {
    id: string;
    account_holder: string;
    account_name: string;
    department: string;
    vertical: string;
    vertical_sub: string;
    pic: string;
    designation: string;
    business: string;
    activity: string;
    activity_date: string;
    next_action: string;
    remarks: string;
    next_action_date: string;
    region: string;
    mobile_number: string;
    email_id: string;
    location: string;
    state: string;
    city: string;
    address: string;
    acct_created_date: string;
    
}


interface Vertical {
    category: string;
    subdivisions?: Vertical[];
}

const verticals: Vertical[] = [
    {
        category: 'Automobile',
        subdivisions: [
            { category: 'Automotive' },
            { category: 'Auto Component' },
            { category: 'Tier 1' },
            { category: 'Tier 2' }
        ]
    },
    { category: 'Health Care' },
    { category: 'E-Commerce' },
    {
        category: 'E&E',
        subdivisions: [
            { category: 'Electronics' },
            { category: 'Electrical Components' },
            { category: 'Tier 1' }
        ]
    },
    { category: 'FMCG' },
    { category: 'Chemical Mfg' },
    { category: 'Other Mfg' },
    {
        category: 'F&B',
        subdivisions: [
            { category: 'F&B Mfg' },
            { category: 'Food Mfg' },
            { category: 'Beverages Mfg' },
            { category: 'Cloud Kitchen' }
        ]
    },
    {
        category: 'Pharmaceutical',
        subdivisions: [
            { category: 'Pharma/Health Care' },
            { category: 'Hospitals' },
            { category: 'Tier 1/Supplier' }
        ]
    },
    {
        category: 'Retails',
        subdivisions: [
            { category: 'E-Commerce' },
            { category: 'Retails' }
        ]
    },
    { category: 'Transport & Logistics' },
    { category: 'Apparel' },
    { category: 'Government' },
    { category: 'Others' }
];


interface Region {
    name: string;
}

const regions: Region[] = [
    { name: 'North' },
    { name: 'South' },
    { name: 'East' },
    { name: 'West' },
    { name: 'INT' }
];


interface Department {
    name: string;
}

const departments: Department[] = [
    { name: 'Purchase' },
    { name: 'Procurement' },
    { name: 'PPC Head' },
    { name: 'IT Head' },
    { name: 'Plant Head' },
    { name: 'Quality' },
    { name: 'Logistics' },
    { name: 'Supply Chain' },
    { name: 'Operations' },
    { name: 'Information System' },
    { name: 'Vendor Development' },
    { name: 'Commertials' },
    { name: 'Project Development' },
    { name: 'Maintenance' },
    { name: 'Support & Services' },
    { name: 'Manufacturing Head' },
    { name: 'Production Head' },
    { name: 'Warehouse Manager' },
    { name: 'Business Development' },
    { name: 'Sales Manager' },
    { name: 'Marketing' },
    { name: 'Admin/HR' }
];

interface BusinessOption {
    type: string;
}

const businessOptions: BusinessOption[] = [
    { type: 'Direct Business' },
    { type: 'Business Partner' }
];

interface Designation {
    title: string;
    abbreviation: string;
}

const designations: Designation[] = [
    { title: 'Assistant Manager', abbreviation: 'AM' },
    { title: 'Senior Manager', abbreviation: 'Sr.M' },
    { title: 'Assistant General Manager', abbreviation: 'AGM' },
    { title: 'General Manager', abbreviation: 'GM' },
    { title: 'Deputy Manager', abbreviation: 'DM' },
    { title: 'Deputy General Manager', abbreviation: 'Dy.GM' },
    { title: 'Vice President', abbreviation: 'VP' },
    { title: 'Director', abbreviation: 'Director' },
    { title: 'Director/Owner', abbreviation: 'Director/Owner' },
    { title: 'Owner', abbreviation: 'Owner' },
    { title: 'Senior Engineer', abbreviation: 'Sr.Engineer' },
    { title: 'Executive', abbreviation: 'EX' },
    { title: 'Senior Executive', abbreviation: 'Sr.EX' }
];

interface ActivityOptions {
    type: string;
}

const activityOptions: ActivityOptions[] = [
    { type: 'Campaign' },
    { type: 'Cold Call' },
    { type: 'Sales Call' },
    { type: 'Share Company Profile' },
    { type: 'Introducing Meeting' },
    { type: 'Demo' },
    { type: ' Quotation Submission' },
    { type: 'Q.Follow-Up' },
    { type: 'Objection Handling' },
    { type: 'OH.Follow-Up' },
    { type: 'Negotiation' },
    { type: 'N.Follow-Up' },
    { type: 'Close' },
    { type: 'C.Follow-Up' },
    { type: 'Repeat Sales' },
    { type: ' R.Follow-Up' },
    { type: ' R.Close' },
    { type: 'Up/Cross Sales' },
    { type: 'U.C Follow-Up' },
    { type: '   U.C Close' },
    { type: ' RelationShip Maintenance' },

];



const TargetEditForm = () => {

    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

     
    const [currentDate, setCurrentDate] = useState<string>('');
    useEffect(() => {
        // Set initial date on component mount
        const date = getCurrentDate();
        setCurrentDate(date);
    }, []);

    const user = useSelector((state: RootState) => state.targetFetchUserByid.selectedUser);
    console.log(user)
    const authToken = useSelector((state: RootState) => state.refreshTokenAuth);


    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const data = useSelector((state: RootState) => state.targetEditForm.response);
    console.log(data)
    console.log(isFormSubmitted)

    const userDetails = useSelector((state: RootState) => state.userLoginAuth);
    console.log(userDetails.user.role)
    const navigate = useNavigate();
    useEffect(() => {
        if (isFormSubmitted) {
            if (data?.message === 'Success') {
              console.log(data);
              dispatch(clearTargetEditData());
              alert('Target form editted successfully!');
              if(userDetails.user.role === 'admin' ){
                navigate('/adminDashboard');
            }else{
                navigate('/userDashboard');
            }
              setIsFormSubmitted(false);
            } else if (data?.message === 'Failed') {
              console.log(data.message);
              alert('Target form failed to edit.');
              dispatch(clearTargetEditData());
              setIsFormSubmitted(false);
            }
            console.log(data)
            // Reset the form submission state
          
          }
      }, [isFormSubmitted, data, dispatch, navigate]);

    const [formData, setFormData] = useState<FormData>({
        id: '',
        account_holder: "",
        account_name: "",
        department: "",
        vertical: "",
        vertical_sub: "",
        pic: "",
        designation: "",
        business: "",
        activity: "",
        activity_date: "",
        next_action: "",
        remarks: "",
        next_action_date: "",
        region: "",
        mobile_number: "",
        email_id: "",
        location: "",
        state: "",
        city: "",
        address: "",
        acct_created_date: "",

    });
    // console.log(currentDate)

    useEffect(() => {
        if (!authToken) {
            dispatch(refreshTokenReq() as any);
        }
    }, [authToken, dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchTargetUserById(id) as any);
            setFormData(prevFormData => ({
                ...prevFormData,
                id: id,
            }));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (user) {
            setFormData(user);
            setSelectedCategory(user.vertical)
            setSelectedSubdivision(user.vertical_sub)
        }
    }, [user]);


    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubdivision, setSelectedSubdivision] = useState<string | null>(null);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
        const verticalsData = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            vertical: verticalsData
        }));
        setSelectedSubdivision(null); // Reset selected subdivision when category changes
    };

    const handleSubdivisionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubdivision(event.target.value);
        const data = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            vertical_sub: data
        }));
    };





   
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };
    console.log(formData)

    // Inside your functional component
    const remarksTextareaRef = useRef<HTMLTextAreaElement>(null);
    const addressTextareaRef = useRef<HTMLTextAreaElement>(null);

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
        if (remarksTextareaRef.current) {
            remarksTextareaRef.current.addEventListener('input', handleResize as any);
        }
        if (addressTextareaRef.current) {
            addressTextareaRef.current.addEventListener('input', handleResize as any);
        }

        // Cleanup event listeners
        return () => {
            if (remarksTextareaRef.current) {
                remarksTextareaRef.current.removeEventListener('input', handleResize as any);
            }
            if (addressTextareaRef.current) {
                addressTextareaRef.current.removeEventListener('input', handleResize as any);
            }
        };
    }, []);

    // const dispatch = useDispatch();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsFormSubmitted(true);
        dispatch(editTargetUser({formData}) as any);
    };

    return (
        <div className={styles.mainContainer}>

            <div className={styles.title}>Target Form</div>
            <div className={styles.formContainer}>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* <div>Account Form</div> */}
                    <div className={styles.leftContainer} >
                        {/* <input
                            type='text'
                            name='account_holder'
                            placeholder='Account Holder'
                            onChange={handleChange}
                            value={formData.account_holder}
                            className={styles.leftInput}
                        /> */}
                         <div className={styles.inputLeftGroup}>
                            <input
                                type='text'
                                name='account_holder'
                                // placeholder='Account Name'
                                className={styles.leftInputGroup}
                                onChange={handleChange}
                                value={formData.account_holder}
                                required
                            />
                            <label className={styles.leftlabel} htmlFor="account_name">Account Name</label>
                        </div>

                        {/* <input
                            type='text'
                            name='account_name'
                            placeholder='Account Name'
                            onChange={handleChange}
                            value={formData.account_name}
                            className={styles.leftInput}
                        /> */}
                         <div className={styles.inputLeftGroup}>
                            <input
                                type='text'
                                name='account_name'
                                // placeholder='Account Name'
                                className={styles.leftInputGroup}
                                onChange={handleChange}
                                value={formData.account_name}
                                required
                            />
                            <label className={styles.leftlabel} htmlFor="account_name">Account Name</label>
                        </div>


                        <div className={styles.subcontainer}>
                            <select
                                className={styles.leftSelect}
                                onChange={handleChange}
                                value={formData.department}
                                name='department'
                            >
                                <option value="">Select a department</option>
                                {departments.map((department, index) => (
                                    <option key={index} value={department.name}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>

                            <div className={styles.container}>
                                <select
                                    value={selectedCategory || ''}
                                    onChange={handleCategoryChange}
                                    className={styles.leftSelect}
                                >
                                    <option value="">Select vertical</option>
                                    {verticals.map((option, index) => (
                                        <option key={index} value={option.category}>
                                            {option.category}
                                        </option>
                                    ))}
                                </select>

                            </div>

                        </div>
                        {selectedCategory && verticals.find(option => option.category === selectedCategory)?.subdivisions && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedSubdivision || ''}
                                    onChange={handleSubdivisionChange}
                                    className={styles.leftSelect}
                                >

                                    <option value="">Select a subdivision</option>
                                    {verticals.find(option => option.category === selectedCategory)?.subdivisions?.map((subdivision, index) => (
                                        <option key={index} value={subdivision.category}>
                                            {subdivision.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}



                        <div className={styles.subcontainer}>
                            {/* <input
                                type='text'
                                name='pic'
                                placeholder='PIC'
                                onChange={handleChange}
                                value={formData.pic}
                                className={styles.PIC}
                            /> */}
                            <div className={styles.inputLeftGroup}>
                                <input
                                    type='text'
                                    name='pic'
                                    // placeholder='Account Name'
                                    className={styles.leftInputGroup}
                                    onChange={handleChange}
                                    value={formData.pic}
                                    required
                                />
                                <label className={styles.leftlabel} htmlFor="pic">PIC</label>
                            </div>

                            <select
                                className={styles.leftSelect}
                                onChange={handleChange}
                                value={formData.designation}
                                name='designation'
                            >

                                <option value="">Select a designation</option>
                                {designations.map((designation, index) => (
                                    <option key={index} value={designation.abbreviation}>
                                        {designation.title} ({designation.abbreviation})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <select
                            className={styles.leftSelect}
                            onChange={handleChange}
                            value={formData.business}
                            name='business'
                        >

                            <option value="">Select a business type</option>
                            {businessOptions.map((option, index) => (
                                <option key={index} value={option.type}>
                                    {option.type}
                                </option>
                            ))}
                        </select>
                        <div className={styles.subcontainer}>
                            <select
                                className={styles.leftSelect}
                                onChange={handleChange}
                                value={formData.activity}
                                name='activity'
                            >
                                <option value="">Select a Activity </option>
                                {activityOptions.map((option, index) => (
                                    <option key={index} value={option.type}>
                                        {option.type}
                                    </option>
                                ))}
                            </select>
                            <input
                                type='text'
                                name='activity_date'
                                placeholder='Activity Date'
                                disabled
                                value={formData.activity_date}
                                className={styles.PIC} />

                        </div>


                        <select
                            className={styles.leftSelect}
                            onChange={handleChange}
                            value={formData.next_action}
                            name='next_action'
                        >
                            <option value="">Select a Next Action </option>
                            {activityOptions.map((option, index) => (
                                <option key={index} value={option.type}>
                                    {option.type}
                                </option>
                            ))}
                        </select>
                        {/* <input
                            type='text'
                            name='remarks'
                            placeholder=' Remarks'
                            onChange={handleChange}
                            value={formData.remarks}
                            className={styles.PIC}
                        /> */}
                          <div className={styles.inputLeftGroup}>
                          <textarea
                                ref={remarksTextareaRef} // Add a ref for dynamic height adjustment
                                name='remarks'
                                className={styles.leftInputGroup}
                                onChange={handleChange}
                                value={formData.remarks || ''}
                                required
                                rows={1} // Initial minimum rows
                                style={{ resize: 'none', overflow: 'hidden' }} // Disable manual resizing, hide scrollbars
                            />
                            <label className={styles.leftlabel} htmlFor="remarks">Remarks</label>
                        </div>


                        <div className={styles.nextTimeContainer}>
                            <label className={styles.leftLabel}> Next Action Date : </label>

                            <input
                                type='date'
                                name='next_action_date'
                                placeholder=' Next Action Date'
                                onChange={handleChange}
                                value={formData.next_action_date}
                                className={styles.leftInput}
                            />

                        </div>



                    </div>
                    <div className={styles.rightContainer} >
                        <select
                            className={styles.rightSelect}
                            onChange={handleChange}
                            value={formData.region}
                            name='region'
                        >
                            <option value="">Select a region</option>
                            {regions.map((region, index) => (
                                <option key={index} value={region.name}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                        {/* <input
                            type='text'
                            name='mobile_number'
                            placeholder='Mobile Number'
                            onChange={handleChange}
                            value={formData.mobile_number}
                            className={styles.rightInput}
                        /> */}
                         <div className={styles.inputRightGroup}>
                            <input
                                type='text'
                                name='mobile_number'
                                // placeholder='Account Name'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.mobile_number}
                                required
                            />
                            <label className={styles.rightlabel} htmlFor="mobile_number">Mobile Number</label>
                        </div>

                        {/* <input
                            type='email'
                            name='email_id'
                            placeholder='Email ID'
                            onChange={handleChange}
                            value={formData.email_id}
                            className={styles.rightInput}
                        /> */}
                        <div className={styles.inputRightGroup}>
                            <input
                                type='email'
                                name='email_id'
                                // placeholder='Account Name'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.email_id}
                                required
                            />
                            <label className={styles.rightlabel} htmlFor="email_id">Email ID</label>
                        </div>

                        {/* <input
                            type='text'
                            name='location'
                            placeholder='Location'
                            onChange={handleChange}
                            value={formData.location}
                            className={styles.rightInput}
                        /> */}
                        <div className={styles.inputRightGroup}>
                            <input
                                type='text'
                                name='location'
                                // placeholder='Account Name'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.location}
                                required
                            />
                            <label className={styles.rightlabel} htmlFor="location">Location</label>
                        </div>


                        <input
                            type='text'
                            name='state'
                            placeholder='state'
                            onChange={handleChange}
                            value={formData.state}
                            className={styles.rightInput}
                        />

                        <input
                            type='text'
                            name='city'
                            placeholder='city'
                            onChange={handleChange}
                            value={formData.city}
                            className={styles.rightInput}
                        />

                        {/* <input
                            type='text'
                            name='address'
                            placeholder='address'
                            onChange={handleChange}
                            value={formData.address}
                            className={styles.rightInput}
                        /> */}
                         <div className={styles.inputRightGroup}>
                         <textarea
                                ref={addressTextareaRef} // Add a ref for dynamic height adjustment
                                name='address'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.address || ''}
                                required
                                rows={1} // Initial minimum rows
                                style={{ resize: 'none', overflow: 'hidden' }} // Disable manual resizing, hide scrollbars
                            />
                            <label className={styles.rightlabel} htmlFor="address">Address</label>
                        </div>

                        <input
                            type='text'
                            name='acct_created_date'
                            placeholder='Account Created Date'
                            className={styles.rightInput}
                            value={formData.acct_created_date}
                            disabled
                        />

                        <button type='submit' className={styles.button}>submit</button>
                    </div>

                </form>
            </div>
        </div>

    )

}

export default TargetEditForm
