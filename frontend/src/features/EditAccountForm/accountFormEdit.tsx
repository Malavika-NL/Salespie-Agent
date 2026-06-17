import styles from './accountFormEdit.module.css'
import { useState, useEffect, useRef } from 'react';
import { getCurrentDate } from '../currentDate/date'
import { useDispatch, useSelector } from 'react-redux'
import { editUser , clearAccountData } from './slice/accountFormEdit'
import type { RootState } from '../../app/store';
import { refreshTokenReq } from '../Authslice/refreshToken';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUserById } from './slice/accountFormEdit';

interface Vertical {
    category: string;
    subdivisions?: Vertical[];
}

const defaultVerticals: Vertical[] = [
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

const defaultRegions: Region[] = [
    { name: 'North' },
    { name: 'South' },
    { name: 'East' },
    { name: 'West' },
    { name: 'INT' }
];


interface Department {
    name: string;
}

const defaultDepartments: Department[] = [
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

const defaultBusinessOptions: BusinessOption[] = [
    { type: 'Direct Business' },
    { type: 'Business Partner' }
];

interface Designation {
    title: string;
    abbreviation: string;
}

const defaultDesignations: Designation[] = [
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


interface FormData {
    id: string;
    account_holder: string;
    account_name: string;
    department: string;
    vertical: string;
    vertical_sub: string | null;
    pic: string;
    designation: string;
    business: string;
    region: string
    mobile_number: string;
    email_id: string;
    location: string;
    state: string;
    city: string;
    address: string;
    acct_created_date: string;
    last_update_date: string;
    // user: string
}

interface Editdata {
    id: string;
    account_holder: string;
    account_name: string;
    department: string;
    vertical: string;
    vertical_sub: string | null;
    pic: string;
    designation: string;
    business: string;
    region: string
    mobile_number: string;
    email_id: string;
    location: string;
    state: string;
    city: string;
    address: string;
    acct_created_date: string;
    last_update_date: string;
    message: string;
}


const AccountEitForm = () => {
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();
    console.log(id)


// set current Date
    const [currentDate, setCurrentDate] = useState<string>('');
    useEffect(() => {
        // Set initial date on component mount
        const date = getCurrentDate();
        setCurrentDate(date);
    }, []);

    const Userdata = useSelector((state: RootState) => state.accountFetchUserByid.selectedUser);
    console.log(Userdata)
    const authToken = useSelector((state: RootState) => state.refreshTokenAuth);
    // const Editdata = useSelector((state: RootState) => state.accountEditForm.User);
    // console.log(Editdata)

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const data = useSelector((state: RootState) => state.accountEditForm.response);
    console.log(data)
    console.log(isFormSubmitted)

    const userDetails = useSelector((state: RootState) => state.userLoginAuth);
    const accountFormSettings = useSelector((state: RootState) => state.formSettings.account);
    const verticals = accountFormSettings.verticals?.length ? accountFormSettings.verticals : defaultVerticals;
    const regions = accountFormSettings.regions?.length
      ? accountFormSettings.regions.map((name) => ({ name }))
      : defaultRegions;
    const departments = accountFormSettings.departments?.length
      ? accountFormSettings.departments.map((name) => ({ name }))
      : defaultDepartments;
    const businessOptions = accountFormSettings.businessTypes?.length
      ? accountFormSettings.businessTypes.map((type) => ({ type }))
      : defaultBusinessOptions;
    const designations = accountFormSettings.designations?.length
      ? accountFormSettings.designations
      : defaultDesignations;
    const requiredFields = accountFormSettings.requiredFields || [];
    const isRequired = (field: string) => requiredFields.includes(field);
    console.log(userDetails.user.role)

    const navigate = useNavigate();
    useEffect(() => {
        if (isFormSubmitted) {
            
            if (data?.message === 'Success') {
              console.log(data);
              dispatch(clearAccountData());
              alert('Account form submitted successfully!');
              if(userDetails.user.role === 'admin' ){
                navigate('/adminDashboard');
            }else{
                navigate('/userDashboard');
            }
              setIsFormSubmitted(false);
            } else if (data?.message === 'Failed') {
              console.log(data.message);
              alert('Account form failed to submit.');
              dispatch(clearAccountData());
              setIsFormSubmitted(false);
            }
            console.log(data)
            // Reset the form submission state
          
          }
      }, [isFormSubmitted, data, dispatch, navigate]);
    // const [editResponse,setEditResponse] = useState<string | null>(Editdata);

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
        region: "",
        mobile_number: "",
        email_id: "",
        location: "",
        state: "",
        city: "",
        address: "",
        acct_created_date: "",
        last_update_date: '',
        // user: "",
    });

  


    useEffect(() => {
        if (!authToken) {
            dispatch(refreshTokenReq() as any);
        }
    }, [authToken, dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchUserById(id) as any);
            setFormData(prevFormData => ({
                ...prevFormData,
                id: id,
                
            }));
        }
    }, [dispatch, id]);

    // useEffect(() => {
    //     if (Userdata) {
    //         setFormData(Userdata);
    //         setSelectedCategory(Userdata.vertical)
    //         setSelectedSubdivision(Userdata.vertical_sub)
    //     }
    // }, [Userdata]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubdivision, setSelectedSubdivision] = useState<string | null>(null);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
        const verticalsData = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            vertical_sub: '',
            vertical: verticalsData
        }));
        setSelectedSubdivision(null); // Reset selected subdivision when category changes
    };

    const handleSubdivisionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubdivision(event.target.value);
        const subVerticalsData = event.target.value
        console.log(subVerticalsData)
        setFormData(prevFormData => ({
            ...prevFormData,
            vertical_sub: subVerticalsData
        }));
    };


    //Form Data



    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
            last_update_date : currentDate,

        }));
    };

    console.log(formData)

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset the height first
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to match scroll height
        }
    };

    // Run autoResize on every render when the address content changes
    useEffect(() => {
        autoResize();
    }, [formData.address]); // Only re-run when the address content changes

    // console.log(selectedCategory)
    const token = useSelector((state: RootState) => state.userLoginAuth.user.tokens);
    console.log(token)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submit')
        if (formData.vertical_sub === '') {
            setFormData(prevFormData => ({
                ...prevFormData,
                vertical_sub: null,
            }));
        }
        if (token) {
            setIsFormSubmitted(true);
            // dispatch(editUser({ formData }) as any);
            dispatch(refreshTokenReq() as any);
        } else {
            console.error("No token found");
        }
       
    };
    return (
        <div className={styles.mainContainer}>

            <div className={styles.title}>Account Form</div>
            <div className={styles.formContainer}>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* <div>Account Form</div> */}
                    <div className={styles.leftContainer} >
                        {/* <input
                            type='text'
                            name='account_holder'
                            placeholder='Account Holder'
                            className={styles.leftInput}
                            onChange={handleChange}
                            value={formData.account_holder}
                        /> */}

                        <div className={styles.inputLeftGroup}>
                            <input
                                type='text'
                                name='account_holder'
                                // placeholder='Account Name'
                                className={styles.leftInputGroup}
                                onChange={handleChange}
                                value={formData.account_holder}
                                required={isRequired('account_holder')}
                            />
                            <label className={styles.leftlabel} htmlFor="account_name">Account Name</label>
                        </div>

                        {/* <input
                            type='text'
                            name='account_name'
                            placeholder='Account Name'
                            className={styles.leftInput}
                            onChange={handleChange}
                            value={formData.account_name}
                        /> */}

                        <div className={styles.inputLeftGroup}>
                            <input
                                type='text'
                                name='account_name'
                                // placeholder='Account Name'
                                className={styles.leftInputGroup}
                                onChange={handleChange}
                                value={formData.account_name}
                                required={isRequired('account_name')}
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
                                    name='vertical'
                                    className={styles.leftSelect}

                                >
                                    <option value="">Select  Vertical</option>

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
                                    name='vertical_sub'
                                    className={styles.leftSelect}
                                >

                                    <option value="">Select  Sub-Vertical</option>
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
                                className={styles.PIC}
                                onChange={handleChange}
                                value={formData.pic}
                            /> */}

                            <div className={styles.inputLeftGroup}>
                                <input
                                    type='text'
                                    name='pic'
                                    // placeholder='Account Name'
                                    className={styles.leftInputGroup}
                                    onChange={handleChange}
                                    value={formData.pic}
                                    required={isRequired('pic')}
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
                            name='business'
                            value={formData.business}
                        >
                            <option value="">Select a business type</option>
                            {businessOptions.map((option, index) => (
                                <option key={index} value={option.type}>
                                    {option.type}
                                </option>
                            ))}

                        </select>
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
                            className={styles.rightInput}
                            onChange={handleChange}
                            value={formData.mobile_number}
                        /> */}
                        <div className={styles.inputRightGroup}>
                            <input
                                type='text'
                                name='mobile_number'
                                // placeholder='Account Name'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.mobile_number}
                                required={isRequired('mobile_number')}
                            />
                            <label className={styles.rightlabel} htmlFor="mobile_number">Mobile Number</label>
                        </div>


                        {/* <input
                            type='email'
                            name='email_id'
                            placeholder='Email ID'
                            className={styles.rightInput}
                            onChange={handleChange}
                            value={formData.email_id}
                        /> */}
                        <div className={styles.inputRightGroup}>
                            <input
                                type='email'
                                name='email_id'
                                // placeholder='Account Name'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.email_id}
                                required={isRequired('email_id')}
                            />
                            <label className={styles.rightlabel} htmlFor="email_id">Email ID</label>
                        </div>


                        {/* <input
                            type='text'
                            name='location'
                            placeholder='Location'
                            className={styles.rightInput}
                            onChange={handleChange}
                            value={formData.location}
                        /> */}
                        <div className={styles.inputRightGroup}>
                            <input
                                type='text'
                                name='location'
                                // placeholder='Account Name'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.location}
                                required={isRequired('location')}
                            />
                            <label className={styles.rightlabel} htmlFor="location">Location</label>
                        </div>

                        <input
                            type='text'
                            name='state'
                            placeholder='state'
                            className={styles.rightInput}
                            onChange={handleChange}
                            value={formData.state}
                        />

                        <input
                            type='text'
                            name='city'
                            placeholder='city'
                            className={styles.rightInput}
                            onChange={handleChange}
                            value={formData.city}
                        />

                        {/* <input
                            type='text'
                            name='address'
                            placeholder='Address'
                            className={styles.rightInput}
                            onChange={handleChange}
                            value={formData.address}
                        /> */}
                        <div className={styles.inputRightGroup}>
                        <textarea
                                ref={textareaRef}
                                name='address'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.address}
                                required={isRequired('address')}
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
                            // defaultValue={currentDate}
                            disabled
                        />



                        <button type='submit' className={styles.button}>submit</button>
                    </div>

                </form>
            </div>
        </div>

    )

}

export default AccountEitForm

