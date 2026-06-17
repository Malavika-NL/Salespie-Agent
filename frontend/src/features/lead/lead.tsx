import styles from './lead.module.css'
import { useState, useEffect, useRef } from 'react';
import { getCurrentDate } from '../currentDate/date'
import { useDispatch, useSelector } from 'react-redux'
import { leadForm , clearLeadData } from './slice/leadFormSlice';
import { getUserDetails } from './slice/leadFormSlice';
import type { RootState } from '../../app/store';
import { refreshTokenReq } from '../Authslice/refreshToken';
import { calculateTotal } from '../CalculateTotalAmount/totalAmount';
import { useNavigate } from 'react-router-dom';
import { fetchAccountFormSettings } from '../FormSettings/formSettingsSlice';
import { getAllCities } from '../CommonAPI/Common';

interface Option {
    category: string;
    subdivisions?: Option[];
}
interface User {
    username: string;
    // Add other properties of the user object if needed
  }

const opportunities: Option[] = [
    {
        category: 'Printer'
    },
    {
        category: 'Scanner'
    },
    {
        category: 'HHT'
    },
    {
        category: 'Consumables',
        subdivisions: [
            { category: 'Label' },
            { category: 'Ribbon' }
        ]
    },
    {
        category: 'Software'
    },
    {
        category: 'Automation'
    }
];


interface Option {
    category: string;
    subdivisions?: Option[];
}

const makes: Option[] = [
    {
        category: 'Printer',
        subdivisions: [
            { category: 'Zebra' },
            { category: 'Sato' },
            { category: 'Argox' },
            { category: 'Godex' },
            { category: 'Bixolon' },
            { category: 'TSC' },
            { category: 'Printronix' },
            { category: 'Others' }
        ]
    },
    {
        category: 'Scanners',
        subdivisions: [
            { category: 'Zebra' },
            { category: 'Honey Well' },
            { category: 'Argox' }
        ]
    },
    {
        category: 'HHT',
        subdivisions: [
            { category: 'Zebra' },
            { category: 'Seuic' },
            { category: 'Cipherlab' }
        ]
    },
    {
        category: 'Consumables',
        subdivisions: [
            {
                category: 'Label', subdivisions: [
                    {
                        category: 'Paper', subdivisions: [
                            { category: 'Normal Chrome' },
                            { category: 'AD Chrome' }
                        ]
                    },
                    { category: 'Polyster' },
                    { category: 'Tafatta' },
                    { category: 'PET' },
                    { category: 'PP' }
                ]
            },
            {
                category: 'Ribbon', subdivisions: [
                    {
                        category: 'Wax', subdivisions: [
                            { category: 'Economical' },
                            { category: 'Standard' },
                            { category: 'Premium' }
                        ]
                    },
                    {
                        category: 'Wax Resin', subdivisions: [
                            { category: 'Economical' },
                            { category: 'Standard' },
                            { category: 'Premium' }
                        ]
                    },
                    {
                        category: 'Resin', subdivisions: [
                            { category: 'Economical' },
                            { category: 'Standard' },
                            { category: 'Premium' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        category: 'Software',
        subdivisions: [
            { category: 'WMS Solution' },
            { category: 'WIP Solution' },
            { category: 'Asset Management Solution' },
            { category: 'Life Science Solutions' },
            { category: 'Printing Software' },
            { category: 'Scanning Software' },
            { category: 'RFID Truck management solutions' },
            { category: 'Customised software' }
        ]
    },
    {
        category: 'Automation',
        subdivisions: [
            { category: 'Line Automation' },
            { category: 'Visual Inspection System' },
            { category: 'Poka Yoke System' },
            { category: 'Print and Apply System' },
            { category: 'Conveyor Scanning' },
            { category: 'Direct part Marking' },
            { category: 'SPM' },
            { category: 'Vision Guided Robots' }
        ]
    }
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

const stages: string[] = ['Rank A', 'Rank B', 'Rank C', 'Rank D', 'Omitted/Lost'];


const lostReasons: string[] = ['Competitive Price', 'Less Knowledge/ Know how', 'Lack of Services', 'Late Participation', 'Out of Scope project', 'Project Cancellation'];

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


interface FormData {
    account_holder: string;
    account_name: string;
    department: string;
    opportunity: string;
    make: string;
    sub_make: string;
    sub_make_brand: string;
    pic: string;
    contact_person: string;
    designation: string;
    mobile_number: string;
    region: string;
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
    remarks: string;
    stage: string;
    lost_reason: string;
    hardware_amount: number;
    software_amount: number;
    consumables_amount: number;
    automation_amount: number;
    solution_amount: number;
    maintenance_amount: number;
    others_amount: number;
    total_amount: number;
    assigned_to: string;
}


const LeadForm = () => {
    const [isFocused, setIsFocused] = useState(false);
    const dispatch = useDispatch();

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const data = useSelector((state: RootState) => state.leadForm.data);
    const accountFormSettings = useSelector((state: RootState) => state.formSettings.account);
    const opportunityOptions: Option[] = (accountFormSettings.productCategories?.length
        ? accountFormSettings.productCategories
        : (accountFormSettings.leadHierarchy?.length ? accountFormSettings.leadHierarchy : makes)) as Option[];
    const departmentOptions = accountFormSettings.departments?.length ? accountFormSettings.departments.map((name) => ({ name })) : departments;
    const designationOptions = accountFormSettings.designations?.length ? accountFormSettings.designations : designations;
    const regionOptions = accountFormSettings.regions?.length ? accountFormSettings.regions.map((name) => ({ name })) : regions;
    const cityOptions = accountFormSettings.cities || [];
    const stateOptions = accountFormSettings.states || [];
    console.log(data)

    const navigate = useNavigate();
    // useEffect(() => {
    //     if (isFormSubmitted && data?.message === 'Success')  {
    //         console.log(data)
    //       dispatch(clearLeadData());
    //       alert(' Lead form submitted successfully !');
    //       navigate('/adminDashboard');
          
    //       setIsFormSubmitted(false); 
    //     }
    //     if (isFormSubmitted && data?.message === ' not Success'){
    //         alert(' Lead form not submitted ');
    //         navigate('/adminDashboard');
    //     }
    //   }, [ isFormSubmitted,data]);
    const userDetails = useSelector((state: RootState) => state.userLoginAuth);
    console.log(userDetails.user.role)
    useEffect(() => {
        if (isFormSubmitted) {
          if (data?.message === 'Success') {
            console.log(data);
            dispatch(clearLeadData());
            alert('Lead form submitted successfully!');
            if(userDetails.user.role === 'admin' ){
                navigate('/adminDashboard');
            }else{
                navigate('/userDashboard');
            }
         
            setIsFormSubmitted(false);
          } else if (data?.message === 'Failed') {
            console.log(data.message);
            alert('Lead form Failed to  submitted.');
            setIsFormSubmitted(false);
            // Optionally handle failure state or additional logic here
          }
          // Reset the form submission state
        
        }
      }, [isFormSubmitted, data, dispatch, navigate]);


    const [currentDate, setCurrentDate] = useState<string>('');

    useEffect(() => {
        // Set initial date on component mount
        const date = getCurrentDate();
        setCurrentDate(date);
    }, []);

    const authToken = useSelector((state: RootState) => state.refreshTokenAuth);
    useEffect(() => {
        if (!authToken) {
            dispatch(refreshTokenReq() as any);
        }
    }, [authToken, dispatch]);

    useEffect(() => {
        dispatch(fetchAccountFormSettings() as any);
    }, [dispatch]);


    useEffect(() => {
        dispatch(getUserDetails() as any);
    }, []);

    const userData = useSelector((state: RootState) => state.getUserData.userData);
    console.log(userData)
    useEffect(() => {

        dispatch(getUserDetails() as any);
        setFormData(prevFormData => ({
            ...prevFormData,

        }));

    }, []);


    const [formData, setFormData] = useState<FormData>({
        account_holder: "",
        account_name: "",
        opportunity: "",
        make: "",
        sub_make: "",
        sub_make_brand: "",
        pic: "",
        contact_person: "",
        designation: "",
        department: "",
        mobile_number: "",
        region: "",
        email_id: "",
        location: "",
        state: "",
        city: "",
        address: "",
        opportunity_description: "",
        qty: "",
        exp_closure_date: "",
        exp_po_date: "",
        remarks: "",
        stage: "",
        lost_reason: "",
        hardware_amount: 0,
        software_amount: 0,
        consumables_amount: 0,
        automation_amount: 0,
        solution_amount: 0,
        maintenance_amount: 0,
        others_amount: 0,
        total_amount: 0,
        assigned_to: "",
        values: "",
    });
    const stateMappedCities = formData.state
        ? (accountFormSettings.stateCities?.[formData.state] || [])
        : [];
    const autoStateCities = formData.state ? getAllCities(formData.state).map((c) => c.name) : [];
    const filteredCityOptions = formData.state
        ? Array.from(new Set([...stateMappedCities, ...autoStateCities]))
        : cityOptions;


    console.log(formData)
    const [totalAmount, setTotalAmount] = useState(0);
    useEffect(() => {
        const amountsToCalculate = {
            hardware_amount: formData.hardware_amount,
            software_amount: formData.software_amount,
            consumables_amount: formData.consumables_amount,
            automation_amount: formData.automation_amount,
            solution_amount: formData.solution_amount,
            maintenance_amount: formData.maintenance_amount,
            others_amount: formData.others_amount,
        };
        const total = calculateTotal(amountsToCalculate);

        setTotalAmount(total);
        console.log(typeof total)

    }, [formData]);
    console.log(totalAmount)

    useEffect(() => {

        setFormData(prevFormData => ({
            ...prevFormData,
            total_amount: totalAmount,
        }));
    }, [totalAmount]);

  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
            ...(name === 'state' ? { city: '' } : {})
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



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(leadForm(formData) as any);
        setIsFormSubmitted(true);

    };

    //opportuntiy

    const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);


    const handleOpportunityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOpportunity(event.target.value);
        const data = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            opportunity: data,
        }));
        setSelectedSubOption(null); // Reset selected sub-option
    };




    //make


    const [selectedMake, setSelectedMake] = useState<string | null>(null);
    const [selectedSubOption, setSelectedSubOption] = useState<string | null>(null);
    const [selectedSubSubOption, setSelectedSubSubOption] = useState<string | null>(null);

    const handleMakeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMake(event.target.value);
        const data = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            make: data,
        }));
        setSelectedSubOption(null);
        setSelectedSubSubOption(null);
    };

    const handleMakeSubOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubOption(event.target.value);
        const data = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            sub_make: data,
        }));
        setSelectedSubSubOption(null);
    };

    const handleSubSubOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubSubOption(event.target.value);
        const data = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            sub_make_brand: data,
        }));
    };



    //stages

    const [selectedStage, setSelectedStage] = useState<string | null>(null);

    const handleStageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStage(event.target.value);
        const data = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            stage: data,
        }));
    };


    // lost reasons

    const [selectedLostReason, setSelectedLostReason] = useState<string | null>(null);

    const handleLostReasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLostReason(event.target.value);
        const data = event.target.value
        setFormData(prevFormData => ({
            ...prevFormData,
            lost_reason: data,
        }));




    };

    return (
        <div className={styles.mainContainer}>

            <div className={styles.title}>Lead Form</div>
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

                        <select
                            className={styles.leftSelect}
                            onChange={handleChange}
                            value={formData.department}
                            name='department'
                        >
                            <option value="">Select a department</option>

                            {departmentOptions.map((department, index) => (
                                <option key={index} value={department.name}>
                                    {department.name}
                                </option>
                            ))}

                        </select>

                        <div className={styles.subcontainer}>
                            <select
                                value={selectedOpportunity || ''}
                                onChange={handleOpportunityChange}
                                className={styles.leftSelect}
                            >
                                <option value="">Select  Opportunity</option>
                                {opportunityOptions.map((option, index) => (
                                    <option key={index} value={option.category}>
                                        {option.category}
                                    </option>
                                ))}
                            </select>


                            {/* Subdivision selection */}
                            {selectedOpportunity && opportunityOptions.find(option => option.category === selectedOpportunity)?.subdivisions && (
                                <div className={styles.subSelectContainer}>
                                    <select
                                        value={selectedMake || ''}
                                        onChange={handleMakeChange}
                                        className={styles.leftSelect}
                                    >
                                        <option value="">Select make</option>
                                        {opportunityOptions.find(option => option.category === selectedOpportunity)?.subdivisions?.map((subOption, index) => (
                                            <option key={index} value={subOption.category}>
                                                {subOption.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}


                        </div>
                        {/* Sub-subdivision selection */}
                        {selectedMake && opportunityOptions.find(option => option.category === selectedOpportunity)?.subdivisions?.find(subOption => subOption.category === selectedMake)?.subdivisions && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedSubOption || ''}
                                    onChange={handleMakeSubOptionChange}
                                    className={styles.leftSelect}
                                >
                                    <option value="">Select a sub-make</option>
                                    {opportunityOptions.find(option => option.category === selectedOpportunity)?.subdivisions?.find(subOption => subOption.category === selectedMake)?.subdivisions?.map((subSubOption, index) => (
                                        <option key={index} value={subSubOption.category}>
                                            {subSubOption.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}


                        {/* Sub-make brand selection */}
                        {selectedSubOption && opportunityOptions.find(option => option.category === selectedOpportunity)?.subdivisions?.find(subOption => subOption.category === selectedMake)?.subdivisions?.find(subSubOption => subSubOption.category === selectedSubOption)?.subdivisions && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedSubSubOption || ''}
                                    onChange={handleSubSubOptionChange}
                                    className={styles.leftSelect}
                                >
                                    <option value="">Select a sub-make brand</option>
                                    {opportunityOptions.find(option => option.category === selectedOpportunity)?.subdivisions?.find(subOption => subOption.category === selectedMake)?.subdivisions?.find(subSubOption => subSubOption.category === selectedSubOption)?.subdivisions?.map((subSubSubOption, index) => (
                                        <option key={index} value={subSubSubOption.category}>
                                            {subSubSubOption.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* {selectedSubOption && makes.find(option => option.category === selectedMake)?.subdivisions?.find(subOption => subOption.category === selectedSubOption)?.subdivisions && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedSubSubOption || ''}
                                    onChange={handleSubSubOptionChange}
                                    className={styles.leftSelect}
                                >

                                    <option value=""> Select </option>
                                    {makes.find(option => option.category === selectedMake)?.subdivisions?.find(subOption => subOption.category === selectedSubOption)?.subdivisions?.map((subSubOption, index) => (
                                        <option key={index} value={subSubOption.category}>
                                            {subSubOption.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )} */}
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
                        <div className={styles.subcontainer}>
                            {/* <input type='text'
                                name='contact_person'
                                placeholder='contact'
                                onChange={handleChange}
                                value={formData.contact_person}
                                className={styles.PIC}
                            /> */}

                            <div className={styles.inputLeftGroup}>
                                <input
                                    type='text'
                                    name='contact_person'
                                    // placeholder='Account Name'
                                    className={styles.leftInputGroup}
                                    onChange={handleChange}
                                    value={formData.contact_person}
                                    required
                                />
                                <label className={styles.leftlabel} htmlFor="contact_person">Contact</label>
                            </div>


                            <select
                                className={styles.leftSelect}
                                onChange={handleChange}
                                value={formData.designation}
                                name='designation'
                            >
                                <option value=""> Designation </option>
                                {designationOptions.map((designation, index) => (
                                    <option key={index} value={designation.abbreviation}>
                                        {designation.title} ({designation.abbreviation})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.subcontainer}>
                            {/* <input
                                type='text'
                                name='opportunity_description'
                                placeholder='Opportunity descripty '
                                onChange={handleChange}
                                value={formData.opportunity_description}
                                className={styles.PIC}
                            /> */}

                            <div className={styles.inputLeftGroup}>
                                <input
                                    type='text'
                                    name='opportunity_description'
                                    // placeholder='Account Name'
                                    className={styles.leftInputGroup}
                                    onChange={handleChange}
                                    value={formData.opportunity_description}
                                    required
                                />
                                <label className={styles.leftlabel} htmlFor="Opportunity descripty">PIC</label>
                            </div>

                            {/* <input
                                type='text'
                                name='qty'
                                placeholder='Quantity Value'
                                onChange={handleChange}
                                value={formData.qty}
                                className={styles.PIC}
                            /> */}


                            <div className={styles.inputLeftGroup}>
                                <input
                                    type='text'
                                    name='qty'
                                    // placeholder='Account Name'
                                    className={styles.leftInputGroup}
                                    onChange={handleChange}
                                    value={formData.qty}
                                    required
                                />
                                <label className={styles.leftlabel} htmlFor="qty">Quantity</label>
                            </div>

                        </div>
                        {/* <input
                            type='text'
                            name='remarks'
                            placeholder='Remarks  '
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


                        <div className={styles.subcontainer}>

                            <select
                                value={selectedStage || ''}
                                onChange={handleStageChange}
                                className={styles.leftSelect}
                            >

                                <option value=""> Stage </option>
                                {stages.map((stage, index) => (
                                    <option key={index} value={stage}>
                                        {stage}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedLostReason || ''}
                                onChange={handleLostReasonChange}
                                className={styles.leftSelect}
                            >

                                <option value=""> lost reason </option>
                                {lostReasons.map((reason, index) => (
                                    <option key={index} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
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
                            {regionOptions.map((region, index) => (
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
                            list='state-options'
                            placeholder='state'
                            onChange={handleChange}
                            value={formData.state}
                            className={styles.rightInput}
                        />
                        <datalist id='state-options'>
                            {stateOptions.map((state, index) => (
                                <option key={index} value={state} />
                            ))}
                        </datalist>

                        <input
                            type='text'
                            name='city'
                            list='city-options'
                            placeholder='city'
                            onChange={handleChange}
                            value={formData.city}
                            className={styles.rightInput}
                        />
                        <datalist id='city-options'>
                            {filteredCityOptions.map((city, index) => (
                                <option key={index} value={city} />
                            ))}
                        </datalist>

                        {/* <input
                            type='text'
                            name='address'
                            placeholder='Address'
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

                        <div className={styles.datecontainer}>
                            <label className={styles.leftLabel}> Exp closuer Date  : </label>
                            <input
                                type='date'
                                name='exp_closure_date'
                                placeholder='Exp closuer Date  '
                                onChange={handleChange}
                                value={formData.exp_closure_date}
                                className={styles.rightInput}
                            />

                        </div>
                        <div className={styles.datecontainer}>
                            <label className={styles.leftLabel}> Exp Po Date : </label>
                            <input
                                type='date'
                                name='exp_po_date'
                                placeholder='Exp Po Date '
                                onChange={handleChange}
                                value={formData.exp_po_date}
                                className={styles.rightInput}
                            />

                        </div>

                        <div className={styles.subThreeContainer}>
                            {/* <input
                                type='text'
                                name='hardware_amount'
                                placeholder='Hardware Amount   '
                                onChange={handleChange}
                                value={formData.hardware_amount}
                                className={styles.rightInput}
                            /> */}
                            <div className={styles.inputRightGroup}>
                                <input
                                    type='number'
                                    name='hardware_amount'
                                    // placeholder='Account Name'
                                    className={styles.rightInputGroup}
                                    onChange={handleChange}
                                    value={formData.hardware_amount === 0 ? '' : formData.hardware_amount}
                                    required
                                />
                                <label className={styles.rightlabel} htmlFor="hardware_amount">Hardware Amount </label>
                            </div>

                            {/* <input
                                type='text'
                                name='software_amount'
                                placeholder='Software Amount '
                                onChange={handleChange}
                                value={formData.software_amount}
                                className={styles.rightInput}
                            /> */}
                            <div className={styles.inputRightGroup}>
                                <input
                                    type='number'
                                    name='software_amount'
                                    // placeholder='Account Name'
                                    className={styles.rightInputGroup}
                                    onChange={handleChange}
                                    value={formData.software_amount === 0 ? '' : formData.software_amount}
                                    required
                                />
                                <label className={styles.rightlabel} htmlFor="software_amount">Software  Amount </label>
                            </div>


                            {/* <input
                                type='text'
                                name='consumables_amount'
                                placeholder='Consumables Amount '
                                onChange={handleChange}
                                value={formData.consumables_amount}
                                className={styles.rightInput}
                            /> */}
                            <div className={styles.inputRightGroup}>
                                <input
                                    type='number'
                                    name='consumables_amount'
                                    // placeholder='Account Name'
                                    className={styles.rightInputGroup}
                                    onChange={handleChange}
                                    value={formData.consumables_amount === 0 ? '' : formData.consumables_amount}
                                    required
                                />
                                <label className={styles.rightlabel} htmlFor="consumables_amount">Consumables  Amount </label>
                            </div>

                        </div>

                        <div className={styles.subFourContainer}>
                            {/* <input
                                type='text'
                                name='automation_amount'
                                placeholder='Automation Amount   '
                                onChange={handleChange}
                                value={formData.automation_amount}
                                className={styles.rightInput}
                            /> */}
                            <div className={styles.inputRightGroup}>
                                <input
                                    type='number'
                                    name='automation_amount'
                                    // placeholder='Account Name'
                                    className={styles.rightInputGroup}
                                    onChange={handleChange}
                                    value={formData.automation_amount === 0 ? '' : formData.automation_amount}
                                    required
                                />
                                <label className={styles.rightlabel} htmlFor="automation_amount">Automation  Amount </label>
                            </div>

                            {/* <input
                                type='text'
                                name='solution_amount'
                                placeholder='Solution Amount '
                                onChange={handleChange}
                                value={formData.solution_amount}
                                className={styles.rightInput}
                            /> */}

                            <div className={styles.inputRightGroup}>
                                <input
                                    type='number'
                                    name='solution_amount'
                                    // placeholder='Account Name'
                                    className={styles.rightInputGroup}
                                    onChange={handleChange}
                                    value={formData.solution_amount === 0 ? '' : formData.solution_amount}
                                    required
                                />
                                <label className={styles.rightlabel} htmlFor="solution_amount">Solution  Amount </label>
                            </div>

                            {/* <input
                                type='text'
                                name='maintenance_amount'
                                placeholder='Maintanance Amount '
                                onChange={handleChange}
                                value={formData.maintenance_amount}
                                className={styles.rightInput}
                                 /> */}
                            <div className={styles.inputRightGroup}>
                                <input
                                    type='number'
                                    name='maintenance_amount'
                                    // placeholder='Account Name'
                                    className={styles.rightInputGroup}
                                    onChange={handleChange}
                                    value={formData.maintenance_amount === 0 ? '' : formData.maintenance_amount}
                                    required
                                />
                                <label className={styles.rightlabel} htmlFor="maintenance_amount">Maintanance  Amount </label>
                            </div>

                            {/* <input
                                type='text'
                                name='others_amount'
                                placeholder='Other Amount '
                                onChange={handleChange}
                                value={formData.others_amount}
                                className={styles.rightInput}
                            /> */}
                            <div className={styles.inputRightGroup}>
                                <input
                                    type='number'
                                    name='others_amount'
                                    // placeholder='Account Name'
                                    className={styles.rightInputGroup}
                                    onChange={handleChange}
                                    value={formData.others_amount === 0 ? '' : formData.others_amount}
                                    required
                                />
                                <label className={styles.rightlabel} htmlFor="others_amount">Other  Amount </label>
                            </div>



                        </div>

                        {/* <input
                            type='text'
                            name='total_amount'
                            placeholder='Total Amount  '
                            onChange={handleChange}
                            value={formData.total_amount}
                            className={styles.rightInput}
                        /> */}

                        <div className={styles.inputRightGroup}>
                            <input
                                type='number'
                                name='total_amount'
                                // placeholder='Account Name'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.total_amount === 0 ? '' : formData.total_amount}
                                required
                            />
                            <label className={styles.rightlabel} htmlFor="total_amount">Total amount </label>
                        </div>

                        {/* <input
                            type='text'
                            name='values'
                            placeholder=' values  '
                            onChange={handleChange}
                            value={formData.values}
                            className={styles.rightInput}

                        /> */}
                        <div className={styles.inputRightGroup}>
                            <input
                                type='text'
                                name='values'
                                // placeholder='Account Name'
                                className={styles.rightInputGroup}
                                onChange={handleChange}
                                value={formData.values}
                                required
                            />
                            <label className={styles.rightlabel} htmlFor="values"> Values</label>
                        </div>

                            {/* <select
                                className={styles.rightSelect}
                                onChange={handleChange}
                                value={formData.assigned_to}
                                name='assigned_to'
                            >
                                <option value="">Assigned to </option>
                                {userData && userData.map((users, index) => (
                                    <option key={index} value={users.username}>
                                        {users.username}
                                    </option>
                                ))}
                            </select> */}
                        <div className={styles.selectLeftGroup}>
                            <select
                                className={`${styles.rightGroupSelect} ${isFocused ? styles.rightSelectFocused : ''} ${formData.assigned_to ? styles.rightSelectNotEmpty : ''}`}
                                onChange={handleChange}
                                value={formData.assigned_to}
                                name='assigned_to'
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            >
                                <option value="">Assigned to</option>
                                {userData && userData.map((user : User, index ) => (
                                    <option key={index} value={user.username}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                            <label
                                className={`${styles.floatingLabel} ${isFocused || formData.assigned_to ? styles.floatingLabelActive : ''}`}
                                htmlFor="assigned_to"
                            >
                                Assigned to
                            </label>
                        </div>


                        <button className={styles.button}>submit</button>
                    </div>

                </form>
            </div>
        </div>

    )

}

export default LeadForm
