import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BiLoaderAlt } from 'react-icons/bi'; 
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TextField, Box, Button, Select, MenuItem, List, ListItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Autocomplete as MUIAutocomplete } from '@mui/lab';
import { LoadScript } from '@react-google-maps/api';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Hourglass } from 'react-loader-spinner';
import AdminLogin from './AdminLogin'; // Ensure this is correctly imported

const Travel = () => {
    const [customers, setCustomers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedCustomerName, setSelectedCustomerName] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [destination, setDestination] = useState('');
    const [travelTime, setTravelTime] = useState('');
    const [loadingTravelTime, setLoadingTravelTime] = useState(false);
    const [message, setMessage] = useState('');
    const [textContent, setTextContent] = useState('');
    const [newTemplate, setNewTemplate] = useState(null);
    const [editTemplateOpen, setEditTemplateOpen] = useState(false);
    const [newTemplateText, setNewTemplateText] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // New state variable for admin validation
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [templateToDeleteId, setTemplateToDeleteId] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const autocompleteRef = useRef(null);
    const tags = [
        "{first_name}",
        "{last_name}",
        "{travelTime}",
        "{address_line1}",
        "{city}",
        "{state_text}",
        "{zip}",
        "{email}",
        "{phone}",
        "{review_link}",
        "{company_website}",
    ];

    useEffect(() => {
        validateToken(); // Validate the admin token before fetching data
    }, []);

    useEffect(() => {
        if (isAdmin) {
            fetchCustomers();
            fetchTemplates();
        }
    }, [isAdmin]);

    const validateToken = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('/api/validateToken', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsAdmin(response.data.isAdmin); // Assuming the response has an isAdmin property
            } catch (error) {
                console.error('Error validating token:', error);
                setIsAdmin(false);
            }
        } else {
            setIsAdmin(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/customers');
            const customerData = response.data.customers || [];
            const uniqueCustomers = customerData.reduce((acc, customer) => {
                const fullName = `${customer.first_name} ${customer.last_name}`;
                const existing = acc.some(cust => `${cust.first_name} ${cust.last_name}` === fullName);
                if (!existing) acc.push(customer);
                return acc;
            }, []);
            setCustomers(uniqueCustomers);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('/templates');
            setTemplates(response.data.templates);
        } catch (error) {
            console.error("Error fetching templates:", error);
        }
    };

    const getCurrentLocation = () => {
        setLoadingLocation(true); // Show loader immediately
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setCurrentLocation(`${lat}, ${lon}`);
                setLoadingLocation(false);
            },
            (error) => {
                console.error("Error getting current location:", error);
                setLoadingLocation(false);
            }
        );
    };

    const calculateTravelTime = async () => {
        setLoadingTravelTime(true); // Show loader for travel time
        try {
            const response = await axios.post('/calculate', {
                origin: currentLocation,
                destination,
            });
            setTravelTime(response.data.travelTime);
        } catch (error) {
            console.error("Error calculating travel time:", error);
            setTravelTime("Error calculating travel time.");
        } finally {
            setTimeout(() => {
                setLoadingTravelTime(false);
            }, 1500);
        }
    };

    const sendNotification = async () => {
        if (!selectedTemplateId || !selectedCustomerId || !travelTime) {
            setMessage("All fields must be filled.");
            return;
        }
        try {
            const response = await axios.post('/notify', {
                customerId: selectedCustomerId,
                travelTime,
                templateId: selectedTemplateId,
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error("Error notifying customer:", error);
            setMessage("Error notifying customer.");
        }
    };

    const handleTemplateSelection = (templateId) => {
        setSelectedTemplateId(templateId);
    };

    const handlePlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place) {
            setDestination(place.formatted_address);
        }
    };

    const handleDrop = (tag) => setTextContent(prev => prev + " " + tag);

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'TAG',
        drop: (item) => handleDrop(item.tag),
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    }));

    const createTemplate = async () => {
        try {
            const response = await axios.post('/templates/create', { text: textContent });
            setTemplates(prev => [...prev, response.data.template]);
        } catch (error) {
            console.error("Error creating template:", error);
        }
    };

    const handleOpenEditTemplate = (templateId) => {
        const template = templates.find(template => template.id === templateId);
        if (template) {
            setNewTemplateText(template.text);
            setSelectedTemplateId(templateId);
            setEditTemplateOpen(true);
        }
    };

    const handleCloseEditTemplate = () => {
        setEditTemplateOpen(false);
    };

    const handleSaveEditedTemplate = async () => {
        try {
            const response = await axios.put(`/templates/${selectedTemplateId}`, {
                text: newTemplateText,
            });
            const updatedTemplates = templates.map(t => (t.id === selectedTemplateId ? { ...t, text: newTemplateText } : t));
            setTemplates(updatedTemplates);
            setEditTemplateOpen(false);
        } catch (error) {
            console.error("Error updating template:", error);
        }
    };

    const handleOpenDeleteConfirmation = (templateId) => {
        setTemplateToDeleteId(templateId);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteTemplate = () => {
        axios.delete(`/templates/${templateToDeleteId}`)
            .then(response => {
                const updatedTemplates = templates.filter(t => t.id !== templateToDeleteId);
                setTemplates(updatedTemplates);
            })
            .catch(error => {
                console.error("Error deleting template:", error);
            });
        setDeleteConfirmationOpen(false);
    };

    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = ('' + phoneNumber).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return null;
    };

    const generatePreview = () => {
        if (!selectedTemplateId || !selectedCustomerId) {
            setMessage("Please select a template and customer first.");
            return;
        }
        const template = templates.find(t => t.id === selectedTemplateId);
        const customer = customers.find(c => c.jnid === selectedCustomerId);
        if (!template || !customer) {
            setMessage("Invalid template or customer data.");
            return;
        }
        const formattedPhone = formatPhoneNumber(customer.home_phone);
        const previewMessage = template.text
            .replace("{first_name}", customer.first_name || "")
            .replace("{last_name}", customer.last_name || "")
            .replace("{address_line1}", customer.address_line1 || "")
            .replace("{city}", customer.city || "")
            .replace("{state_text}", customer.state_text || "")
            .replace("{zip}", customer.zip || "")
            .replace("{travelTime}", travelTime || "")
            .replace("{phone}", formattedPhone || "")
            .replace("{email}", customer.email || "")
            .replace("{review_link}", "https://g.page/r/CZUXLaHzvDKhEB0/review")
            .replace("{company_website}", "https://www.carranzarestoration.org");

        setMessage(previewMessage);
    };

    const previewMessage = ""; // Default value is an empty string

    if (!isAdmin) {
        return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />;
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false); // Simply update the state to reflect the user is logged out
        window.scrollTo(0, 0); // Scroll to the top of the page
      };
    
      if (!isLoggedIn) {
        return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
      }

    return (
        <LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={['places']}>
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Travel Notification</h1>

                {/* Template Tags and Text Area */}
                <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>Tags</h3>
                    <List>
                        {tags.map(tag => (
                            <DraggableTag key={tag} tag={tag} />
                        ))}
                    </List>
                    <TextField
                        label="Template Message"
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        fullWidth
                        multiline
                        rows={5}
                        style={{ marginTop: "10px" }}
                        ref={drop}
                    />

                    {/* Create Template Button */}
                    <Button
                        onClick={() => {
                            createTemplate();
                            setTimeout(() => window.location.reload(), 1000);
                        }}
                        style={{ padding: "10px 20px", backgroundColor: "#FF5733", color: "#FFF", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px", marginBottom: "10px" }}
                    >
                        Create Template
                    </Button>
                </div>

                {/* Edit Template Dialog */}
                <Dialog open={editTemplateOpen} onClose={handleCloseEditTemplate} maxWidth="md" fullWidth>
                    <DialogTitle>Edit Template</DialogTitle>
                    <DialogContent>
                        <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>Tags</h3>
                        <List>
                            {tags.map(tag => (
                                <ListItem
                                    key={tag}
                                    style={{ border: "1px dashed #ccc", padding: "5px", cursor: "pointer", marginBottom: "5px" }}
                                    onClick={() => setNewTemplateText(prev => prev + " " + tag)}
                                >
                                    {tag}
                                </ListItem>
                            ))}
                        </List>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Template Text"
                            fullWidth
                            value={newTemplateText}
                            onChange={(e) => setNewTemplateText(e.target.value)}
                            multiline
                            rows={5}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditTemplate}>Cancel</Button>
                        <Button onClick={handleSaveEditedTemplate} variant="contained" color="primary">Save</Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Template Dialog */}
                <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
                    <DialogTitle>Delete Template</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Are you sure you want to delete this template?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirmationOpen(false)}>Cancel</Button>
                        <Button onClick={handleDeleteTemplate} variant="contained" color="primary">Delete</Button>
                    </DialogActions>
                </Dialog>

                {/* Location and Templates Section */}
                <div style={{ marginBottom: "20px" }}>
                    {/* Get Location Button */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Button
                            onClick={getCurrentLocation}
                            style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "#FFF", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: '10px' }}
                        >
                            Get Current Location
                        </Button>
                        {loadingLocation ? (
                            <Hourglass
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="hourglass-loading"
                                wrapperStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                colors={['#FD5D14', '#040F28']}
                            />
                        ) : (
                            <p style={{ fontSize: "16px", marginBottom: "10px" }}>Current Location: {currentLocation}</p>
                        )}
                    </div>

                    {/* Template Selection */}
                    <Box style={{ display: "inline-block", marginTop: "20px" }}>
                        <label style={{ fontSize: "16px", fontWeight: "bold", marginRight: "10px" }}>Template:</label>
                        <Select
                            value={selectedTemplateId}
                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                            displayEmpty
                            style={{ minWidth: "200px", width: "300px" }}
                        >
                            {templates.map((template) => (
                                <MenuItem key={template.id} value={template.id}>
                                    <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                            {template.text}
                                        </span>
                                        <div style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent the dropdown from opening
                                                    handleOpenEditTemplate(template.id);
                                                }}
                                                style={{ marginRight: "5px" }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent the dropdown from opening
                                                    handleOpenDeleteConfirmation(template.id);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </div>

                {/* Customer Selection */}
                <div style={{ marginBottom: "20px" }}>
                    <Box>
                        <label style={{ fontSize: "16px", fontWeight: "bold" }}>Customer:</label>
                        <MUIAutocomplete
                            options={customers}
                            getOptionLabel={(option) => `${option.first_name} ${option.last_name}` || ''}
                            onChange={(event, value) => {
                                if (value) {
                                    setSelectedCustomerId(value.jnid);
                                    setSelectedCustomerName(`${value.first_name} ${value.last_name}`);
                                    setDestination(`${value.address_line1}, ${value.city}, ${value.state_text}, ${value.zip || ''}, USA`);
                                }
                            }}
                            renderInput={(params) => <TextField {...params} placeholder="Select customer..." style={{ marginBottom: "10px" }} />}
                            ref={autocompleteRef}
                        />
                    </Box>
                    <label style={{ fontSize: "16px" }}>Destination Address: <strong>{destination}</strong></label>
                </div>

                {/* Travel Time Calculation */}
                <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
                    <button
                        onClick={calculateTravelTime}
                        style={{ padding: "10px 20px", backgroundColor: "#28A745", color: "#FFF", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px", marginBottom: "10px" }}
                    >
                        Calculate Travel Time
                    </button>
                    {loadingTravelTime ? (
                        <Hourglass
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="hourglass-loading"
                            wrapperStyle={{ display: 'inline-block', marginLeft: '10px' }}
                            colors={['#FD5D14', '#040F28']}
                        />
                    ) : (
                        <p style={{ fontSize: "16px", marginBottom: "10px" }}>Travel Time: {travelTime}</p>
                    )}
                </div>

                {/* Notification Section */}
                <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
                    <button
                        onClick={sendNotification}
                        style={{ padding: "10px 20px", backgroundColor: "#FFC107", color: "#FFF", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px", marginBottom: "10px" }}
                    >
                        Notify Customer
                    </button>
                    
                </div>

                {/* Preview Section */}
                <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
                    <button
                        onClick={generatePreview}
                        style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "#FFF", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px", marginBottom: "10px" }}
                    >
                        Generate Preview
                    </button>
                    <p style={{ fontSize: "16px" }}>Preview Message: {previewMessage}</p>
                    <p style={{ fontSize: "16px" }}>{message}</p>
                </div>
                <button onClick={handleLogout} className="btn btn-warning">Logout</button>
            </div>
        </LoadScript>
    );
}

function DraggableTag({ tag }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TAG',
        item: { tag },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }));

    const opacity = isDragging ? 0.5 : 1;

    return (
        <ListItem
            ref={drag}
            style={{ opacity, border: "1px dashed #ccc", padding: "5px", cursor: "pointer", marginBottom: "5px" }}
        >
            {tag}
        </ListItem>
    );
}

export default Travel;
