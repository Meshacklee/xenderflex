import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck,
  AlertCircle,
  Download,
  Shield,
  Loader2,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface Shipment {
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
  history: Array<{
    status: string;
    location: string;
    timestamp: any;
    message: string;
  }>;
  files?: Array<{ name: string; size: string; uploadedAt: string }>;
}

export function Tracking() {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchShipment(id);
    }
  }, [id]);

  const fetchShipment = async (trackingId: string) => {
    setLoading(true);
    try {
      // Fetch specifically by document ID (which is the tracking ID)
      // This is a 'get' operation, which is allowed publicly in our rules
      const docRef = doc(db, 'shipments', trackingId);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        setError("Tracking ID not found in our global network.");
      } else {
        setShipment(snapshot.data() as Shipment);
      }
    } catch (err) {
      setError("Unable to retrieve tracking data.");
      handleFirestoreError(err, OperationType.GET, `shipments/${trackingId}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium tracking-tight uppercase text-xs">Accessing Distributed Ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen pt-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Tracking Error</h1>
                <p className="text-slate-600">{error || "Could not find your shipment."}</p>
              </div>
              <Button className="bg-blue-600" onClick={() => window.location.href = '/'}>
                Try New Search
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep(shipment.status);

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {!shipment.isApproved ? (
                  <Badge variant="destructive" className="animate-pulse text-xs py-0.5 px-2">
                    WAITING FOR APPROVAL
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 text-xs py-0.5 px-2">
                    VERIFIED SHIPMENT
                  </Badge>
                )}
                <div className="flex items-center text-slate-400 text-xs text-nowrap">
                  <Clock className="h-3 w-3 mr-1" />
                  Last Updated: {shipment.lastUpdated?.toDate ? format(shipment.lastUpdated.toDate(), 'PPP HH:mm') : 'N/A'}
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 uppercase">{shipment.trackingId}</h1>
              <p className="text-slate-500 mt-1">Originating from <span className="font-semibold text-slate-700">{shipment.origin}</span> &mdash; Destined for <span className="font-semibold text-slate-700">{shipment.destination}</span></p>
            </div>
            
            <div className="flex gap-4">
              <Button variant="outline" className="border-slate-200">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                Proof of Delivery
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                View Assets
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="border-none shadow-md">
            <CardContent className="pt-10 pb-8">
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10" />
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-blue-500 transition-all duration-1000 -z-10" 
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
                
                <div className="flex justify-between">
                  {[
                    { label: 'Pending', icon: Clock },
                    { label: 'Picked Up', icon: Package },
                    { label: 'In Transit', icon: Truck },
                    { label: 'Out for Delivery', icon: PackageCheck },
                    { label: 'Delivered', icon: CheckCircle2 }
                  ].map((step, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isActive = idx === currentStep;
                    return (
                      <div key={idx} className="flex flex-col items-center group">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                          isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-200 text-slate-400'
                        } ${isActive ? 'ring-4 ring-blue-100' : ''}`}>
                          <step.icon className={`h-5 w-5 ${isCompleted ? 'animate-pulse' : ''}`} />
                        </div>
                        <span className={`mt-4 text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-blue-600' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-12 grid md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Location</h4>
                    <p className="text-xl font-bold text-slate-900">{shipment.currentLocation}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</h4>
                    <p className="text-xl font-bold text-slate-900 capitalize">{shipment.status.replace(/_/g, ' ').toLowerCase()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travel History Table */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="md:col-span-2 border-none shadow-md h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Tracking History</CardTitle>
                <CardDescription>Real-time audit log of your shipment's movement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-0 p-0">
                {shipment.history && shipment.history.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {[...shipment.history].reverse().map((item, idx) => (
                      <div key={idx} className="p-6 hover:bg-slate-50/50 transition-colors flex gap-6">
                        <div className="text-slate-400 font-mono text-[10px] w-24 pt-1">
                          {format(item.timestamp?.toDate ? item.timestamp.toDate() : item.timestamp, 'MMM dd, HH:mm')}
                        </div>
                        <div className="relative flex flex-col pt-1">
                          <div className={`absolute top-0 bottom-0 left-[5px] w-[2px] bg-slate-100 -z-10 ${idx === shipment.history.length - 1 ? 'hidden' : ''}`} />
                          <div className={`h-3 w-3 rounded-full mt-1.5 ${idx === 0 ? 'bg-blue-600 scale-125' : 'bg-slate-200'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900 text-sm uppercase">{item.status.replace(/_/g, ' ')}</span>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="text-slate-500 text-xs font-medium">{item.location}</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{item.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500 italic">No history available for this ID.</div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="border-none shadow-md bg-blue-600 text-white overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Need Support?</CardTitle>
                  <CardDescription className="text-blue-100">Our logistics experts are available 24/7 for SendDrop Priority customers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold uppercase tracking-tight text-xs">
                    Contact Concierge
                  </Button>
                </CardContent>
                <div className="absolute -bottom-4 -right-4 opacity-10">
                  <Shield className="h-32 w-32" />
                </div>
              </Card>

              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Shipment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sender</p>
                    <p className="text-sm font-medium text-slate-900">{shipment.senderEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recipient</p>
                    <p className="text-sm font-medium text-slate-900">{shipment.recipientEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weight / Size</p>
                    <p className="text-sm font-medium text-slate-900">{shipment.weight || 'Virtual Envelope (Secure)'}</p>
                  </div>
                  <Separator />
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Service Type</p>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-bold text-slate-900">SendDrop Express AI</span>
                    </div>
                  </div>
                  {shipment.files && shipment.files.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Digital Assets</p>
                      <div className="space-y-2">
                        {shipment.files.map((file: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 group">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Package className="h-3 w-3 text-blue-500 shrink-0" />
                              <span className="text-xs font-medium text-slate-700 truncate">{file.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
