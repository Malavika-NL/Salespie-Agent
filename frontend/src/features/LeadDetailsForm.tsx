// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Button, Card, Badge, InputGroup } from 'react-bootstrap';
// import { 
//     FaUserTie, FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, 
//     FaPlus, FaTrash, FaSave, FaIndustry, FaLaptopCode, FaHeartbeat, 
//     FaUserCog, FaCheckDouble, FaArrowLeft, FaCalendarAlt 
// } from 'react-icons/fa';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // --- TYPES ---
// interface PIC {
//     id: number;
//     name: string;
//     department: string;
//     designation: string;
//     email: string;
//     phone: string;
//     companyName: string;
//     location: string;
// }

// interface LeadData {
//     leadId: string;
//     accountName: string;
//     status: string;
//     vertical: string;
//     discussionPoints: string;
//     meetingDate: string;
//     pics: PIC[];
// }

// const LeadDetailsPro: React.FC = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const [activeTab, setActiveTab] = useState<'stakeholders' | 'notes'>('stakeholders');
//     const [validated, setValidated] = useState(false);

//     // --- STATE ---
//     const [leadData, setLeadData] = useState<LeadData>({
//         leadId: '',
//         accountName: '',
//         status: '',
//         vertical: '',
//         discussionPoints: '',
//         meetingDate: new Date().toISOString().split('T')[0],
//         pics: []
//     });

//     // --- MOCK FETCH ---
//     useEffect(() => {
//         setLeadData({
//             leadId: 'LEAD-8829',
//             accountName: 'Vertex Global Solutions',
//             status: 'Negotiation',
//             vertical: 'Manufacturing',
//             discussionPoints: '',
//             meetingDate: new Date().toISOString().split('T')[0],
//             pics: [{
//                 id: Date.now(),
//                 name: '',
//                 department: 'Production',
//                 designation: '',
//                 email: '',
//                 phone: '',
//                 companyName: 'Vertex Global Solutions',
//                 location: ''
//             }]
//         });
//     }, [id]);

//     // --- HANDLERS ---
//     const handlePICChange = (id: number, field: keyof PIC, value: string) => {
//         const updatedPics = leadData.pics.map((pic) => 
//             pic.id === id ? { ...pic, [field]: value } : pic
//         );
//         setLeadData({ ...leadData, pics: updatedPics });
//     };

//     const addPIC = () => {
//         const newPic: PIC = {
//             id: Date.now(),
//             name: '',
//             department: 'Production',
//             designation: '',
//             email: '',
//             phone: '',
//             companyName: leadData.accountName,
//             location: ''
//         };
//         setLeadData({ ...leadData, pics: [...leadData.pics, newPic] });
//         setActiveTab('stakeholders'); 
//     };

//     const removePIC = (id: number) => {
//         if (leadData.pics.length > 1) {
//             setLeadData({ ...leadData, pics: leadData.pics.filter(pic => pic.id !== id) });
//         } else {
//             alert("Minimum one stakeholder is required.");
//         }
//     };

//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (e.currentTarget.checkValidity() === false) {
//             e.stopPropagation();
//             setValidated(true);
//             return;
//         }
//         console.log("Submitting:", leadData);
//         alert("Lead Updated Successfully!");
//     };

//     // --- DYNAMIC ICONS ---
//     const getDeptIcon = (dept: string) => {
//         switch (dept) {
//             case 'Production': return <FaIndustry className="text-warning" />;
//             case 'IT': return <FaLaptopCode className="text-info" />;
//             case 'HR': return <FaHeartbeat className="text-danger" />;
//             case 'Management': return <FaUserTie className="text-primary" />;
//             default: return <FaBriefcase className="text-secondary" />;
//         }
//     };

//     return (
//         <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
            
//             {/* --- HEADER --- */}
//             <div className="bg-white border-bottom sticky-top shadow-sm" style={{ zIndex: 1000 }}>
//                 <Container fluid className="py-3 px-3 px-md-4 px-lg-5">
//                     <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
//                         <div className="d-flex align-items-center gap-3 align-self-start align-self-md-center">
//                             <Button variant="light" className="rounded-circle border d-flex align-items-center justify-content-center cursor-pointer" style={{width:40, height:40}} onClick={() => navigate(-1)}>
//                                 <FaArrowLeft />
//                             </Button>
//                             <div>
//                                 <h5 className="mb-0 fw-bold text-dark lh-1">Lead Workspace</h5>
//                                 <span className="text-muted small">ID: {leadData.leadId}</span>
//                             </div>
//                         </div>
//                         <div className="d-flex gap-2 align-self-end align-self-md-center w-100 w-md-auto justify-content-end">
//                             <Button variant="light" className="text-muted fw-bold cursor-pointer" onClick={() => navigate(-1)}>Cancel</Button>
//                             <Button onClick={() => document.getElementById('lead-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))} 
//                                 style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }} className="px-4 fw-bold shadow-sm cursor-pointer">
//                                 <FaSave className="me-2" /> Save
//                             </Button>
//                         </div>
//                     </div>
//                 </Container>
//             </div>

//             {/* --- MAIN CONTENT --- */}
//             <Container fluid className="py-4 px-3 px-md-4 px-lg-5">
//                 <Form id="lead-form" noValidate validated={validated} onSubmit={handleSubmit}>
//                     <Row className="g-4">
                        
//                         {/* --- LEFT SIDEBAR --- */}
//                         {/* 
//                             xs={12} -> Phone: Full Width Stacked
//                             md={4}  -> Tablet: 1/3rd Width (Side by Side)
//                             lg={3}  -> Laptop: 1/4th Width (Side by Side)
//                         */}
//                         <Col xs={12} md={4} lg={3}>
//                             <div className="sticky-sidebar-wrapper">
//                                 <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
//                                     <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
//                                         <h6 className="opacity-75 mb-1 small text-uppercase fw-bold" style={{letterSpacing:'1px'}}>Client Account</h6>
//                                         <h3 className="fw-bold mb-3 text-break">{leadData.accountName}</h3>
//                                         <div className="d-flex flex-wrap gap-2">
//                                             <Badge bg="white" text="dark" className="px-3 py-2 rounded-pill shadow-sm">
//                                                 {leadData.status}
//                                             </Badge>
//                                             <Badge bg="info" className="px-3 py-2 rounded-pill text-white shadow-sm border border-light">
//                                                 {leadData.vertical}
//                                             </Badge>
//                                         </div>
//                                     </div>
//                                     <Card.Body className="p-4 bg-white">
//                                         <h6 className="text-uppercase text-muted small fw-bold mb-3">Quick Stats</h6>
//                                         <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded bg-light border">
//                                             <span className="text-dark fw-bold small">Stakeholders</span>
//                                             <span className="badge bg-primary rounded-circle p-2" style={{width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center'}}>{leadData.pics.length}</span>
//                                         </div>
//                                         <div className="d-flex align-items-start p-3 rounded" style={{backgroundColor:'#eef2ff', border:'1px solid #c7d2fe'}}>
//                                             <FaCheckDouble className="text-primary mt-1 me-2 flex-shrink-0" />
//                                             <small className="text-dark">Ensure all key decision makers are added.</small>
//                                         </div>
//                                     </Card.Body>
//                                 </Card>
//                             </div>
//                         </Col>

//                         {/* --- RIGHT CONTENT --- */}
//                         {/* 
//                             xs={12} -> Phone: Full Width Stacked
//                             md={8}  -> Tablet: 2/3rds Width
//                             lg={9}  -> Laptop: 3/4ths Width
//                         */}
//                         <Col xs={12} md={8} lg={9}>
                            
//                             {/* TABS */}
//                             <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
//                                 <div 
//                                     onClick={() => setActiveTab('stakeholders')}
//                                     className={`px-4 py-2 rounded-pill fw-bold cursor-pointer transition-all d-flex align-items-center justify-content-center gap-2 ${activeTab === 'stakeholders' ? 'bg-white text-primary shadow-sm' : 'text-muted hover-bg-light'}`}
//                                 >
//                                     <FaUserCog /> Stakeholders
//                                 </div>
//                                 <div 
//                                     onClick={() => setActiveTab('notes')}
//                                     className={`px-4 py-2 rounded-pill fw-bold cursor-pointer transition-all d-flex align-items-center justify-content-center gap-2 ${activeTab === 'notes' ? 'bg-white text-primary shadow-sm' : 'text-muted hover-bg-light'}`}
//                                 >
//                                     <FaCheckDouble /> Minutes of Meeting
//                                 </div>
//                             </div>

//                             {/* --- STAKEHOLDERS TAB --- */}
//                             {activeTab === 'stakeholders' && (
//                                 <div className="fade-in d-flex flex-column gap-3">
//                                     {leadData.pics.map((pic, index) => (
//                                         <Card key={pic.id} className="border-0 shadow-sm pic-card" style={{ borderRadius: '12px', overflow:'hidden' }}>
//                                             <div className="position-absolute top-0 bottom-0 start-0 bg-primary" style={{ width: '4px' }}></div>
//                                             <Card.Body className="p-3 p-md-4">
//                                                 {/* Card Header */}
//                                                 <div className="d-flex justify-content-between align-items-start mb-4">
//                                                     <div className="d-flex align-items-center gap-3">
//                                                         <div className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 48, height: 48, fontSize: '1.25rem' }}>
//                                                             {getDeptIcon(pic.department)}
//                                                         </div>
//                                                         <div>
//                                                             <h6 className="mb-0 fw-bold text-dark">PIC #{index + 1}</h6>
//                                                             <span className="text-muted small">Contact Details</span>
//                                                         </div>
//                                                     </div>
//                                                     {leadData.pics.length > 1 && (
//                                                         <Button variant="light" className="text-danger btn-sm rounded-circle cursor-pointer" onClick={() => removePIC(pic.id)}>
//                                                             <FaTrash />
//                                                         </Button>
//                                                     )}
//                                                 </div>

//                                                 {/* 
//                                                     ======================================
//                                                     RESPONSIVE FORM GRID LOGIC
//                                                     ======================================
//                                                     xs={12} -> Phone:  1 item per row (Stacked)
//                                                     sm={6}  -> Tablet: 2 items per row (2x2 Grid)
//                                                     lg={3}  -> Laptop: 4 items per row (Single line)
//                                                 */}
//                                                 <Row className="g-3">
//                                                     <Col xs={12} sm={6} lg={3}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>FULL NAME *</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaUserTie /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     required type="text" placeholder="Name" 
//                                                                     className="border-start-0 ps-0"
//                                                                     value={pic.name} onChange={(e) => handlePICChange(pic.id, 'name', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>
//                                                     <Col xs={12} sm={6} lg={3}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>DEPARTMENT *</Form.Label>
//                                                             <Form.Select 
//                                                                 required value={pic.department} 
//                                                                 onChange={(e) => handlePICChange(pic.id, 'department', e.target.value)}
//                                                                 className="fw-bold text-dark border-start-0 ps-2 cursor-pointer"
//                                                             >
//                                                                 <option value="Production">Production</option>
//                                                                 <option value="HR">HR</option>
//                                                                 <option value="Quality">Quality</option>
//                                                                 <option value="Procurement">Procurement</option>
//                                                                 <option value="IT">IT</option>
//                                                                 <option value="Management">Management</option>
//                                                                 <option value="Sales">Sales</option>
//                                                             </Form.Select>
//                                                         </Form.Group>
//                                                     </Col>
//                                                     <Col xs={12} sm={6} lg={3}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>EMAIL *</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaEnvelope /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     required type="email" placeholder="Email" 
//                                                                     className="border-start-0 ps-0"
//                                                                     value={pic.email} onChange={(e) => handlePICChange(pic.id, 'email', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>
//                                                     <Col xs={12} sm={6} lg={3}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>MOBILE *</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaPhoneAlt /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     required type="tel" placeholder="Phone" 
//                                                                     className="border-start-0 ps-0"
//                                                                     value={pic.phone} onChange={(e) => handlePICChange(pic.id, 'phone', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>

//                                                     {/* Row 2 for Company Info */}
//                                                     {/* Laptop: Spans 2 cols each (half and half). Tablet: Spans 1 col (half and half). Phone: Full Width */}
//                                                     <Col xs={12} sm={6} lg={6}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>COMPANY NAME</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaBuilding /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     type="text" value={pic.companyName} placeholder="Company Ltd."
//                                                                     className="border-start-0 ps-0"
//                                                                     onChange={(e) => handlePICChange(pic.id, 'companyName', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>
//                                                     <Col xs={12} sm={6} lg={6}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>LOCATION / BRANCH</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaMapMarkerAlt /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     type="text" placeholder="Branch" 
//                                                                     className="border-start-0 ps-0"
//                                                                     value={pic.location} onChange={(e) => handlePICChange(pic.id, 'location', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>
//                                                 </Row>
//                                             </Card.Body>
//                                         </Card>
//                                     ))}

//                                     <Button 
//                                         variant="outline-primary" 
//                                         className="w-100 py-3 border-dashed fw-bold shadow-sm cursor-pointer" 
//                                         style={{ borderStyle: 'dashed', borderRadius: '12px', borderWidth: '2px', background: 'rgba(13, 110, 253, 0.03)' }}
//                                         onClick={addPIC}
//                                     >
//                                         <FaPlus className="me-2" /> Add Another Stakeholder
//                                     </Button>
//                                 </div>
//                             )}

//                             {/* --- NOTES TAB --- */}
//                             {activeTab === 'notes' && (
//                                 <div className="fade-in d-flex flex-column gap-3">
//                                     <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
//                                         <Card.Body className="p-4">
//                                             <Row>
//                                                 <Col xs={12} md={6}>
//                                                     <h6 className="fw-bold text-muted mb-2 small text-uppercase">Meeting Details</h6>
//                                                     <Form.Group>
//                                                         <Form.Label className="fw-bold text-dark"><FaCalendarAlt className="me-2 text-primary"/>Interaction Date</Form.Label>
//                                                         <Form.Control 
//                                                             type="date" 
//                                                             value={leadData.meetingDate}
//                                                             onChange={(e) => setLeadData({...leadData, meetingDate: e.target.value})}
//                                                             className="form-control-lg border bg-light text-dark cursor-pointer"
//                                                         />
//                                                     </Form.Group>
//                                                 </Col>
//                                             </Row>
//                                         </Card.Body>
//                                     </Card>

//                                     <Card className="border-0 shadow-sm flex-grow-1" style={{ borderRadius: '12px', minHeight: '400px' }}>
//                                         <Card.Body className="p-4 d-flex flex-column">
//                                             <h5 className="fw-bold mb-3 d-flex align-items-center">
//                                                 <FaCheckDouble className="text-success me-2" /> Minutes of Meeting
//                                             </h5>
//                                             <Form.Control
//                                                 as="textarea"
//                                                 className="flex-grow-1 p-4 border-0 bg-light"
//                                                 placeholder="Type discussion points here..."
//                                                 style={{ borderRadius: '12px', resize: 'none' }}
//                                                 value={leadData.discussionPoints}
//                                                 onChange={(e) => setLeadData({...leadData, discussionPoints: e.target.value})}
//                                             />
//                                         </Card.Body>
//                                     </Card>
//                                 </div>
//                             )}

//                         </Col>
//                     </Row>
//                 </Form>
//             </Container>

//             {/* --- CSS STYLES --- */}
//             <style>
//                 {`
//                     .transition-all { transition: all 0.2s ease-in-out; }
//                     .hover-bg-light:hover { background-color: #f8f9fa; }
//                     .pic-card:hover { transform: translateY(-2px); transition: transform 0.3s ease; }
//                     .fade-in { animation: fadeIn 0.4s ease-out; }
                    
//                     /* Force Hand Cursor on Interactive Elements */
//                     .cursor-pointer, 
//                     .btn, 
//                     button, 
//                     .form-select, 
//                     input[type="date"] { 
//                         cursor: pointer !important; 
//                     }
                    
//                     /* Sticky Sidebar Logic */
//                     /* Phone/Tablet: Static (Scrolls with page) */
//                     .sticky-sidebar-wrapper { position: static; }
                    
//                     /* Laptop/Desktop (md+): Sticky (Fixed on side) */
//                     @media (min-width: 768px) {
//                         .sticky-sidebar-wrapper {
//                             position: sticky;
//                             top: 90px; 
//                             z-index: 900;
//                         }
//                     }

//                     @keyframes fadeIn {
//                         from { opacity: 0; transform: translateY(10px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// };

// export default LeadDetailsPro;
// import React, { useState, useEffect } from 'react';
// import { FaBriefcase } from "react-icons/fa";
// import { Container, Row, Col, Form, Button, Card, Badge, InputGroup } from 'react-bootstrap';
// import { 
//     FaUserTie, FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, 
//     FaPlus, FaTrash, FaSave, FaIndustry, FaLaptopCode, FaHeartbeat, 
//     FaUserCog, FaCheckDouble, FaArrowLeft, FaCalendarAlt, FaListUl, FaCheck, FaTimes 
// } from 'react-icons/fa';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // --- TYPES ---
// interface PIC {
//     id: number;
//     name: string;
//     department: string;
//     designation: string;
//     email: string;
//     phone: string;
//     companyName: string;
//     location: string;
// }

// interface LeadData {
//     leadId: string;
//     accountName: string;
//     status: string;
//     vertical: string;
//     discussionPoints: string;
//     meetingDate: string;
//     pics: PIC[];
// }

// const LeadDetailsPro: React.FC = () => {
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const [activeTab, setActiveTab] = useState<'stakeholders' | 'notes'>('stakeholders');
//     const [validated, setValidated] = useState(false);

//     // --- TOPIC STATE ---
//     const [topics, setTopics] = useState<string[]>([
//         "Pricing Negotiation",
//         "Product Demo",
//         "Technical Specs",
//         "Contract Terms",
//         "Delivery Timeline",
//         "Support & SLA",
//         "Next Steps"
//     ]);
//     const [isAddingTopic, setIsAddingTopic] = useState(false);
//     const [newTopic, setNewTopic] = useState("");

//     // --- STATE ---
//     const [leadData, setLeadData] = useState<LeadData>({
//         leadId: '',
//         accountName: '',
//         status: '',
//         vertical: '',
//         discussionPoints: '',
//         meetingDate: new Date().toISOString().split('T')[0],
//         pics: []
//     });

//     // --- MOCK FETCH ---
//     useEffect(() => {
//         setLeadData({
//             leadId: 'LEAD-8829',
//             accountName: 'Vertex Global Solutions',
//             status: 'Negotiation',
//             vertical: 'Manufacturing',
//             discussionPoints: '',
//             meetingDate: new Date().toISOString().split('T')[0],
//             pics: [{
//                 id: Date.now(),
//                 name: '',
//                 department: 'Production',
//                 designation: '',
//                 email: '',
//                 phone: '',
//                 companyName: 'Vertex Global Solutions',
//                 location: ''
//             }]
//         });
//     }, [id]);

//     // --- HANDLERS ---
//     const handlePICChange = (id: number, field: keyof PIC, value: string) => {
//         const updatedPics = leadData.pics.map((pic) => 
//             pic.id === id ? { ...pic, [field]: value } : pic
//         );
//         setLeadData({ ...leadData, pics: updatedPics });
//     };

//     const addPIC = () => {
//         const newPic: PIC = {
//             id: Date.now(),
//             name: '',
//             department: 'Production',
//             designation: '',
//             email: '',
//             phone: '',
//             companyName: leadData.accountName,
//             location: ''
//         };
//         setLeadData({ ...leadData, pics: [...leadData.pics, newPic] });
//         setActiveTab('stakeholders'); 
//     };

//     const removePIC = (id: number) => {
//         if (leadData.pics.length > 1) {
//             setLeadData({ ...leadData, pics: leadData.pics.filter(pic => pic.id !== id) });
//         } else {
//             alert("Minimum one stakeholder is required.");
//         }
//     };

//     const addTopicToNotes = (topic: string) => {
//         const newPoint = `\n• Discussed: ${topic}`;
//         setLeadData(prev => ({
//             ...prev,
//             discussionPoints: prev.discussionPoints + newPoint
//         }));
//     };

//     // Logic to save the custom topic to the list
//     const handleAddCustomTopic = () => {
//         if (newTopic.trim() !== "") {
//             setTopics([...topics, newTopic.trim()]);
//             setNewTopic("");
//             setIsAddingTopic(false);
//         }
//     };

//     const handleKeyDown = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleAddCustomTopic();
//         }
//     };

//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         if (e.currentTarget.checkValidity() === false) {
//             e.stopPropagation();
//             setValidated(true);
//             return;
//         }
//         console.log("Submitting:", leadData);
//         alert("Lead Updated Successfully!");
//     };

//     // --- DYNAMIC ICONS ---
//     const getDeptIcon = (dept: string) => {
//         switch (dept) {
//             case 'Production': return <FaIndustry className="text-warning" />;
//             case 'IT': return <FaLaptopCode className="text-info" />;
//             case 'HR': return <FaHeartbeat className="text-danger" />;
//             case 'Management': return <FaUserTie className="text-primary" />;
//             default: return <FaBriefcase className="text-secondary" />;
//         }
//     };

//     return (
//         <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
            
//             {/* --- HEADER --- */}
//             <div className="bg-white border-bottom sticky-top shadow-sm" style={{ zIndex: 1000 }}>
//                 <Container fluid className="py-3 px-3 px-md-4 px-lg-5">
//                     <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
//                         <div className="d-flex align-items-center gap-3 align-self-start align-self-md-center">
//                             <Button variant="light" className="rounded-circle border d-flex align-items-center justify-content-center cursor-pointer" style={{width:40, height:40}} onClick={() => navigate(-1)}>
//                                 <FaArrowLeft />
//                             </Button>
//                             <div>
//                                 <h5 className="mb-0 fw-bold text-dark lh-1">Lead Workspace</h5>
//                                 {/* <span className="text-muted small">ID: {leadData.leadId}</span> */}
//                             </div>
//                         </div>
//                         <div className="d-flex gap-2 align-self-end align-self-md-center w-100 w-md-auto justify-content-end">
//                             <Button variant="light" className="text-muted fw-bold cursor-pointer" onClick={() => navigate(-1)}>Cancel</Button>
//                             <Button onClick={() => document.getElementById('lead-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))} 
//                                 style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }} className="px-4 fw-bold shadow-sm cursor-pointer">
//                                 <FaSave className="me-2" /> Save
//                             </Button>
//                         </div>
//                     </div>
//                 </Container>
//             </div>

//             {/* --- MAIN CONTENT --- */}
//             <Container fluid className="py-4 px-3 px-md-4 px-lg-5">
//                 <Form id="lead-form" noValidate validated={validated} onSubmit={handleSubmit}>
//                     <Row className="g-4">
                        
//                         {/* --- LEFT SIDEBAR --- */}
//                         <Col xs={12} md={4} lg={3}>
//                             <div className="sticky-sidebar-wrapper">
//                                 <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
//                                     <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
//                                         <h6 className="opacity-75 mb-1 small text-uppercase fw-bold" style={{letterSpacing:'1px'}}>Client Account</h6>
//                                         <h3 className="fw-bold mb-3 text-break">{leadData.accountName}</h3>
//                                         <div className="d-flex flex-wrap gap-2">
//                                             <Badge bg="white" text="dark" className="px-3 py-2 rounded-pill shadow-sm">
//                                                 {leadData.status}
//                                             </Badge>
//                                             <Badge bg="info" className="px-3 py-2 rounded-pill text-white shadow-sm border border-light">
//                                                 {leadData.vertical}
//                                             </Badge>
//                                         </div>
//                                     </div>
//                                     <Card.Body className="p-4 bg-white">
//                                         <h6 className="text-uppercase text-muted small fw-bold mb-3">Quick Stats</h6>
//                                         <div className="d-flex justify-content-between align-items-center mb-3 p-3 rounded bg-light border">
//                                             <span className="text-dark fw-bold small">Stakeholders</span>
//                                             <span className="badge bg-primary rounded-circle p-2" style={{width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center'}}>{leadData.pics.length}</span>
//                                         </div>
//                                         <div className="d-flex align-items-start p-3 rounded" style={{backgroundColor:'#eef2ff', border:'1px solid #c7d2fe'}}>
//                                             <FaCheckDouble className="text-primary mt-1 me-2 flex-shrink-0" />
//                                             <small className="text-dark">Ensure all key decision makers are added.</small>
//                                         </div>
//                                     </Card.Body>
//                                 </Card>
//                             </div>
//                         </Col>

//                         {/* --- RIGHT CONTENT --- */}
//                         <Col xs={12} md={8} lg={9}>
                            
//                             {/* TABS */}
//                             <div className="d-flex flex-column flex-sm-row gap-2 mb-3">
//                                 <div 
//                                     onClick={() => setActiveTab('stakeholders')}
//                                     className={`px-4 py-2 rounded-pill fw-bold cursor-pointer transition-all d-flex align-items-center justify-content-center gap-2 ${activeTab === 'stakeholders' ? 'bg-white text-primary shadow-sm' : 'text-muted hover-bg-light'}`}
//                                 >
//                                     <FaUserCog /> Stakeholders
//                                 </div>
//                                 <div 
//                                     onClick={() => setActiveTab('notes')}
//                                     className={`px-4 py-2 rounded-pill fw-bold cursor-pointer transition-all d-flex align-items-center justify-content-center gap-2 ${activeTab === 'notes' ? 'bg-white text-primary shadow-sm' : 'text-muted hover-bg-light'}`}
//                                 >
//                                     <FaCheckDouble /> Active Meeting
//                                 </div>
//                             </div>

//                             {/* --- STAKEHOLDERS TAB --- */}
//                             {activeTab === 'stakeholders' && (
//                                 <div className="fade-in d-flex flex-column gap-3">
//                                     {leadData.pics.map((pic, index) => (
//                                         <Card key={pic.id} className="border-0 shadow-sm pic-card" style={{ borderRadius: '12px', overflow:'hidden' }}>
//                                             <div className="position-absolute top-0 bottom-0 start-0 bg-primary" style={{ width: '4px' }}></div>
//                                             <Card.Body className="p-3 p-md-4">
//                                                 {/* Card Header */}
//                                                 <div className="d-flex justify-content-between align-items-start mb-4">
//                                                     <div className="d-flex align-items-center gap-3">
//                                                         <div className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: 48, height: 48, fontSize: '1.25rem' }}>
//                                                             {getDeptIcon(pic.department)}
//                                                         </div>
//                                                         <div>
//                                                             <h6 className="mb-0 fw-bold text-dark">Person In Charge #{index + 1}</h6>
//                                                             <span className="text-muted small">Contact Details</span>
//                                                         </div>
//                                                     </div>
//                                                     {leadData.pics.length > 1 && (
//                                                         <Button variant="light" className="text-danger btn-sm rounded-circle cursor-pointer" onClick={() => removePIC(pic.id)}>
//                                                             <FaTrash />
//                                                         </Button>
//                                                     )}
//                                                 </div>

//                                                 {/* FORM GRID */}
//                                                 <Row className="g-3">
//                                                     <Col xs={12} sm={6} lg={3}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>FULL NAME *</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaUserTie /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     required type="text" placeholder="Name" 
//                                                                     className="border-start-0 ps-0"
//                                                                     value={pic.name} onChange={(e) => handlePICChange(pic.id, 'name', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>
//                                                     <Col xs={12} sm={6} lg={3}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>DEPARTMENT *</Form.Label>
//                                                             <Form.Select 
//                                                                 required value={pic.department} 
//                                                                 onChange={(e) => handlePICChange(pic.id, 'department', e.target.value)}
//                                                                 className="fw-bold text-dark border-start-0 ps-2 cursor-pointer"
//                                                             >
//                                                                 <option value="Production">Production</option>
//                                                                 <option value="HR">HR</option>
//                                                                 <option value="Quality">Quality</option>
//                                                                 <option value="Procurement">Procurement</option>
//                                                                 <option value="IT">IT</option>
//                                                                 <option value="Management">Management</option>
//                                                                 <option value="Sales">Sales</option>
//                                                             </Form.Select>
//                                                         </Form.Group>
//                                                     </Col>
//                                                     <Col xs={12} sm={6} lg={3}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>EMAIL *</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaEnvelope /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     required type="email" placeholder="Email" 
//                                                                     className="border-start-0 ps-0"
//                                                                     value={pic.email} onChange={(e) => handlePICChange(pic.id, 'email', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>
//                                                     <Col xs={12} sm={6} lg={3}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>MOBILE *</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaPhoneAlt /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     required type="tel" placeholder="Phone" 
//                                                                     className="border-start-0 ps-0"
//                                                                     value={pic.phone} onChange={(e) => handlePICChange(pic.id, 'phone', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>

//                                                     <Col xs={12} sm={6} lg={6}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>COMPANY NAME</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaBuilding /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     type="text" value={pic.companyName} placeholder="Company Ltd."
//                                                                     className="border-start-0 ps-0"
//                                                                     onChange={(e) => handlePICChange(pic.id, 'companyName', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>
//                                                     <Col xs={12} sm={6} lg={6}>
//                                                         <Form.Group>
//                                                             <Form.Label className="small text-secondary fw-bold mb-1" style={{fontSize:'0.7rem'}}>LOCATION / BRANCH</Form.Label>
//                                                             <InputGroup>
//                                                                 <InputGroup.Text className="bg-white border-end-0 text-muted"><FaMapMarkerAlt /></InputGroup.Text>
//                                                                 <Form.Control 
//                                                                     type="text" placeholder="Branch" 
//                                                                     className="border-start-0 ps-0"
//                                                                     value={pic.location} onChange={(e) => handlePICChange(pic.id, 'location', e.target.value)}
//                                                                 />
//                                                             </InputGroup>
//                                                         </Form.Group>
//                                                     </Col>
//                                                 </Row>
//                                             </Card.Body>
//                                         </Card>
//                                     ))}

//                                     <Button 
//                                         variant="outline-primary" 
//                                         className="w-100 py-3 border-dashed fw-bold shadow-sm cursor-pointer" 
//                                         style={{ borderStyle: 'dashed', borderRadius: '12px', borderWidth: '2px', background: 'rgba(13, 110, 253, 0.03)' }}
//                                         onClick={addPIC}
//                                     >
//                                         <FaPlus className="me-2" /> Add Another Stakeholder
//                                     </Button>
//                                 </div>
//                             )}

//                             {/* --- NOTES TAB (With DYNAMIC ADD TOPIC) --- */}
//                             {activeTab === 'notes' && (
//                                 <div className="fade-in d-flex flex-column gap-3">
//                                     <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
//                                         <Card.Body className="p-4">
//                                             <Row>
//                                                 <Col xs={12} md={6}>
//                                                     <h6 className="fw-bold text-muted mb-2 small text-uppercase">Meeting Details</h6>
//                                                     <Form.Group>
//                                                         <Form.Label className="fw-bold text-dark"><FaCalendarAlt className="me-2 text-primary"/>Interaction Date</Form.Label>
//                                                         <Form.Control 
//                                                             type="date" 
//                                                             value={leadData.meetingDate}
//                                                             onChange={(e) => setLeadData({...leadData, meetingDate: e.target.value})}
//                                                             className="form-control-lg border bg-light text-dark cursor-pointer"
//                                                         />
//                                                     </Form.Group>
//                                                 </Col>
//                                             </Row>
//                                         </Card.Body>
//                                     </Card>

//                                     <Card className="border-0 shadow-sm flex-grow-1" style={{ borderRadius: '12px', minHeight: '400px' }}>
//                                         <Card.Body className="p-4 d-flex flex-column">
//                                             <h5 className="fw-bold mb-3 d-flex align-items-center">
//                                                 <FaCheckDouble className="text-success me-2" /> Active Meeting
//                                             </h5>
                                            
//                                             {/* --- QUICK TOPIC BUTTONS --- */}
//                                             <div className="mb-3">
//                                                 <p className="text-muted small mb-2"><FaListUl className="me-1"/> Quick Add Topics:</p>
//                                                 <div className="d-flex flex-wrap gap-2 align-items-center">
//                                                     {/* Existing Topics */}
//                                                     {topics.map((topic, index) => (
//                                                         <Badge 
//                                                             key={index} 
//                                                             bg="light" 
//                                                             text="dark" 
//                                                             className="border cursor-pointer p-2 hover-bg-primary"
//                                                             onClick={() => addTopicToNotes(topic)}
//                                                         >
//                                                             + {topic}
//                                                         </Badge>
//                                                     ))}

//                                                     {/* ADD NEW TOPIC BUTTON / INPUT */}
//                                                     {!isAddingTopic ? (
//                                                         <Badge 
//                                                             bg="white" 
//                                                             text="primary" 
//                                                             className="border border-primary cursor-pointer p-2 dashed-border"
//                                                             onClick={() => setIsAddingTopic(true)}
//                                                         >
//                                                             <FaPlus className="me-1" /> Custom Topic
//                                                         </Badge>
//                                                     ) : (
//                                                         <InputGroup size="sm" style={{ width: '200px' }}>
//                                                             <Form.Control
//                                                                 autoFocus
//                                                                 placeholder="Topic Name..."
//                                                                 value={newTopic}
//                                                                 onChange={(e) => setNewTopic(e.target.value)}
//                                                                 onKeyDown={handleKeyDown}
//                                                             />
//                                                             <Button variant="primary" onClick={handleAddCustomTopic}>
//                                                                 <FaCheck />
//                                                             </Button>
//                                                             <Button variant="secondary" onClick={() => setIsAddingTopic(false)}>
//                                                                 <FaTimes />
//                                                             </Button>
//                                                         </InputGroup>
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             <Form.Control
//                                                 as="textarea"
//                                                 className="flex-grow-1 p-4 border-0 bg-light"
//                                                 placeholder="Type discussion points here... (Click tags above to quick add)"
//                                                 style={{ borderRadius: '12px', resize: 'none' }}
//                                                 value={leadData.discussionPoints}
//                                                 onChange={(e) => setLeadData({...leadData, discussionPoints: e.target.value})}
//                                             />
//                                         </Card.Body>
//                                     </Card>
//                                 </div>
//                             )}

//                         </Col>
//                     </Row>
//                 </Form>
//             </Container>

//             {/* --- CSS STYLES --- */}
//             <style>
//                 {`
//                     .transition-all { transition: all 0.2s ease-in-out; }
//                     .hover-bg-light:hover { background-color: #f8f9fa; }
//                     .hover-bg-primary:hover { background-color: #0d6efd !important; color: white !important; border-color: #0d6efd !important; }
//                     .pic-card:hover { transform: translateY(-2px); transition: transform 0.3s ease; }
//                     .fade-in { animation: fadeIn 0.4s ease-out; }
//                     .dashed-border { border-style: dashed !important; }
                    
//                     /* Force Hand Cursor */
//                     .cursor-pointer, .btn, button, .form-select, input[type="date"], .badge { cursor: pointer !important; }
                    
//                     /* Laptop/Desktop Sticky Sidebar */
//                     @media (min-width: 768px) {
//                         .sticky-sidebar-wrapper { position: sticky; top: 90px; z-index: 900; }
//                     }

//                     @keyframes fadeIn {
//                         from { opacity: 0; transform: translateY(10px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }
//                 `}
//             </style>
//         </div>
//     );
// };

// export default LeadDetailsPro;


import React, { useState, useEffect } from 'react';
import { FaBriefcase } from "react-icons/fa";
import {
    FaUserTie, FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
    FaPlus, FaTrash, FaSave, FaIndustry, FaLaptopCode, FaHeartbeat,
    FaUserCog, FaCheckDouble, FaArrowLeft, FaCalendarAlt, FaListUl, FaCheck, FaTimes
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

// --- TYPES ---
interface PIC {
    id: number;
    name: string;
    department: string;
    designation: string;
    email: string;
    phone: string;
    companyName: string;
    location: string;
}

interface LeadData {
    leadId: string;
    accountName: string;
    status: string;
    vertical: string;
    discussionPoints: string;
    meetingDate: string;
    pics: PIC[];
}

const LeadDetailsPro: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'stakeholders' | 'notes'>('stakeholders');
    const [validated, setValidated] = useState(false);

    const [topics, setTopics] = useState<string[]>([
        "Pricing Negotiation", "Product Demo", "Technical Specs",
        "Contract Terms", "Delivery Timeline", "Support & SLA", "Next Steps"
    ]);
    const [isAddingTopic, setIsAddingTopic] = useState(false);
    const [newTopic, setNewTopic] = useState("");

    const [leadData, setLeadData] = useState<LeadData>({
        leadId: '', accountName: '', status: '', vertical: '',
        discussionPoints: '', meetingDate: new Date().toISOString().split('T')[0], pics: []
    });

    useEffect(() => {
        setLeadData({
            leadId: 'LEAD-8829', accountName: 'Vertex Global Solutions',
            status: 'Negotiation', vertical: 'Manufacturing',
            discussionPoints: '', meetingDate: new Date().toISOString().split('T')[0],
            pics: [{ id: Date.now(), name: '', department: 'Production', designation: '', email: '', phone: '', companyName: 'Vertex Global Solutions', location: '' }]
        });
    }, [id]);

    const handlePICChange = (id: number, field: keyof PIC, value: string) => {
        setLeadData({ ...leadData, pics: leadData.pics.map(pic => pic.id === id ? { ...pic, [field]: value } : pic) });
    };

    const addPIC = () => {
        const newPic: PIC = { id: Date.now(), name: '', department: 'Production', designation: '', email: '', phone: '', companyName: leadData.accountName, location: '' };
        setLeadData({ ...leadData, pics: [...leadData.pics, newPic] });
        setActiveTab('stakeholders');
    };

    const removePIC = (id: number) => {
        if (leadData.pics.length > 1) {
            setLeadData({ ...leadData, pics: leadData.pics.filter(pic => pic.id !== id) });
        } else {
            alert("Minimum one stakeholder is required.");
        }
    };

    const addTopicToNotes = (topic: string) => {
        setLeadData(prev => ({ ...prev, discussionPoints: prev.discussionPoints + `\n• Discussed: ${topic}` }));
    };

    const handleAddCustomTopic = () => {
        if (newTopic.trim() !== "") {
            setTopics([...topics, newTopic.trim()]);
            setNewTopic("");
            setIsAddingTopic(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); handleAddCustomTopic(); }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (e.currentTarget.checkValidity() === false) { e.stopPropagation(); setValidated(true); return; }
        console.log("Submitting:", leadData);
        alert("Lead Updated Successfully!");
    };

    const getDeptIcon = (dept: string) => {
        switch (dept) {
            case 'Production': return <FaIndustry className="text-yellow-500" />;
            case 'IT': return <FaLaptopCode className="text-blue-400" />;
            case 'HR': return <FaHeartbeat className="text-red-500" />;
            case 'Management': return <FaUserTie className="text-blue-600" />;
            default: return <FaBriefcase className="text-gray-500" />;
        }
    };

    const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
    const inputGroupClass = "flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500";
    const inputGroupIcon = "px-3 py-2 bg-white text-gray-400 border-r border-gray-200";
    const inputGroupInput = "flex-1 px-3 py-2 text-sm focus:outline-none bg-white";
    const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1";

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f4f6f8', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* HEADER */}
            <div className="bg-white border-b sticky top-0 shadow-sm z-50">
                <div className="w-full py-3 px-4 lg:px-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-3 self-start md:self-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 rounded-full border flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            >
                                <FaArrowLeft />
                            </button>
                            <div>
                                <h5 className="font-bold text-gray-800 leading-tight">Lead Workspace</h5>
                            </div>
                        </div>
                        <div className="flex gap-2 self-end md:self-center">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 text-gray-500 font-bold rounded-lg hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => document.getElementById('lead-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                                className="px-6 py-2 font-bold text-white rounded-lg shadow-sm cursor-pointer flex items-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            >
                                <FaSave /> Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <div className="w-full py-6 px-4 lg:px-10">
                <form id="lead-form" noValidate onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-6">

                        {/* LEFT SIDEBAR */}
                        <div className="w-full md:w-1/3 lg:w-1/4">
                            <div className="md:sticky md:top-24">
                                <div className="rounded-xl shadow-sm overflow-hidden border-0">
                                    {/* Gradient Header */}
                                    <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-75 mb-1">Client Account</p>
                                        <h3 className="font-bold text-xl mb-3 break-words">{leadData.accountName}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{leadData.status}</span>
                                            <span className="bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-white border-opacity-30">{leadData.vertical}</span>
                                        </div>
                                    </div>
                                    {/* Stats */}
                                    <div className="p-5 bg-white">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Stats</p>
                                        <div className="flex justify-between items-center mb-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                            <span className="text-sm font-bold text-gray-700">Stakeholders</span>
                                            <span className="w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{leadData.pics.length}</span>
                                        </div>
                                        <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' }}>
                                            <FaCheckDouble className="text-blue-600 mt-0.5 flex-shrink-0" />
                                            <small className="text-gray-700 text-xs">Ensure all key decision makers are added.</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="w-full md:w-2/3 lg:w-3/4">

                            {/* TABS */}
                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('stakeholders')}
                                    className={`px-5 py-2 rounded-full font-bold cursor-pointer flex items-center justify-center gap-2 transition-all text-sm ${activeTab === 'stakeholders' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <FaUserCog /> Stakeholders
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('notes')}
                                    className={`px-5 py-2 rounded-full font-bold cursor-pointer flex items-center justify-center gap-2 transition-all text-sm ${activeTab === 'notes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <FaCheckDouble /> Active Meeting
                                </button>
                            </div>

                            {/* STAKEHOLDERS TAB */}
                            {activeTab === 'stakeholders' && (
                                <div className="flex flex-col gap-4 animate-fadeIn">
                                    {leadData.pics.map((pic, index) => (
                                        <div key={pic.id} className="bg-white rounded-xl shadow-sm overflow-hidden relative hover:-translate-y-0.5 transition-transform">
                                            <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-600"></div>
                                            <div className="p-4 md:p-6">
                                                {/* Card Header */}
                                                <div className="flex justify-between items-start mb-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-sm text-xl">
                                                            {getDeptIcon(pic.department)}
                                                        </div>
                                                        <div>
                                                            <h6 className="font-bold text-gray-800 mb-0">Person In Charge #{index + 1}</h6>
                                                            <span className="text-gray-400 text-xs">Contact Details</span>
                                                        </div>
                                                    </div>
                                                    {leadData.pics.length > 1 && (
                                                        <button type="button" onClick={() => removePIC(pic.id)} className="p-2 rounded-full bg-gray-50 text-red-500 hover:bg-red-50 cursor-pointer">
                                                            <FaTrash size={12} />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* FORM GRID */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    <div>
                                                        <label className={labelClass}>Full Name *</label>
                                                        <div className={inputGroupClass}>
                                                            <span className={inputGroupIcon}><FaUserTie size={12} /></span>
                                                            <input required type="text" placeholder="Name" className={inputGroupInput}
                                                                value={pic.name} onChange={(e) => handlePICChange(pic.id, 'name', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Department *</label>
                                                        <select required value={pic.department} onChange={(e) => handlePICChange(pic.id, 'department', e.target.value)}
                                                            className={`${inputClass} font-bold cursor-pointer`}>
                                                            {['Production', 'HR', 'Quality', 'Procurement', 'IT', 'Management', 'Sales'].map(d => (
                                                                <option key={d} value={d}>{d}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Email *</label>
                                                        <div className={inputGroupClass}>
                                                            <span className={inputGroupIcon}><FaEnvelope size={12} /></span>
                                                            <input required type="email" placeholder="Email" className={inputGroupInput}
                                                                value={pic.email} onChange={(e) => handlePICChange(pic.id, 'email', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Mobile *</label>
                                                        <div className={inputGroupClass}>
                                                            <span className={inputGroupIcon}><FaPhoneAlt size={12} /></span>
                                                            <input required type="tel" placeholder="Phone" className={inputGroupInput}
                                                                value={pic.phone} onChange={(e) => handlePICChange(pic.id, 'phone', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-2 lg:col-span-2">
                                                        <label className={labelClass}>Company Name</label>
                                                        <div className={inputGroupClass}>
                                                            <span className={inputGroupIcon}><FaBuilding size={12} /></span>
                                                            <input type="text" placeholder="Company Ltd." className={inputGroupInput}
                                                                value={pic.companyName} onChange={(e) => handlePICChange(pic.id, 'companyName', e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-2 lg:col-span-2">
                                                        <label className={labelClass}>Location / Branch</label>
                                                        <div className={inputGroupClass}>
                                                            <span className={inputGroupIcon}><FaMapMarkerAlt size={12} /></span>
                                                            <input type="text" placeholder="Branch" className={inputGroupInput}
                                                                value={pic.location} onChange={(e) => handlePICChange(pic.id, 'location', e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" onClick={addPIC}
                                        className="w-full py-4 border-2 border-dashed border-blue-300 rounded-xl font-bold text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-center gap-2"
                                        style={{ background: 'rgba(13, 110, 253, 0.03)' }}>
                                        <FaPlus /> Add Another Stakeholder
                                    </button>
                                </div>
                            )}

                            {/* NOTES TAB */}
                            {activeTab === 'notes' && (
                                <div className="flex flex-col gap-4 animate-fadeIn">
                                    <div className="bg-white rounded-xl shadow-sm p-5">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Meeting Details</p>
                                        <div className="max-w-xs">
                                            <label className="font-bold text-gray-700 flex items-center gap-2 mb-2">
                                                <FaCalendarAlt className="text-blue-600" /> Interaction Date
                                            </label>
                                            <input type="date" value={leadData.meetingDate}
                                                onChange={(e) => setLeadData({ ...leadData, meetingDate: e.target.value })}
                                                className={`${inputClass} cursor-pointer`} />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col" style={{ minHeight: '400px' }}>
                                        <h5 className="font-bold mb-4 flex items-center gap-2">
                                            <FaCheckDouble className="text-green-500" /> Active Meeting
                                        </h5>

                                        {/* QUICK TOPIC BUTTONS */}
                                        <div className="mb-4">
                                            <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                                                <FaListUl /> Quick Add Topics:
                                            </p>
                                            <div className="flex flex-wrap gap-2 items-center">
                                                {topics.map((topic, index) => (
                                                    <button key={index} type="button" onClick={() => addTopicToNotes(topic)}
                                                        className="border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors">
                                                        + {topic}
                                                    </button>
                                                ))}

                                                {!isAddingTopic ? (
                                                    <button type="button" onClick={() => setIsAddingTopic(true)}
                                                        className="border-2 border-dashed border-blue-400 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-1">
                                                        <FaPlus size={10} /> Custom Topic
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <input autoFocus placeholder="Topic Name..." value={newTopic}
                                                            onChange={(e) => setNewTopic(e.target.value)} onKeyDown={handleKeyDown}
                                                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                        <button type="button" onClick={handleAddCustomTopic}
                                                            className="p-1.5 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                                                            <FaCheck size={12} />
                                                        </button>
                                                        <button type="button" onClick={() => setIsAddingTopic(false)}
                                                            className="p-1.5 bg-gray-400 text-white rounded-lg cursor-pointer hover:bg-gray-500">
                                                            <FaTimes size={12} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <textarea
                                            className="flex-1 w-full p-4 bg-gray-50 rounded-xl border-0 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Type discussion points here... (Click tags above to quick add)"
                                            value={leadData.discussionPoints}
                                            onChange={(e) => setLeadData({ ...leadData, discussionPoints: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
            `}</style>
        </div>
    );
};

export default LeadDetailsPro;
