import styles from './leadFormEdit.module.css'
import { useState, useEffect, useRef } from 'react';
import { getCurrentDate } from '../currentDate/date'
import { useDispatch, useSelector } from 'react-redux'
import { editLeadUser } from './slice/editLead';
import { fetchLeadUserById } from './slice/editLead';
import type { RootState } from '../../app/store';
import { refreshTokenReq } from '../Authslice/refreshToken';
import { useParams } from 'react-router-dom';

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
    id:string;
    account_holder: string;
    account_name: string;
    department: string;
    opportunity: string;
    make: string | null;
    sub_make: string | null;
    sub_make_brand: string | null;
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
    remarks?: string | null;
    stage: string;
    lost_reason?: string | null;
    hardware_amount: string;
    software_amount: string;
    consumables_amount: string;
    automation_amount: string;
    solution_amount: string;
    maintenance_amount: string;
    others_amount: string;
    total_amount: string;
    assigned_to:string;
}


const LeadEditForm = () => {

    const dispatch = useDispatch();
    const { id } = useParams<{id : string}>();

    const user = useSelector((state: RootState) => state.leadFetchUserById.selectedUser);
    console.log(user)
    const authToken = useSelector((state: RootState) => state.refreshTokenAuth);


   
    useEffect(() => {
        if (!authToken) {
          dispatch(refreshTokenReq() as any);
        }
      }, [ authToken,dispatch]);

    const userData = useSelector((state: RootState) => state.getUserData.userData);
    console.log(userData)
    useEffect(() => {
        if (id) {
          dispatch(fetchLeadUserById(id) as any);
          setFormData(prevFormData => ({
            ...prevFormData,
           id:id,
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


   
    const [formData, setFormData] = useState<FormData>({
        id:"",
        account_holder: "",
        account_name: "",
        opportunity: "",
        make: "",
        sub_make: "",
        sub_make_brand: "",
        pic: "",
        contact_person: "",
        designation: "",
        department:"",
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
        hardware_amount: "",
        software_amount: "",
        consumables_amount: "",
        automation_amount: "",
        solution_amount: "",
        maintenance_amount: "",
        others_amount: "",
        total_amount: "",
        assigned_to: "",
        values:"",
    });
    

    console.log(formData)


    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };


    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(editLeadUser({formData}) as any);
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
                        <input
                            type='text'
                            name='account_holder'
                            placeholder='Account Holder'
                            onChange={handleChange}
                            value={formData.account_holder}
                            className={styles.leftInput}

                        />

                        <input
                            type='text'
                            name='account_name'
                            placeholder='Account Name'
                            onChange={handleChange}
                            value={formData.account_name}
                            className={styles.leftInput}
                        />

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

                        <div className={styles.subcontainer}>
                            <select
                                value={selectedOpportunity || ''}
                                onChange={handleOpportunityChange}
                                className={styles.leftSelect}
                            >
                                <option value="">Select  Opportunity</option>
                                {makes.map((option, index) => (
                                    <option key={index} value={option.category}>
                                        {option.category}
                                    </option>
                                ))}
                            </select>


                            {/* Subdivision selection */}
                            {selectedOpportunity && makes.find(option => option.category === selectedOpportunity)?.subdivisions && (
                                <div className={styles.subSelectContainer}>
                                    <select
                                        value={selectedMake || ''}
                                        onChange={handleMakeChange}
                                        className={styles.leftSelect}
                                    >
                                        <option value="">Select make</option>
                                        {makes.find(option => option.category === selectedOpportunity)?.subdivisions?.map((subOption, index) => (
                                            <option key={index} value={subOption.category}>
                                                {subOption.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}


                        </div>
                        {/* Sub-subdivision selection */}
                        {selectedMake && makes.find(option => option.category === selectedOpportunity)?.subdivisions?.find(subOption => subOption.category === selectedMake)?.subdivisions && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedSubOption || ''}
                                    onChange={handleMakeSubOptionChange}
                                    className={styles.leftSelect}
                                >
                                    <option value="">Select a sub-make</option>
                                    {makes.find(option => option.category === selectedOpportunity)?.subdivisions?.find(subOption => subOption.category === selectedMake)?.subdivisions?.map((subSubOption, index) => (
                                        <option key={index} value={subSubOption.category}>
                                            {subSubOption.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}


                        {/* Sub-make brand selection */}
                        {selectedSubOption && makes.find(option => option.category === selectedOpportunity)?.subdivisions?.find(subOption => subOption.category === selectedMake)?.subdivisions?.find(subSubOption => subSubOption.category === selectedSubOption)?.subdivisions && (
                            <div className={styles.subSelectContainer}>
                                <select
                                    value={selectedSubSubOption || ''}
                                    onChange={handleSubSubOptionChange}
                                    className={styles.leftSelect}
                                >
                                    <option value="">Select a sub-make brand</option>
                                    {makes.find(option => option.category === selectedOpportunity)?.subdivisions?.find(subOption => subOption.category === selectedMake)?.subdivisions?.find(subSubOption => subSubOption.category === selectedSubOption)?.subdivisions?.map((subSubSubOption, index) => (
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
                        <input
                            type='text'
                            name='pic'
                            placeholder='PIC'
                            onChange={handleChange}
                            value={formData.pic}
                            className={styles.PIC}
                        />

                        <div className={styles.subcontainer}>
                            <input type='text'
                                name='contact_person'
                                placeholder='contact'
                                onChange={handleChange}
                                value={formData.contact_person}
                                className={styles.PIC}
                            />

                            <select
                                className={styles.leftSelect}
                                onChange={handleChange}
                                value={formData.designation}
                                name='designation'
                            >
                                <option value=""> Designation </option>
                                {designations.map((designation, index) => (
                                    <option key={index} value={designation.abbreviation}>
                                        {designation.title} ({designation.abbreviation})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.subcontainer}>
                            <input
                                type='text'
                                name='opportunity_description'
                                placeholder='Opportunity descripty '
                                onChange={handleChange}
                                value={formData.opportunity_description}
                                className={styles.PIC}
                            />

                            <input
                                type='text'
                                name='qty'
                                placeholder='Quantity Value'
                                onChange={handleChange}
                                value={formData.qty}
                                className={styles.PIC}
                            />

                        </div>
                        <input
                            type='text'
                            name='remarks'
                            placeholder='Remarks  '
                            onChange={handleChange}
                            value={formData.remarks || ''}
                            className={styles.PIC}
                        />

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
                            {regions.map((region, index) => (
                                <option key={index} value={region.name}>
                                    {region.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type='text'
                            name='mobile_number'
                            placeholder='Mobile Number'
                            onChange={handleChange}
                            value={formData.mobile_number}
                            className={styles.rightInput}
                        />

                        <input
                            type='email'
                            name='email_id'
                            placeholder='Email ID'
                            onChange={handleChange}
                            value={formData.email_id}
                            className={styles.rightInput}
                        />

                        <input
                            type='text'
                            name='location'
                            placeholder='Location'
                            onChange={handleChange}
                            value={formData.location}
                            className={styles.rightInput}
                        />

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

                        <input
                            type='text'
                            name='address'
                            placeholder='Address'
                            onChange={handleChange}
                            value={formData.address}
                            className={styles.rightInput}
                        />

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
                            <input
                                type='text'
                                name='hardware_amount'
                                placeholder='Hardware Amount   '
                                onChange={handleChange}
                                value={formData.hardware_amount}
                                className={styles.rightInput}
                            />

                            <input
                                type='text'
                                name='software_amount'
                                placeholder='Software Amount '
                                onChange={handleChange}
                                value={formData.software_amount}
                                className={styles.rightInput}
                            />

                            <input
                                type='text'
                                name='consumables_amount'
                                placeholder='Consumables Amount '
                                onChange={handleChange}
                                value={formData.consumables_amount}
                                className={styles.rightInput}
                            />
                        </div>

                        <div className={styles.subFourContainer}>
                            <input
                                type='text'
                                name='automation_amount'
                                placeholder='Automation Amount   '
                                onChange={handleChange}
                                value={formData.automation_amount}
                                className={styles.rightInput}
                            />

                            <input
                                type='text'
                                name='solution_amount'
                                placeholder='Solution Amount '
                                onChange={handleChange}
                                value={formData.solution_amount}
                                className={styles.rightInput}
                            />

                            <input
                                type='text'
                                name='maintenance_amount'
                                placeholder='Maintanance Amount '
                                onChange={handleChange}
                                value={formData.maintenance_amount}
                                className={styles.rightInput} />

                            <input
                                type='text'
                                name='others_amount'
                                placeholder='Other Amount '
                                onChange={handleChange}
                                value={formData.others_amount}
                                className={styles.rightInput}
                            />

                            
                        </div>

                        <input
                                type='text'
                                name='total_amount'
                                placeholder='Total Amount  '
                                onChange={handleChange}
                                value={formData.total_amount}
                                className={styles.rightInput}
                            />
        <input
                                type='text'
                                name='values'
                                placeholder=' values  '
                                onChange={handleChange}
                                value={formData.values}
                                className={styles.rightInput}
                                
                            />

<select
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
                        </select>


                        <button className={styles.button}>submit</button>
                    </div>

                </form>
            </div>
        </div>

    )

}

export default LeadEditForm
