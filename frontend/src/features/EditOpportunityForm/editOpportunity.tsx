import styles from './editOpportunityForm.module.css'
import { useState, useEffect, useRef } from 'react';
import { getCurrentDate } from '../currentDate/date'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store';
import { refreshTokenReq } from '../Authslice/refreshToken';
import { editOpportunityUser, clearOpportunityEditData } from './slice/editOpportunity';
import { fetchOpportunityUserById } from './slice/editOpportunity';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAccountFormSettings } from '../FormSettings/formSettingsSlice';
import { buildOpportunityHierarchy, buildOpportunityNames } from '../FormSettings/opportunityOptions';
import { getAllCities, getAllStates } from '../CommonAPI/Common';

interface Option {
    category: string;
    subdivisions?: Option[];
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

interface Vertical {
    name: string;
}

const verticals: Vertical[] = [
    { name: 'Automotive' },
    { name: 'Transport & Logistics' },
    { name: 'E&E' },
    { name: 'Ecommerce' },
    { name: 'Health Care' },
    { name: 'Others' },
    
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



const OpportuntiyEditForm = () => {




    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();


    const [currentDate, setCurrentDate] = useState<string>('');
    useEffect(() => {
        // Set initial date on component mount
        const date = getCurrentDate();
        setCurrentDate(date);
    }, []);

    useEffect(() => {
        dispatch(fetchAccountFormSettings() as any);
    }, [dispatch]);

    const user = useSelector((state: RootState) => state.opportunityFetchUserById.selectedUser);
    console.log(user)
    const authToken = useSelector((state: RootState) => state.refreshTokenAuth);

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const data = useSelector((state: RootState) => state.opportunityEditForm.response);
    const accountFormSettings = useSelector((state: RootState) => state.formSettings.account);
    const departmentOptions = accountFormSettings.departments?.length ? accountFormSettings.departments.map((name) => ({ name })) : departments;
    const designationOptions = accountFormSettings.designations?.length ? accountFormSettings.designations : designations;
    const verticalOptions = accountFormSettings.verticals?.length ? accountFormSettings.verticals.map((v) => ({ name: v.category })) : verticals;
    const cityOptions = accountFormSettings.cities || [];
    const stateOptions = Array.from(
        new Set([
            ...(accountFormSettings.states || []),
            ...getAllStates().map((s) => s.name),
        ])
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    console.log(data)
    console.log(isFormSubmitted)


    const userDetails = useSelector((state: RootState) => state.userLoginAuth);
    console.log(userDetails.user.role)

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
    const stateMappedCities = formData.state
        ? (accountFormSettings.stateCities?.[formData.state] || [])
        : [];
    const autoStateCities = formData.state ? getAllCities(formData.state).map((c) => c.name) : [];
    const filteredCityOptions = (
        formData.state
            ? Array.from(new Set([...stateMappedCities, ...autoStateCities]))
            : cityOptions
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    const baseHierarchyOptions: Option[] = (accountFormSettings.productCategories?.length
        ? accountFormSettings.productCategories
        : (accountFormSettings.leadHierarchy?.length ? accountFormSettings.leadHierarchy : makes)) as Option[];
    const opportunityHierarchy = buildOpportunityHierarchy(baseHierarchyOptions, [
        formData.opportunity,
        formData.make,
        formData.sub_make,
        formData.sub_make_brand,
    ]) as Option[];
    const opportunityOptions = buildOpportunityNames(
        accountFormSettings.opportunities || [],
        opportunityHierarchy,
        formData.opportunity
    );
    const selectedOpportunityNode = opportunityHierarchy.find((option) => option.category === selectedOpportunity);
    const makeOptions = selectedOpportunityNode?.subdivisions || [];
    const selectedMakeNode = makeOptions.find((option) => option.category === selectedMake);
    const subMakeOptions = selectedMakeNode?.subdivisions || [];
    const selectedSubMakeNode = subMakeOptions.find((option) => option.category === selectedSubOption);
    const subMakeBrandOptions = selectedSubMakeNode?.subdivisions || [];


    useEffect(() => {
        if (!authToken) {
            dispatch(refreshTokenReq() as any);
        }
    }, [authToken, dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchOpportunityUserById(id) as any);
            setFormData(prevFormData => ({
                ...prevFormData,
                id: id,

            }));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (user) {
            setFormData(user);
            setSelectedStage(user.stage)
            setSelectedLostReason(user.lost_reason || null)
            setSelectedOpportunity(user.opportunity)
            setSelectedMake(user.make || null)
            setSelectedSubOption(user.sub_make || null)
            setSelectedSubSubOption(user.sub_make_brand || null)

        }
    }, [user]);




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

    const handleSubOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubOption(event.target.value);
    };



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




    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
            ...(name === 'state' ? { city: '' } : {})

        }));
    };
    console.log(formData)

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
        setIsFormSubmitted(true);
        dispatch(editOpportunityUser({ formData }) as any);
    };

    return (
        <div className={styles.mainContainer}>

            <div className={styles.title}>Opportuntiy Form</div>
            <div className={styles.formContainer}>

                <form className={styles.form} onSubmit={handleSubmit} >

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

                        <select
                            value={selectedOpportunity || ''}
                            onChange={handleOpportunityChange}
                            className={styles.leftSelect}
                        >
                            <option value="">Select  Opportunity</option>
                            {opportunityOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        {/* Subdivision selection */}
                        {selectedOpportunity && makeOptions.length > 0 && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedMake || ''}
                                    onChange={handleMakeChange}
                                    className={styles.leftSelect}
                                >
                                    <option value="">Select make</option>
                                    {makeOptions.map((subOption, index) => (
                                        <option key={index} value={subOption.category}>
                                            {subOption.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Sub-subdivision selection */}
                        {selectedMake && subMakeOptions.length > 0 && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedSubOption || ''}
                                    onChange={handleMakeSubOptionChange}
                                    className={styles.leftSelect}
                                >
                                    <option value="">Select a sub-make</option>
                                    {subMakeOptions.map((subSubOption, index) => (
                                        <option key={index} value={subSubOption.category}>
                                            {subSubOption.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Sub-make brand selection */}
                        {selectedSubOption && subMakeBrandOptions.length > 0 && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedSubSubOption || ''}
                                    onChange={handleSubSubOptionChange}
                                    className={styles.leftSelect}
                                >
                                    <option value="">Select a sub-make brand</option>
                                    {subMakeBrandOptions.map((subSubSubOption, index) => (
                                        <option key={index} value={subSubSubOption.category}>
                                            {subSubSubOption.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

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

                        <div className={styles.subcontainer}>
                            {/* <input
                                type='text'
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
                                name='designation'
                                onChange={handleChange}
                                value={formData.designation}
                                className={styles.leftSelect}
                            >

                                <option value="">Select a designation</option>
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

                        <div className={styles.subcontainer}>

                            <select
                                value={selectedStage || ''}
                                onChange={handleStageChange}
                                className={styles.leftSelect}
                            >

                                <option value="">Select a stage</option>
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

                                <option value="">Select a lost reason</option>
                                {lostReasons.map((reason, index) => (
                                    <option key={index} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* <input
                            type='text'
                            name='remarks'
                            placeholder='Remarks '
                            onChange={handleChange}
                            value={formData.remarks || ''}
                            className={styles.leftInput}

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


                        <select
                            className={styles.leftSelect}
                            onChange={handleChange}
                            value={formData.vertical || ""}
                            name='vertical'
                        >
                            <option value="">Select Vertical</option>

                            {verticalOptions.map((vertical, index) => (
                                <option key={index} value={vertical.name}>
                                    {vertical.name}
                                </option>
                            ))}

                        </select>

                    </div>
                    <div className={styles.rightContainer} >

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
                            type='text'
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
                            {/* <input type='text'
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

                            {/* 
                            <input
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
                            name='values'
                            placeholder='values '
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

                        {/* <input
                            type='text'
                            name='total_amount'
                            placeholder='Total amount '
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




                        <button type='submit' className={styles.button}>submit</button>
                    </div>

                </form>
            </div>
        </div>

    )

}

export default OpportuntiyEditForm




