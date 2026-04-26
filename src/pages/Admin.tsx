import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, query, orderBy, getDocs, setDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  BarChart, 
  Package, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  ExternalLink,
  Loader2,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  Shield,
  Zap,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface HistoryItem {
  status: string;
  location: string;
  timestamp: any;
  message: string;
}

interface Shipment {
  id: string;
  trackingId: string;
  senderEmail: string;
  recipientEmail: string;
  status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  origin: string;
  destination: string;
  currentLocation: string;
  weight?: string;
  isApproved?: boolean;
  lastUpdated: any;
  history?: HistoryItem[];
  files?: Array<{ name: string; size: string; uploadedAt: string }>;
}

interface ContactInquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  comments: string;
  createdAt: any;
}

export function Admin({ user }: { user: User | null }) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inquiriesLoading, setInquiriesLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Form states
  const [newShipment, setNewShipment] = useState({
    senderEmail: '',
    recipientEmail: '',
    origin: '',
    destination: '',
    weight: '',
  });

  const [updateStatus, setUpdateStatus] = useState<Shipment['status']>('PENDING');
  const [updateLocation, setUpdateLocation] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [newFile, setNewFile] = useState({ name: '', size: '' });
  const [isCreating, setIsCreating] = useState(false);

  const isAdmin = user?.email === 'fastinsms.com@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      fetchShipments();
      fetchInquiries();
    }
  }, [isAdmin]);

  const fetchShipments = async () => {
    try {
      const q = query(collection(db, 'shipments'), orderBy('lastUpdated', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Shipment[];
      setShipments(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'shipments');
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      const q = query(collection(db, 'contact_inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactInquiry[];
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const generateTrackingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SD-';
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    result += '-';
    for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const trackingId = generateTrackingId();
    
    try {
      const shipmentData = {
        trackingId,
        senderEmail: newShipment.senderEmail,
        recipientEmail: newShipment.recipientEmail,
        origin: newShipment.origin,
        destination: newShipment.destination,
        weight: newShipment.weight,
        status: 'PENDING',
        isApproved: false,
        currentLocation: newShipment.origin,
        lastUpdated: serverTimestamp(),
        createdAt: serverTimestamp(),
        adminId: user?.uid,
        history: [{
          status: 'PENDING',
          location: newShipment.origin,
          timestamp: new Date(),
          message: 'Shipment record created'
        }]
      };

      // Use trackingId as the document ID so it can be fetched via getDoc (public)
      await setDoc(doc(db, 'shipments', trackingId), shipmentData);
      
      toast.success(`Shipment ${trackingId} created successfully`);
      setIsNewDialogOpen(false);
      setNewShipment({ senderEmail: '', recipientEmail: '', origin: '', destination: '', weight: '' });
      fetchShipments();
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Failed to create shipment');
      handleFirestoreError(error, OperationType.CREATE, 'shipments');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    try {
      const shipmentRef = doc(db, 'shipments', selectedShipment.id);
      const newHistoryItem = {
        status: updateStatus,
        location: updateLocation,
        timestamp: new Date(),
        message: updateMessage || `Status updated to ${updateStatus}`
      };

      const updatedHistory = [...(selectedShipment.history || []), newHistoryItem];

      await updateDoc(shipmentRef, {
        status: updateStatus,
        currentLocation: updateLocation,
        lastUpdated: serverTimestamp(),
        history: updatedHistory,
        files: selectedShipment.files || []
      });

      toast.success('Shipment updated');
      setIsUpdateDialogOpen(false);
      setSelectedShipment(null);
      fetchShipments();
    } catch (error) {
      toast.error('Update failed');
      handleFirestoreError(error, OperationType.UPDATE, `shipments/${selectedShipment.id}`);
    }
  };

  const handleApproveShipment = async (shipment: Shipment) => {
    try {
      const shipmentRef = doc(db, 'shipments', shipment.id);
      const newHistoryItem = {
        status: shipment.status,
        location: shipment.currentLocation,
        timestamp: new Date(),
        message: 'Shipment request approved by admin.'
      };

      const updatedHistory = [...(shipment.history || []), newHistoryItem];

      await updateDoc(shipmentRef, {
        isApproved: true,
        lastUpdated: serverTimestamp(),
        history: updatedHistory
      });

      toast.success(`Shipment ${shipment.trackingId} approved`);
      fetchShipments();
    } catch (error) {
      toast.error('Approval failed');
      handleFirestoreError(error, OperationType.UPDATE, `shipments/${shipment.id}`);
    }
  };

  const filteredShipments = shipments.filter(s => 
    s.trackingId.toLowerCase().includes(search.toLowerCase()) ||
    s.recipientEmail.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
        <p className="text-slate-600">Only authorized administrators can access this console.</p>
      </div>
    );
  }

  const getStatusIcon = (status: Shipment['status']) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'PICKED_UP': return <Package className="h-4 w-4" />;
      case 'IN_TRANSIT': return <Truck className="h-4 w-4" />;
      case 'OUT_FOR_DELIVERY': return <PackageCheck className="h-4 w-4" />;
      case 'DELIVERED': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
            <p className="text-slate-500 text-sm">Manage global shipments and track digital assets.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by ID or Email" 
                className="pl-10 w-[300px] bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
              <Button onClick={() => setIsNewDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Shipment
              </Button>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateShipment}>
                  <DialogHeader>
                    <DialogTitle>Generate New Tracking</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sender">Sender Email</Label>
                        <Input id="sender" type="email" required value={newShipment.senderEmail} onChange={e => setNewShipment(prev => ({...prev, senderEmail: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient Email</Label>
                        <Input id="recipient" type="email" required value={newShipment.recipientEmail} onChange={e => setNewShipment(prev => ({...prev, recipientEmail: e.target.value}))} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin City</Label>
                        <Input id="origin" placeholder="e.g. New York, NY" required value={newShipment.origin} onChange={e => setNewShipment(prev => ({...prev, origin: e.target.value}))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="destination">Destination City</Label>
                        <Input id="destination" placeholder="e.g. London, UK" required value={newShipment.destination} onChange={e => setNewShipment(prev => ({...prev, destination: e.target.value}))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight / Dimensions</Label>
                      <Input id="weight" placeholder="e.g. 5kg, 30x20x10cm" value={newShipment.weight} onChange={e => setNewShipment(prev => ({...prev, weight: e.target.value}))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Shipment'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Tabs defaultValue="shipments" className="w-full">
          <TabsList className="bg-slate-200/50 p-1 mb-8">
            <TabsTrigger value="shipments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Package className="h-4 w-4 mr-2" />
              Shipments
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Mail className="h-4 w-4 mr-2" />
              Contact Inquiries
              {inquiries.length > 0 && (
                <Badge className="ml-2 bg-blue-600 h-5 w-5 flex items-center justify-center p-0 rounded-full">{inquiries.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shipments">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                  <Package className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shipments.length}</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                  <Truck className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shipments.filter(s => s.status === 'IN_TRANSIT').length}</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{shipments.filter(s => s.status === 'DELIVERED').length}</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                  <Zap className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-slate-500">Syncing with logistics node...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-bold">Tracking ID</TableHead>
                        <TableHead className="font-bold">Recipient</TableHead>
                        <TableHead className="font-bold">Weight</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        <TableHead className="font-bold">Last Location</TableHead>
                        <TableHead className="font-bold">Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShipments.map((s) => (
                        <TableRow key={s.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-mono font-medium text-blue-600">
                            <div className="flex flex-col">
                              <span>{s.trackingId}</span>
                              {!s.isApproved && (
                                <Badge variant="destructive" className="text-[10px] h-4 mt-1 px-1">WAITING APPROVAL</Badge>
                              )}
                              {s.isApproved && (
                                <Badge variant="outline" className="text-[10px] h-4 mt-1 px-1 bg-green-50 text-green-700 border-green-200">APPROVED</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{s.recipientEmail}</TableCell>
                          <TableCell className="text-slate-500 font-mono text-xs">{s.weight || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="flex items-center w-fit gap-1 capitalize">
                              {getStatusIcon(s.status)}
                              {s.status.replace(/_/g, ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">{s.currentLocation}</TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {s.lastUpdated?.toDate ? format(s.lastUpdated.toDate(), 'MMM dd, HH:mm') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {!s.isApproved && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                  onClick={() => handleApproveShipment(s)}
                                >
                                  Approve
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => {
                                  setSelectedShipment(s);
                                  setUpdateStatus(s.status);
                                  setUpdateLocation(s.currentLocation);
                                  setIsUpdateDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => window.open(`/track/${s.trackingId}`, '_blank')}>
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card className="border-none shadow-md overflow-hidden">
              <CardContent className="p-0">
                {inquiriesLoading ? (
                  <div className="p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-slate-500">Checking for messages...</p>
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="p-20 text-center">
                    <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800">No messages yet</h3>
                    <p className="text-slate-500">New contact form submissions will appear here.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-bold">Name</TableHead>
                        <TableHead className="font-bold">Contact Info</TableHead>
                        <TableHead className="font-bold">Company</TableHead>
                        <TableHead className="font-bold">Message</TableHead>
                        <TableHead className="font-bold">Received</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inq) => (
                        <TableRow key={inq.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-medium">
                            {inq.firstName} {inq.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-slate-600">
                              <Mail className="h-3 w-3" />
                              {inq.email}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {inq.companyName}
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="text-sm truncate hover:whitespace-normal cursor-pointer transition-all">
                              {inq.comments}
                            </p>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {inq.createdAt?.toDate ? format(inq.createdAt.toDate(), 'MMM dd, HH:mm') : 'Just now'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => window.location.href = `mailto:${inq.email}`}
                            >
                              Reply
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Update Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <form onSubmit={handleUpdateStatus}>
              <DialogHeader>
                <DialogTitle>Update Status: {selectedShipment?.trackingId}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white"
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as Shipment['status'])}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PICKED_UP">PICKED UP</option>
                    <option value="IN_TRANSIT">IN TRANSIT</option>
                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loc-update">Current Location</Label>
                  <Input 
                    id="loc-update" 
                    value={updateLocation} 
                    onChange={e => setUpdateLocation(e.target.value)} 
                    placeholder="e.g. Sorting Center, London"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="msg-update">Update Message (Optional)</Label>
                  <Input 
                    id="msg-update" 
                    value={updateMessage} 
                    onChange={e => setUpdateMessage(e.target.value)} 
                    placeholder="e.g. Scanned at distribution hub"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Attach Digital Asset (Mock)</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Filename" 
                      value={newFile.name} 
                      onChange={e => setNewFile(prev => ({...prev, name: e.target.value}))}
                    />
                    <Input 
                      placeholder="Size" 
                      className="w-24"
                      value={newFile.size} 
                      onChange={e => setNewFile(prev => ({...prev, size: e.target.value}))}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        if (selectedShipment && newFile.name) {
                          const updatedFiles = [...(selectedShipment.files || []), { 
                            name: newFile.name, 
                            size: newFile.size,
                            uploadedAt: new Date().toISOString()
                          }];
                          setSelectedShipment({...selectedShipment, files: updatedFiles} as any);
                          setNewFile({ name: '', size: '' });
                          toast.info("File queued for update");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {selectedShipment?.files && selectedShipment.files.length > 0 && (
                    <div className="mt-2 p-2 bg-slate-50 rounded border text-xs">
                      {selectedShipment.files.map((f: any, i: number) => (
                        <div key={i} className="flex justify-between py-1">
                          <span>{f.name}</span>
                          <span className="text-slate-400">{f.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Push Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
