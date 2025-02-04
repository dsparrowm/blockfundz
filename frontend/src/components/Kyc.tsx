"use client"

import { useState, useEffect } from "react";
import {
    ShieldCheck, ArrowLeft, User, CreditCard, FileText,
    Loader2, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type FormData = {
    personal: {
        firstName: string
        lastName: string
        ssn: string
        city: string
        phone: string
        gender: string
        address: string
        state: string
        zip: string
        dob: string
    }
    bank: {
        accountHolderName: string
        bankName: string
        accountNumber: string
        routingNumber: string
        branch: string
    }
    documents: {
        documentType: string
        frontId?: File
        backId?: File
        holdingId?: File
    }
}


export function KYCVerification() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        personal: {
            firstName: '',
            lastName: '',
            ssn: '',
            city: '',
            phone: '',
            gender: '',
            address: '',
            state: '',
            zip: '',
            dob: ''
        },
        bank: {
            accountHolderName: '',
            bankName: '',
            accountNumber: '',
            routingNumber: '',
            branch: ''
        },
        documents: {
            documentType: ''
        }
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(33);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'personal-info' | 'bank-details' | 'document-upload'>('personal-info');

    useEffect(() => {
        if (isDialogOpen) {
            localStorage.setItem('kycFormData', JSON.stringify(formData));
        }
    }, [formData, isDialogOpen]);

    useEffect(() => {
        const savedData = localStorage.getItem('kycFormData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (activeTab === 'personal-info') {
            if (!formData.personal.firstName) newErrors.firstName = "First name is required";
            if (!formData.personal.lastName) newErrors.lastName = "Last name is required";
            if (!formData.personal.ssn) newErrors.ssn = "SSN is required";
            if (!formData.personal.city) newErrors.city = "City is required";
            if (!formData.personal.phone) newErrors.phone = "Phone is required";
            if (!formData.personal.gender) newErrors.gender = "Gender is required";
            if (!formData.personal.address) newErrors.address = "Address is required";
            if (!formData.personal.state) newErrors.state = "State/Province is required";
            if (!formData.personal.zip) newErrors.zip = "ZIP/Postal Code is required";
            if (!formData.personal.dob) newErrors.dob = "Date of birth is required";
        }

        if (activeTab === 'bank-details') {
            if (!formData.bank.accountHolderName) newErrors.accountHolderName = "Account holder name is required";
            if (!formData.bank.bankName) newErrors.bankName = "Bank name is required";
            if (!formData.bank.accountNumber) newErrors.accountNumber = "Account number is required";
            if (!formData.bank.routingNumber) newErrors.routingNumber = "Routing number is required";
            if (!formData.bank.branch) newErrors.branch = "Bank branch is required";
        }

        if (activeTab === 'document-upload') {
            if (!formData.documents.documentType) newErrors.documentType = "Document type is required";
            if (!formData.documents.frontId) newErrors.frontId = "Front of ID is required";
            if (!formData.documents.backId) newErrors.backId = "Back of ID is required";
            if (!formData.documents.holdingId) newErrors.holdingId = "Holding ID photo is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        const tabsOrder = ['personal-info', 'bank-details', 'document-upload'];
        const currentIndex = tabsOrder.indexOf(activeTab);
        if (currentIndex < 2) {
            setActiveTab(tabsOrder[currentIndex + 1] as typeof activeTab);
            setProgress(((currentIndex + 2) / 3) * 100);
        }
    };

    const handlePrevious = () => {
        const tabsOrder = ['personal-info', 'bank-details', 'document-upload'];
        const currentIndex = tabsOrder.indexOf(activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabsOrder[currentIndex - 1] as typeof activeTab);
            setProgress(((currentIndex) / 3) * 100);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setNotification({ type: 'success', message: 'Verification submitted successfully!' });
            localStorage.removeItem('kycFormData');
            setTimeout(() => setIsDialogOpen(false), 2000);
        } catch (error) {
            setNotification({ type: 'error', message: 'Submission failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (field: 'frontId' | 'backId' | 'holdingId', file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, [field]: 'File size must be less than 5MB' });
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setErrors({ ...errors, [field]: 'Invalid file type (JPEG, PNG only)' });
            return;
        }

        setFormData({
            ...formData,
            documents: { ...formData.documents, [field]: file }
        });
        setErrors({ ...errors, [field]: '' });
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-transparent rounded-xl shadow-lg mt-12">
            <div className="text-center space-y-6">
                <div className="inline-block p-4 bg-blue-50 rounded-full">
                    <ShieldCheck className="w-12 h-12 text-blue-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-800">
                    Identity Verification Required
                </h1>

                <p className="text-gray-600 text-lg leading-relaxed">
                    To ensure the highest security standards and comply with financial regulations,
                    we need to verify your identity. This helps prevent fraud and protects all users.
                </p>

                <div className="space-y-4">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <button
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                                onClick={() => setIsDialogOpen(true)}
                            >
                                Start Verification
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                            {notification && (
                                <div className={`p-4 rounded-lg flex items-center gap-2 ${notification.type === 'success'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {notification.type === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5" />
                                    )}
                                    <span>{notification.message}</span>
                                </div>
                            )}

                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <User className="w-6 h-6" />
                                    KYC Verification
                                </DialogTitle>
                                <div className="h-2 bg-gray-100 mt-4">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </DialogHeader>

                            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="personal-info" className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Personal Info
                                    </TabsTrigger>
                                    <TabsTrigger value="bank-details" className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Bank Details
                                    </TabsTrigger>
                                    <TabsTrigger value="document-upload" className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Documents
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="personal-info">
                                    <div className="p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                                                <input
                                                    id="firstName"
                                                    type="text"
                                                    className={`w-full p-3 border rounded-lg ${errors.firstName ? 'border-red-500' : ''}`}
                                                // ... keep existing value and onChange
                                                />
                                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                                                <input
                                                    id="lastName"
                                                    type="text"
                                                // ... keep existing
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="ssn" className="block text-sm font-medium mb-1">SSN</label>
                                                <input
                                                    id="ssn"
                                                    type="text"
                                                    className={`w-full p-3 border rounded-lg ${errors.ssn ? 'border-red-500' : ''}`}
                                                    value={formData.personal.ssn}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, ssn: e.target.value }
                                                    })}
                                                />
                                                {errors.ssn && <p className="text-red-500 text-sm mt-1">{errors.ssn}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                                                    value={formData.personal.phone}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, phone: e.target.value }
                                                    })}
                                                />
                                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                                                <input
                                                    id="city"
                                                    type="text"
                                                    className={`w-full p-3 border rounded-lg ${errors.city ? 'border-red-500' : ''}`}
                                                    value={formData.personal.city}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, city: e.target.value }
                                                    })}
                                                />
                                                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="state" className="block text-sm font-medium mb-1">State/Province</label>
                                                <input
                                                    id="state"
                                                    type="text"
                                                    className={`w-full p-3 border rounded-lg ${errors.state ? 'border-red-500' : ''}`}
                                                    value={formData.personal.state}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, state: e.target.value }
                                                    })}
                                                />
                                                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="zip" className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
                                                <input
                                                    id="zip"
                                                    type="text"
                                                    className={`w-full p-3 border rounded-lg ${errors.zip ? 'border-red-500' : ''}`}
                                                    value={formData.personal.zip}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, zip: e.target.value }
                                                    })}
                                                />
                                                {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                                            <input
                                                id="address"
                                                type="text"
                                                className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : ''}`}
                                                value={formData.personal.address}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    personal: { ...formData.personal, address: e.target.value }
                                                })}
                                            />
                                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
                                                <select
                                                    id="gender"
                                                    className={`w-full p-3 border rounded-lg ${errors.gender ? 'border-red-500' : ''}`}
                                                    value={formData.personal.gender}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, gender: e.target.value }
                                                    })}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="dob" className="block text-sm font-medium mb-1">Date of Birth</label>
                                                <input
                                                    id="dob"
                                                    type="date"
                                                    className={`w-full p-3 border rounded-lg ${errors.dob ? 'border-red-500' : ''}`}
                                                    value={formData.personal.dob}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        personal: { ...formData.personal, dob: e.target.value }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="bank-details">
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <label htmlFor="accountHolderName" className="block text-sm font-medium mb-1">Account Holder Name</label>
                                            <input
                                                id="accountHolderName"
                                                type="text"
                                                className={`w-full p-3 border rounded-lg ${errors.accountHolderName ? 'border-red-500' : ''}`}
                                                value={formData.bank.accountHolderName}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    bank: { ...formData.bank, accountHolderName: e.target.value }
                                                })}
                                            />
                                            {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
                                        </div>
                                        <label htmlFor="bankName" className="block text-sm font-medium mb-1">Bank Name</label>
                                        <input
                                            id="bankName"
                                            type="text"
                                            placeholder="Bank Name"
                                            className={`w-full p-3 border rounded-lg ${errors.bankName ? 'border-red-500' : ''}`}
                                            value={formData.bank.bankName}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                bank: { ...formData.bank, bankName: e.target.value }
                                            })}
                                        />
                                        {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
                                        <div>
                                            <label htmlFor="branch" className="block text-sm font-medium mb-1">Bank Branch</label>
                                            <input
                                                id="branch"
                                                type="text"
                                                className={`w-full p-3 border rounded-lg ${errors.branch ? 'border-red-500' : ''}`}
                                                value={formData.bank.branch}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    bank: { ...formData.bank, branch: e.target.value }
                                                })}
                                            />
                                            {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="accountNumber" className="block text-sm font-medium mb-1">Account Number</label>
                                                <input
                                                    id="accountNumber"
                                                    type="text"
                                                    placeholder="Account Number"
                                                    className={`w-full p-3 border rounded-lg ${errors.accountNumber ? 'border-red-500' : ''}`}
                                                    value={formData.bank.accountNumber}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        bank: { ...formData.bank, accountNumber: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
                                            <div>
                                                <label htmlFor="routingNumber" className="block text-sm font-medium mb-1">Routing Number</label>
                                                <input
                                                    id="routingNumber"
                                                    type="text"
                                                    placeholder="Routing Number"
                                                    className={`w-full p-3 border rounded-lg ${errors.routingNumber ? 'border-red-500' : ''}`}
                                                    value={formData.bank.routingNumber}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        bank: { ...formData.bank, routingNumber: e.target.value }
                                                    })}
                                                />
                                            </div>
                                            {errors.routingNumber && <p className="text-red-500 text-sm mt-1">{errors.routingNumber}</p>}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="document-upload">
                                    <div className="p-4 space-y-6">
                                        <div>
                                            <label htmlFor="documentType" className="block text-sm font-medium mb-1">Document Type</label>
                                            <select
                                                id="documentType"
                                                className={`w-full p-3 border rounded-lg ${errors.documentType ? 'border-red-500' : ''}`}
                                                value={formData.documents.documentType}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    documents: { ...formData.documents, documentType: e.target.value }
                                                })}
                                            >
                                                <option value="">Select Document Type</option>
                                                <option value="passport">Passport</option>
                                                <option value="drivers_license">Driver's License</option>
                                                <option value="national_id">National ID</option>
                                            </select>
                                            {errors.documentType && <p className="text-red-500 text-sm mt-1">{errors.documentType}</p>}
                                        </div>

                                        <div className={`border-2 border-dashed rounded-xl p-8 text-center ${errors.frontId ? 'border-red-500' : 'border-gray-300'
                                            }`}>
                                            <label htmlFor="frontId" className="block text-sm font-medium mb-2">Front of ID</label>
                                            <input
                                                id="frontId"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileChange('frontId', e.target.files[0])}
                                            />
                                            {errors.frontId && <p className="text-red-500 text-sm mt-1">{errors.frontId}</p>}
                                        </div>

                                        <div className={`border-2 border-dashed rounded-xl p-8 text-center ${errors.backId ? 'border-red-500' : 'border-gray-300'
                                            }`}>
                                            <label htmlFor="backId" className="block text-sm font-medium mb-2">Back of ID</label>
                                            <input
                                                id="backId"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileChange('backId', e.target.files[0])}
                                            />
                                            {errors.backId && <p className="text-red-500 text-sm mt-1">{errors.backId}</p>}
                                        </div>

                                        <div className={`border-2 border-dashed rounded-xl p-8 text-center ${errors.holdingId ? 'border-red-500' : 'border-gray-300'
                                            }`}>
                                            <label htmlFor="holdingId" className="block text-sm font-medium mb-2">Photo Holding ID</label>
                                            <input
                                                id="holdingId"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileChange('holdingId', e.target.files[0])}
                                            />
                                            {errors.holdingId && <p className="text-red-500 text-sm mt-1">{errors.holdingId}</p>}
                                        </div>
                                    </div>
                                </TabsContent>

                                <div className="flex justify-between items-center p-4">
                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        disabled={activeTab === 'personal-info' || isLoading}
                                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Previous
                                    </button>

                                    {activeTab === 'document-upload' ? (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Submit Verification
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNext}
                                            disabled={isLoading}
                                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </Tabs>
                        </DialogContent>
                    </Dialog>

                    <a
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Return to Dashboard
                    </a>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className="w-2 h-2 rounded-full bg-gray-200"
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Typical verification takes less than 5 minutes
                    </p>
                </div>
            </div>
        </div>
    );
}

export default KYCVerification;