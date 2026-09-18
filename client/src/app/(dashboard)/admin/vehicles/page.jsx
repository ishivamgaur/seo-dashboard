"use client";

import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  
  // form state
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      if (data.success) setVehicles(data.data || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('capacity', capacity);
    formData.append('price', price);
    if (image) formData.append('image', image);

    const vehicleId = editingVehicle?.id || editingVehicle?._id;
    const url = editingVehicle ? `/api/vehicles/${vehicleId}` : '/api/vehicles';
    const method = editingVehicle ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchVehicles();
      }
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      if (res.ok) fetchVehicles();
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setName('');
    setCapacity('');
    setPrice('');
    setImage(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setName(vehicle.name || '');
    setCapacity(vehicle.capacity || '');
    setPrice(vehicle.price || '');
    setImage(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Vehicles</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#FFAD00] hover:bg-black text-white px-4 py-2 rounded-[8px] transition-colors"
        >
          <Plus size={20} />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[12px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 text-zinc-500 font-medium border-b border-zinc-200">
              <th className="px-6 py-4 w-24">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-zinc-500">Loading...</td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-zinc-500">No vehicles found.</td>
              </tr>
            ) : (
              vehicles.map((vehicle) => {
                const id = vehicle.id || vehicle._id;
                return (
                  <tr key={id} className="text-zinc-900 border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="px-6 py-4">
                      {vehicle.imageUrl && (
                        <img src={vehicle.imageUrl} alt={vehicle.name} className="w-16 h-12 object-cover rounded" />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{vehicle.name}</td>
                    <td className="px-6 py-4">{vehicle.capacity}</td>
                    <td className="px-6 py-4">{vehicle.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(vehicle)}
                        className="p-2 text-zinc-500 hover:text-[#FFAD00] hover:bg-[#FFAD00]/10 rounded-md transition-colors mr-2 inline-flex"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors inline-flex"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm">
          <div className="bg-white rounded-[12px] p-6 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-zinc-900">
                {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-zinc-700 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00]/50 focus:border-[#FFAD00] outline-none transition-shadow"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Capacity</label>
                <input
                  type="text"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00]/50 focus:border-[#FFAD00] outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00]/50 focus:border-[#FFAD00] outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Image</label>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full bg-white text-zinc-900 border border-zinc-200 rounded-[8px] px-3 py-2 focus:ring-2 focus:ring-[#FFAD00]/50 focus:border-[#FFAD00] outline-none transition-shadow"
                  accept="image/*"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-[8px] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FFAD00] hover:bg-black text-white rounded-[8px] transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
