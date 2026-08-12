"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createTour } from "@/actions/tours";
import { TourCategory } from "@belihuloya/core";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, X, Loader2, CarFront, Users, Plus } from "lucide-react";
import Image from "next/image";

export default function NewTourClient({ presetDestinations = [] }: { presetDestinations?: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tourType = searchParams.get("type") as 'private' | 'group' || 'private';

  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [category, setCategory] = useState<TourCategory>("day_tour");
  
  // Camping & Hiking specific state
  const [providedItems, setProvidedItems] = useState<string[]>([""]);
  const [routeProgram, setRouteProgram] = useState<string[]>([""]);
  const [optionalAddons, setOptionalAddons] = useState<{name: string, priceLKR: number}[]>([{name: "", priceLKR: 0}]);

  const handleStringArrayChange = (setter: any, state: string[], index: number, value: string) => {
    const next = [...state];
    next[index] = value;
    setter(next);
  };
  const handleAddStringArrayItem = (setter: any, state: string[]) => setter([...state, ""]);
  const handleRemoveStringArrayItem = (setter: any, state: string[], index: number) => setter(state.filter((_, i) => i !== index));

  const handleAddonChange = (index: number, field: 'name' | 'priceLKR', value: string | number) => {
    const next = [...optionalAddons];
    next[index] = { ...next[index], [field]: value as never };
    setOptionalAddons(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    
    // Auto-generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const perPersonFee = Number(formData.get("perPersonFee"));

    const newTour: any = {
      title,
      slug,
      tourType,
      category,
      description: formData.get("description") as string,
      imageUrl,
      features: features.filter(f => f.trim() !== ""),
    };

    if (category === 'camping_hiking') {
      newTour.durationDays = formData.get("durationDays") as string;
      newTour.startTime = formData.get("startTime") as string;
      newTour.providedItems = providedItems.filter(f => f.trim() !== "");
      newTour.optionalAddons = optionalAddons.filter(a => a.name.trim() !== "");
    } else {
      newTour.durationHours = Number(formData.get("durationHours"));
      newTour.startingPoint = formData.get("startingPoint") as string;
    }
    newTour.routeProgram = routeProgram.filter(f => f.trim() !== "");

    if (tourType === 'private') {
      newTour.pricing = {
        perPersonFee,
        perPersonWithMeals: Number(formData.get("perPersonWithMeals")),
        fullTourPrice: perPersonFee * 8, // Calculate 8x rule
        fullTourPriceWithMeals: Number(formData.get("perPersonWithMeals")) * 8,
      };
    } else {
      newTour.scheduledDate = formData.get("scheduledDate") as string;
      newTour.totalSeats = Number(formData.get("totalSeats"));
      newTour.pricing = {
        perPersonFee,
        perPersonWithMeals: Number(formData.get("perPersonWithMeals")),
      };
    }

    const res = await createTour(newTour);
    if (res.success) {
      router.push("/tours");
    } else {
      alert("Failed to create tour: " + res.error);
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
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Add New {tourType === 'private' ? 'Private Tour' : 'Group Tour'}</h2>
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
                <input required name="title" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Ohiya Camping Expedition" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Category</label>
                <select required name="category" value={category} onChange={(e) => setCategory(e.target.value as TourCategory)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="day_tour">Day Tour</option>
                  <option value="camping_hiking">Camping & Hiking</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <textarea required name="description" rows={3} className="flex w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Describe the tour experience..." />
            </div>
          </div>

          {/* Logistics & Pricing */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">Logistics & Pricing</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              
              {category === 'camping_hiking' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Duration (Days/Nights)</label>
                    <input required type="text" name="durationDays" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 2 DAYS / 1 NIGHT" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Start Time</label>
                    <input required type="text" name="startTime" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 12:00 PM" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Duration (Hours)</label>
                    <input required type="number" name="durationHours" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 8" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Starting Point</label>
                    <input required type="text" name="startingPoint" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Belihuloya Rest House" />
                  </div>
                </>
              )}

              {tourType === 'group' && (
                <>
                  <div className="space-y-2 lg:col-span-1 md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Scheduled Date & Time</label>
                    <input required type="datetime-local" name="scheduledDate" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Total Available Seats</label>
                    <input required type="number" min="1" name="totalSeats" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 15" />
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Base Fee (Without Meals) LKR</label>
                <input required type="number" name="perPersonFee" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. 3500" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Per Person (With Meals) LKR</label>
                <input type="number" name="perPersonWithMeals" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Optional" />
              </div>
            </div>

            {tourType === 'private' && (
              <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm">
                <strong>Note:</strong> The full cab price will be automatically calculated as <strong>8 &times; Base Fee</strong> when saved.
              </div>
            )}
          </div>

          {/* Route Program (For Both Day Tours & Camping) */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">Route / Program</h3>
            <p className="text-xs text-slate-500">List of destinations/stops. Click a preset or type a new one.</p>
            
            {presetDestinations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {presetDestinations.map(preset => (
                  <button 
                    key={preset}
                    type="button" 
                    onClick={() => {
                      const current = routeProgram.filter(r => r.trim() !== "");
                      if (!current.includes(preset)) {
                        setRouteProgram([...current, preset, ""]);
                      }
                    }}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:bg-orange-500 hover:text-white transition-colors border border-slate-700 hover:border-orange-500"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            )}

            {routeProgram.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input value={item} onChange={(e) => handleStringArrayChange(setRouteProgram, routeProgram, idx, e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Surathali Ella" />
                <button type="button" onClick={() => handleRemoveStringArrayItem(setRouteProgram, routeProgram, idx)} className="p-2 text-slate-400 hover:text-red-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddStringArrayItem(setRouteProgram, routeProgram)} className="text-sm text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add Stop</button>
          </div>

          {/* Conditional Camping & Hiking Fields */}
          {category === 'camping_hiking' && (
            <>
              {/* We Provide */}
              <div className="space-y-4 md:col-span-1">
                <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">We Provide</h3>
                <p className="text-xs text-slate-500">List of included camping gear.</p>
                {providedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input value={item} onChange={(e) => handleStringArrayChange(setProvidedItems, providedItems, idx, e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Camping Tent Accommodation" />
                    <button type="button" onClick={() => handleRemoveStringArrayItem(setProvidedItems, providedItems, idx)} className="p-2 text-slate-400 hover:text-red-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddStringArrayItem(setProvidedItems, providedItems)} className="text-sm text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add Item</button>
              </div>

              {/* Optional Add-ons */}
              <div className="space-y-4 md:col-span-2 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">Optional Add-ons</h3>
                <p className="text-xs text-slate-500">Extra options available for purchase.</p>
                {optionalAddons.map((addon, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex-1 w-full">
                      <input value={addon.name} onChange={(e) => handleAddonChange(idx, 'name', e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Horton Plains Guide & Tickets" />
                    </div>
                    <div className="w-full sm:w-48 relative">
                      <input type="number" value={addon.priceLKR || ''} onChange={(e) => handleAddonChange(idx, 'priceLKR', Number(e.target.value))} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 pl-3 pr-12 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Price" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">LKR</span>
                    </div>
                    <button type="button" onClick={() => setOptionalAddons(optionalAddons.filter((_, i) => i !== idx))} className="p-2 text-slate-400 hover:text-red-400 self-end sm:self-auto">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setOptionalAddons([...optionalAddons, {name: "", priceLKR: 0}])} className="text-sm text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add Optional Add-on</button>
              </div>
            </>
          )}

          {/* Features (General) */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-slate-200 border-b border-slate-800 pb-2">General Tour Features</h3>
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input value={feature} onChange={(e) => handleStringArrayChange(setFeatures, features, idx, e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. Private safari cab only for you" />
                <button type="button" onClick={() => handleRemoveStringArrayItem(setFeatures, features, idx)} className="p-2 text-slate-400 hover:text-red-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddStringArrayItem(setFeatures, features)} className="text-sm text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Add Feature</button>
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

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-orange-500 text-slate-50 hover:bg-orange-600 h-11 px-8">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Tour Package
          </button>
        </div>
      </form>
    </div>
  );
}


