import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employeesData } from '@/data/mockData';
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Upload, 
  Edit, 
  Plus,
  Save,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

// Interface for the location data that we want to store separately
interface EmployeeLocation {
  city: string;
  state: string;
}

const EmployeeProfile = ({ employeeId }: { employeeId?: string }) => {
  const params = useParams();
  const id = employeeId || params.id || '1';
  
  // In a real app, we'd fetch this data from an API based on the ID
  const [employee, setEmployee] = useState(() => {
    return employeesData.find(emp => emp.id === id) || employeesData[0];
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Employment Contract', type: 'PDF', date: '2022-05-01' },
    { id: '2', name: 'Performance Review 2023', type: 'PDF', date: '2023-12-15' },
    { id: '3', name: 'Training Certificates', type: 'PDF', date: '2023-08-22' },
    { id: '4', name: 'Onboarding Documents', type: 'PDF', date: '2022-05-01' }
  ]);
  
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });
  // Create a separate state for location info
  const [location, setLocation] = useState<EmployeeLocation>({
    city: "San Francisco",
    state: "CA"
  });
  
  const [newDocument, setNewDocument] = useState({ name: '', type: 'PDF', file: null });
  const [newPerformance, setNewPerformance] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    scores: {
      communication: 3,
      teamwork: 3,
      technicalSkills: 3,
      productivity: 3
    }
  });
  
  const [performanceFeedback, setPerformanceFeedback] = useState([
    {
      id: '1',
      title: "Q2 Performance Review",
      date: "2023-06-15",
      content: "Exceeds expectations in most areas. Great team player and consistently delivers quality work."
    },
    {
      id: '2',
      title: "Project Feedback - Website Redesign",
      date: "2023-03-22",
      content: "Showed excellent initiative and creative problem-solving during the website redesign project."
    }
  ]);

  const handleEditSave = () => {
    setEmployee(editedEmployee);
    setIsEditMode(false);
    toast.success("Employee profile updated successfully");
  };

  const handleDocumentUpload = () => {
    if (!newDocument.name) {
      toast.error("Please enter a document name");
      return;
    }
    
    const document = {
      id: `doc-${Date.now()}`,
      name: newDocument.name,
      type: newDocument.type,
      date: new Date().toISOString().split('T')[0]
    };
    
    setDocuments([...documents, document]);
    setNewDocument({ name: '', type: 'PDF', file: null });
    setIsDocumentDialogOpen(false);
    toast.success("Document uploaded successfully");
  };

  const handleAddPerformance = () => {
    if (!newPerformance.title || !newPerformance.content) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const feedback = {
      id: `perf-${Date.now()}`,
      title: newPerformance.title,
      date: newPerformance.date,
      content: newPerformance.content
    };
    
    setPerformanceFeedback([feedback, ...performanceFeedback]);
    setNewPerformance({
      title: '',
      date: new Date().toISOString().split('T')[0],
      content: '',
      scores: {
        communication: 3,
        teamwork: 3,
        technicalSkills: 3,
        productivity: 3
      }
    });
    setIsPerformanceDialogOpen(false);
    toast.success("Performance feedback added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
          <p className="text-gray-600">View and manage employee information</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.print()}>Export Profile</Button>
          {!isEditMode ? (
            <Button 
              variant="default" 
              className="bg-hr-teal hover:bg-hr-teal/90"
              onClick={() => setIsEditMode(true)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button 
                variant="default" 
                className="bg-hr-teal hover:bg-hr-teal/90"
                onClick={handleEditSave}
              >
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                {employee.avatar ? (
                  <img
                    src={employee.avatar}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-hr-navy text-white text-2xl font-medium">
                    {employee.firstName[0]}
                  </div>
                )}
              </div>
              {isEditMode ? (
                <div className="space-y-4 w-full">
                  <div className="flex gap-2">
                    <div>
                      <label htmlFor="firstName" className="text-sm text-left block">First Name</label>
                      <Input
                        id="firstName"
                        value={editedEmployee.firstName}
                        onChange={(e) => setEditedEmployee({...editedEmployee, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-sm text-left block">Last Name</label>
                      <Input
                        id="lastName"
                        value={editedEmployee.lastName}
                        onChange={(e) => setEditedEmployee({...editedEmployee, lastName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="position" className="text-sm text-left block">Position</label>
                    <Input
                      id="position"
                      value={editedEmployee.position}
                      onChange={(e) => setEditedEmployee({...editedEmployee, position: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="text-sm text-left block">Status</label>
                    <select
                      id="status"
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      value={editedEmployee.status}
                      onChange={(e) => setEditedEmployee({
                        ...editedEmployee, 
                        status: e.target.value as 'active' | 'inactive' | 'onLeave'
                      })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="onLeave">On Leave</option>
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h2>
                  <p className="text-gray-600 mb-2">{employee.position}</p>
                  
                  <Badge className={getStatusClass(employee.status)} variant="outline">
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </Badge>
                </>
              )}
              
              <div className="w-full mt-6 space-y-3">
                {isEditMode ? (
                  <>
                    <div>
                      <label htmlFor="email" className="text-sm text-left block">Email</label>
                      <Input
                        id="email"
                        value={editedEmployee.email}
                        onChange={(e) => setEditedEmployee({...editedEmployee, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-sm text-left block">Phone</label>
                      <Input
                        id="phone"
                        value={editedEmployee.phone}
                        onChange={(e) => setEditedEmployee({...editedEmployee, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label htmlFor="location" className="text-sm text-left block">Location</label>
                      <Input
                        id="location"
                        defaultValue={`${location.city}, ${location.state}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(',');
                          setLocation({
                            city: parts[0] ? parts[0].trim() : location.city,
                            state: parts[1] ? parts[1].trim() : location.state
                          });
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${employee.email}`} className="text-sm text-blue-600 hover:underline">{employee.email}</a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{employee.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">Joined {formatDate(employee.hireDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{location.city}, {location.state}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Employee Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="mt-0">
                {isEditMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="department" className="text-sm font-medium">Department</label>
                        <Input
                          id="department"
                          value={editedEmployee.department}
                          onChange={(e) => setEditedEmployee({...editedEmployee, department: e.target.value})}
                        />
                      </div>
                      <div>
                        <label htmlFor="employeePosition" className="text-sm font-medium">Position</label>
                        <Input
                          id="employeePosition"
                          value={editedEmployee.position}
                          onChange={(e) => setEditedEmployee({...editedEmployee, position: e.target.value})}
                        />
                      </div>
                      <div>
                        <label htmlFor="employmentType" className="text-sm font-medium">Employment Type</label>
                        <select
                          id="employmentType"
                          className="w-full rounded-md border border-gray-300 px-3 py-2"
                          defaultValue="Full-time"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="manager" className="text-sm font-medium">Manager</label>
                        <Input
                          id="manager"
                          defaultValue="Jane Smith"
                        />
                      </div>
                      <div>
                        <label htmlFor="officeLocation" className="text-sm font-medium">Office Location</label>
                        <Input
                          id="officeLocation"
                          defaultValue="San Francisco HQ"
                        />
                      </div>
                      <div>
                        <label htmlFor="workSchedule" className="text-sm font-medium">Work Schedule</label>
                        <Input
                          id="workSchedule"
                          defaultValue="Mon-Fri, 9AM-5PM"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="text-sm font-medium">Employee Notes</label>
                      <Textarea
                        id="notes"
                        rows={4}
                        defaultValue={`${editedEmployee.firstName} joined the company in ${new Date(editedEmployee.hireDate).getFullYear()} and has been a valuable member of the ${editedEmployee.department} team. They have consistently demonstrated strong skills in teamwork, problem-solving, and customer service.`}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoCard title="Department" value={employee.department} />
                      <InfoCard title="Position" value={employee.position} />
                      <InfoCard title="Employment Type" value="Full-time" />
                      <InfoCard title="Manager" value="Jane Smith" />
                      <InfoCard title="Office Location" value="San Francisco HQ" />
                      <InfoCard title="Work Schedule" value="Mon-Fri, 9AM-5PM" />
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-md font-medium mb-3">Employee Notes</h3>
                      <p className="text-sm text-gray-600">
                        {employee.firstName} joined the company in {new Date(employee.hireDate).getFullYear()} and has been a valuable member of the {employee.department} team. They have consistently demonstrated strong skills in teamwork, problem-solving, and customer service.
                      </p>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="documents" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium">Employee Documents</h3>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setIsDocumentDialogOpen(true)}
                  >
                    <Upload className="h-4 w-4" /> Upload Document
                  </Button>
                </div>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-gray-500" />
                        <div>
                          <span className="block">{doc.name}</span>
                          <span className="text-xs text-gray-500">Added: {formatDate(doc.date)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">View</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium">Performance Summary</h3>
                  <Button 
                    variant="outline"
                    onClick={() => setIsPerformanceDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Feedback
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ScoreCard title="Communication" score={4} />
                  <ScoreCard title="Teamwork" score={5} />
                  <ScoreCard title="Technical Skills" score={4} />
                  <ScoreCard title="Productivity" score={3} />
                </div>
                
                <h3 className="text-md font-medium mt-6 mb-3">Feedback History</h3>
                <div className="space-y-3">
                  {performanceFeedback.map((feedback) => (
                    <FeedbackItem
                      key={feedback.id}
                      title={feedback.title}
                      date={feedback.date}
                      content={feedback.content}
                    />
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Document Upload Dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to this employee's profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="documentName" className="text-sm font-medium">Document Name</label>
              <Input
                id="documentName"
                placeholder="e.g., Employment Contract"
                value={newDocument.name}
                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="documentType" className="text-sm font-medium">Document Type</label>
              <select
                id="documentType"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                value={newDocument.type}
                onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
              >
                <option value="PDF">PDF</option>
                <option value="DOCX">Word Document</option>
                <option value="XLSX">Excel Spreadsheet</option>
                <option value="JPG">Image</option>
              </select>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOCX, XLSX, JPG, PNG (Max 10MB)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDocumentUpload}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Performance Feedback Dialog */}
      <Dialog open={isPerformanceDialogOpen} onOpenChange={setIsPerformanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Performance Feedback</DialogTitle>
            <DialogDescription>
              Create a new performance review or feedback for this employee.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="feedbackTitle" className="text-sm font-medium">Feedback Title</label>
              <Input
                id="feedbackTitle"
                placeholder="e.g., Q3 Performance Review"
                value={newPerformance.title}
                onChange={(e) => setNewPerformance({...newPerformance, title: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="feedbackDate" className="text-sm font-medium">Date</label>
              <Input
                id="feedbackDate"
                type="date"
                value={newPerformance.date}
                onChange={(e) => setNewPerformance({...newPerformance, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Performance Scores</label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label htmlFor="communication" className="text-xs">Communication</label>
                  <select
                    id="communication"
                    className="w-full rounded-md border border-gray-300 px-2 py-1"
                    value={newPerformance.scores.communication}
                    onChange={(e) => setNewPerformance({
                      ...newPerformance, 
                      scores: {...newPerformance.scores, communication: Number(e.target.value)}
                    })}
                  >
                    {[1,2,3,4,5].map(score => (
                      <option key={score} value={score}>{score}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="teamwork" className="text-xs">Teamwork</label>
                  <select
                    id="teamwork"
                    className="w-full rounded-md border border-gray-300 px-2 py-1"
                    value={newPerformance.scores.teamwork}
                    onChange={(e) => setNewPerformance({
                      ...newPerformance, 
                      scores: {...newPerformance.scores, teamwork: Number(e.target.value)}
                    })}
                  >
                    {[1,2,3,4,5].map(score => (
                      <option key={score} value={score}>{score}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="technical" className="text-xs">Technical Skills</label>
                  <select
                    id="technical"
                    className="w-full rounded-md border border-gray-300 px-2 py-1"
                    value={newPerformance.scores.technicalSkills}
                    onChange={(e) => setNewPerformance({
                      ...newPerformance, 
                      scores: {...newPerformance.scores, technicalSkills: Number(e.target.value)}
                    })}
                  >
                    {[1,2,3,4,5].map(score => (
                      <option key={score} value={score}>{score}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="productivity" className="text-xs">Productivity</label>
                  <select
                    id="productivity"
                    className="w-full rounded-md border border-gray-300 px-2 py-1"
                    value={newPerformance.scores.productivity}
                    onChange={(e) => setNewPerformance({
                      ...newPerformance, 
                      scores: {...newPerformance.scores, productivity: Number(e.target.value)}
                    })}
                  >
                    {[1,2,3,4,5].map(score => (
                      <option key={score} value={score}>{score}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="feedbackContent" className="text-sm font-medium">Feedback Comments</label>
              <Textarea
                id="feedbackContent"
                placeholder="Enter detailed feedback here..."
                rows={4}
                value={newPerformance.content}
                onChange={(e) => setNewPerformance({...newPerformance, content: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPerformanceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPerformance}>Add Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const ScoreCard = ({ title, score }: { title: string; score: number }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md text-center">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <div className="flex justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= score ? 'text-amber-400' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

const FeedbackItem = ({ title, date, content }: { title: string; date: string; content: string }) => {
  return (
    <div className="border-l-4 border-hr-teal pl-4 py-2">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
};

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getStatusClass(status: string) {
  const statusMap: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    onLeave: 'bg-amber-100 text-amber-800',
  };

  return statusMap[status] || 'bg-gray-100 text-gray-800';
}

export default EmployeeProfile;
