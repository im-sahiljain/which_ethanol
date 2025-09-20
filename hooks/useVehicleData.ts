// import { useEffect, useState, useCallback } from "react";
// import type { VehicleBrands, ModelNames } from "@/lib/models/vehicle";

// export function useVehicleData(filters: { brand?: string; model?: string }) {
//   const [brands, setBrands] = useState<VehicleBrands[]>([]);
//   const [models, setModels] = useState<ModelNames[]>([]);
//   const [years, setYears] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);

//   // fetch functions wrapped in useCallback so they’re memoized
//   const loadBrands = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/vehicles/brands");
//       const data = await res.json();
//       setBrands(data.brands || []);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const loadModels = useCallback(async (brand_id: string) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/vehicles/models?brand_id=${brand_id}`);
//       const data = await res.json();
//       setModels(data.models || []);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const loadYears = useCallback(async (model_id: string) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/vehicles/years?model_id=${model_id}`);
//       const data = await res.json();
//       setYears(data.years || []);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // load brands on mount
//   useEffect(() => {
//     loadBrands();
//   }, [loadBrands]);

//   // load models when brand changes
//   useEffect(() => {
//     if (filters.brand) {
//       loadModels(filters.brand);
//     } else {
//       setModels([]);
//       setYears([]);
//     }
//   }, [filters.brand, loadModels]);

//   // load years when model changes
//   useEffect(() => {
//     if (filters.brand && filters.model) {
//       loadYears(filters.model);
//     } else {
//       setYears([]);
//     }
//   }, [filters.brand, filters.model, loadYears]);

//   return {
//     brands,
//     models,
//     years,
//     loading,
//     reloadBrands: loadBrands,
//     reloadModels: loadModels,
//     reloadYears: loadYears,
//   };
// }

import { useEffect, useState, useCallback } from "react";
import type { VehicleBrands, ModelNames } from "@/lib/models/vehicle";

export function useVehicleData() {
  const [brands, setBrands] = useState<VehicleBrands[]>([]);
  const [models, setModels] = useState<ModelNames[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch brands
  const loadBrands = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vehicles/brands");
      const data = await res.json();
      setBrands(data.brands || []);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch models for a brand
  const loadModels = useCallback(async (brand_id?: string) => {
    try {
      setLoading(true);
      // console.log("brand_id", brand_id);
      // const res = await fetch(`/api/vehicles/models?brand_id=${brand_id}`);
      const res = await fetch(`/api/vehicles/allModels`);
      const data = await res.json();
      setModels(data.models || []);
      // clear years if brand changes
      setYears([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch years for a model
  const loadYears = useCallback(async (model_id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/vehicles/years?model_id=${model_id}`);
      const data = await res.json();
      setYears(data.years || []);
    } finally {
      setLoading(false);
    }
  }, []);

  // load brands once on mount
  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  return {
    brands,
    models,
    years,
    loading,
    loadBrands,
    loadModels,
    loadYears,
  };
}
