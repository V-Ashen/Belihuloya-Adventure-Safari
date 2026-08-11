"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTour } from "@/actions/tours";
import { TourCategory, Tour } from "@belihuloya/core";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, X, Loader2, CarFront, Users } from "lucide-react";
import Image from "next/image";

export default function EditTourForm({ tour }: { tour: Tour }) {
  const router = useRouter();
  const tourType = tour.tourType; // locked

  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(tour.imageUrl || "");
  const [features, setFeatures] = useState<string[]>(tour.features.length > 0 ? tour.features : [""]);

  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    
    // Auto-generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const perPersonFee = Number(formData.get("perPersonFee"));

    const updatedTour: any = {
      title,
      slug,
      category: formData.get("category") as TourCategory,
      description: formData.get("description") as string,
      durationHours: Number(formData.get("durationHours")),
      imageUrl,
      features: features.filter(f => f.trim() !== ""),
    };

    if (tourType === 'private') {
      updatedTour.pricing = {
        perPersonFee,
        perPersonWithMeals: Number(formData.get("perPersonWithMeals")),
        fullTourPrice: perPersonFee * 8, // Calculate 8x rule
        fullTourPriceWithMeals: Number(formData.get("perPersonWithMeals")) * 8,
      };
    } else {
      updatedTour.scheduledDate = formData.get("scheduledDate") as string;
      updatedTour.pricing = {
        perPersonFee,
        perPersonWithMeals: Number(formData.get("perPersonWithMeals")),
      };
    }

    const res = await updateTour(tour.id as string, updatedTour);
    if (res.success) {
      router.push("/tours");
    } else {
      alert("Failed to update tour: " + res.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <div className={`p-3 rounded-xl border ${tourType === 'private' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-blue-500/20 border-blue-500 text-blue-400'}`}>
          {tourType === 'private' ? <CarFront className="w-6 h-6" /> : <Users className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Edit {tourType === 'private' ? 'Private Tour' : 'Group Tour'}</h2>
          <p className="text-slate-400">
            {tourType === 'private' 
              ? 'Customers will book the entire cab. Full price is automatically calculated as 8x the per person fee.' 
              : 'Customers will join a scheduled tour. They pay individually.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Basic Info */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Tour Title</label>
                <input required name="title" defaultValue={tour.title} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Hirikatu Oya River Camping" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Category</label>
                <select required name="category" defaultValue={tour.category} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="camping_hiking">Camping & Hiking</option>
                  <option value="day_tour">Day Tour</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea required name="description" defaultValue={tour.description} rows={3} className="flex w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Describe the tour experience..." />
            </div>
          </div>

          {/* Logistics & Pricing */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">Logistics & Pricing</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Duration (Hours)</label>
                <input required type="number" name="durationHours" defaultValue={tour.durationHours} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 8" />
              </div>

              {tourType === 'group' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Scheduled Date & Time</label>
                  <input required type="datetime-local" name="scheduledDate" defaultValue={tour.scheduledDate} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Base Fee (Without Meals) LKR</label>
                <input required type="number" name="perPersonFee" defaultValue={tour.pricing.perPersonFee} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 3500" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Per Person (With Meals) LKR</label>
                <input type="number" name="perPersonWithMeals" defaultValue={tour.pricing.perPersonWithMeals} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Optional" />
              </div>
            </div>

            {tourType === 'private' && (
              <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm">
                <strong>Note:</strong> The full cab price will be automatically calculated as <strong>8 &times; Base Fee</strong> when saved.
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">Tour Features</h3>
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input value={feature} onChange={(e) => handleFeatureChange(idx, e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Private safari cab only for you" />
                <button type="button" onClick={() => handleRemoveFeature(idx)} className="p-2 text-slate-400 hover:text-red-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddFeature} className="text-sm text-orange-500 hover:text-orange-400 font-medium">+ Add Feature</button>
          </div>

          {/* Image Upload */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">Cover Image</h3>
            
            {imageUrl ? (
              <div className="relative h-64 w-full md:w-1/2 rounded-xl overflow-hidden border border-slate-700">
                <Image src={imageUrl} alt="Cover" fill className="object-cover" />
                <button type="button" onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <CldUploadWidget 
                uploadPreset="belihuloya_tours" // This preset needs to be created in Cloudinary
                onSuccess={(result: any) => {
                  setImageUrl(result.info.secure_url);
                }}
              >
                {({ open }) => {
                  return (
                    <button type="button" onClick={() => open()} className="flex flex-col items-center justify-center w-full md:w-1/2 h-64 border-2 border-dashed border-slate-700 rounded-xl hover:bg-slate-900 hover:border-orange-500 transition-colors text-slate-400">
                      <Upload className="w-10 h-10 mb-4" />
                      <span className="font-medium text-slate-300">Upload Cover Image</span>
                      <span className="text-sm mt-1">Supports JPG, PNG (Max 5MB)</span>
                    </button>
                  );
                }}
              </CldUploadWidget>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-800">
          <button type="button" onClick={() => router.push("/tours")} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300 h-11 px-8">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-orange-500 text-slate-50 hover:bg-orange-600 h-11 px-8">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
