'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Edit2, Trash2, Plus, X, CarFront, ArrowUp, ArrowDown, GripVertical, Search } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '@/lib/api';
import FilterSelect from '@/components/common/FilterSelect';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('all');

  const [vehicleName, setVehicleName] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles');
      if (res.data?.success) setVehicles(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchVehicles();
  }, []);

  const showToast = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch = v.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const seats = Number(v.seatingCapacity) || 0;
      if (capacityFilter === '9-12') return seats >= 9 && seats <= 12;
      if (capacityFilter === '13-16') return seats >= 13 && seats <= 16;
      if (capacityFilter === '17+') return seats >= 17;
      return true;
    });
  }, [vehicles, searchQuery, capacityFilter]);

  const isFilterActive = searchQuery !== '' || capacityFilter !== 'all';

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    if (isFilterActive) {
      showToast('Clear search filters before reordering fleet.');
      return;
    }

    const newVehicles = Array.from(vehicles);
    const [moved] = newVehicles.splice(result.source.index, 1);
    newVehicles.splice(result.destination.index, 0, moved);

    setVehicles(newVehicles);

    const orderPayload = newVehicles.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      await api.patch('/vehicles/reorder', { order: orderPayload });
      showToast('Fleet showroom display order updated.');
    } catch (err) {
      console.error('Failed to reorder vehicles', err);
      fetchVehicles();
    }
  };

  const handleMove = async (index, direction) => {
    const newVehicles = [...vehicles];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newVehicles.length) return;

    const [moved] = newVehicles.splice(index, 1);
    newVehicles.splice(targetIndex, 0, moved);

    setVehicles(newVehicles);

    const orderPayload = newVehicles.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      await api.patch('/vehicles/reorder', { order: orderPayload });
      showToast('Fleet display order updated.');
    } catch (err) {
      console.error('Failed to reorder vehicles', err);
      fetchVehicles();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('vehicleName', vehicleName);
    formData.append('seatingCapacity', seatingCapacity);
    formData.append('description', description);
    
    const featArray = features
      ? features.split(',').map((f) => f.trim()).filter(Boolean)
      : [];
    formData.append('features', JSON.stringify(featArray));

    if (image) {
      formData.append('image', image);
    } else if (imageUrl) {
      formData.append('image', imageUrl);
    }

    const vehicleId = editingVehicle?.id;
    const url = editingVehicle ? `/vehicles/${vehicleId}` : '/vehicles';
    const method = editingVehicle ? 'put' : 'post';

    try {
      const res = await api[method](url, formData);
      if (res.status === 200 || res.status === 201) {
        setIsModalOpen(false);
        resetForm();
        fetchVehicles();
        showToast(editingVehicle ? 'Vehicle updated successfully.' : 'Vehicle added to fleet.');
      }
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this vehicle listing?')) return;
    try {
      const res = await api.delete(`/vehicles/${id}`);
      if (res.status === 200) {
        fetchVehicles();
        showToast('Vehicle deleted successfully.');
      }
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
    }
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setVehicleName('');
    setSeatingCapacity('');
    setDescription('');
    setFeatures('');
    setImage(null);
    setImageUrl('');
    setImagePreviewUrl('');
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (v) => {
    setEditingVehicle(v);
    setVehicleName(v.vehicleName || '');
    setSeatingCapacity(v.seatingCapacity?.toString() || '');
    setDescription(v.description || '');
    const featList = Array.isArray(v.features)
      ? v.features.join(', ')
      : typeof v.features === 'string'
      ? JSON.parse(v.features || '[]').join(', ')
      : '';
    setFeatures(featList);
    setImage(null);
    setImageUrl(v.image || '');
    setImagePreviewUrl(v.image || '');
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-8xl min-h-full space-y-4 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
            Fleet Vehicles Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Drag rows via grip handle to reorder showroom priority on the live homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMsg && (
            <span className="text-xs font-mono text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-3 py-1.5 rounded-lg font-medium">
              {statusMsg}
            </span>
          )}

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#13161c] rounded-xl p-3 relative z-20 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400 stroke-[1.75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicles by model or feature..."
            className="w-full pl-9 pr-3 py-2 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-teal-500 outline-none font-medium border-0"
          />
        </div>

        <div className="flex items-center gap-2 overflow-visible">
          <FilterSelect
            label="Capacity"
            value={capacityFilter}
            onChange={setCapacityFilter}
            options={[
              { value: 'all', label: 'All Fleet' },
              { value: '9-12', label: '9-12 Seats' },
              { value: '13-16', label: '13-16 Seats' },
              { value: '17+', label: '17+ Seats' },
            ]}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#13161c] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[850px]">
            <div className="grid grid-cols-[144px_120px_220px_120px_minmax(0,1fr)_100px] items-center bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider text-[11px] border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="px-5 py-3.5 whitespace-nowrap">Drag / Order</div>
              <div className="px-5 py-3.5">Preview</div>
              <div className="px-5 py-3.5">Vehicle Model</div>
              <div className="px-5 py-3.5">Capacity</div>
              <div className="px-5 py-3.5">Features</div>
              <div className="px-5 py-3.5 text-right">Actions</div>
            </div>

            {isLoading ? (
              <div className="px-5 py-8 text-center text-zinc-500 font-mono text-xs">
                Loading fleet inventory...
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="px-5 py-12 text-center text-zinc-500 font-mono text-xs">
                <div className="max-w-sm mx-auto space-y-2">
                  <CarFront className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300">No vehicles found</p>
                  <p className="text-xs text-zinc-500">Try adjusting your search terms or add a new vehicle to the fleet.</p>
                </div>
              </div>
            ) : !isMounted ? (
              <div className="divide-y divide-zinc-100/70 dark:divide-zinc-800/40">
                {filteredVehicles.map((v, index) => {
                  const featArray = Array.isArray(v.features)
                    ? v.features
                    : typeof v.features === 'string'
                    ? JSON.parse(v.features || '[]')
                    : [];

                  return (
                    <div
                      key={v.id}
                      className="grid grid-cols-[144px_120px_220px_120px_minmax(0,1fr)_100px] items-center text-xs text-zinc-900 dark:text-zinc-100 hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80 transition-colors"
                    >
                      <div className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="p-1 text-zinc-300 dark:text-zinc-600">
                            <GripVertical className="w-3.5 h-3.5 stroke-[1.75]" />
                          </div>
                          <div className="flex flex-col -space-y-0.5 opacity-25">
                            <span className="p-0.5 text-zinc-400"><ArrowUp className="w-2.5 h-2.5 stroke-[2]" /></span>
                            <span className="p-0.5 text-zinc-400"><ArrowDown className="w-2.5 h-2.5 stroke-[2]" /></span>
                          </div>
                          <span className="font-mono text-xs tabular-nums font-semibold text-zinc-400 dark:text-zinc-500 w-5 text-center select-none">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div className="px-5 py-3.5">
                        <div className="relative w-20 h-12 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                          {v.image ? (
                            <img src={v.image} alt={v.vehicleName} className="object-contain w-full h-full" />
                          ) : (
                            <CarFront className="w-5 h-5 text-zinc-400" />
                          )}
                        </div>
                      </div>
                      <div className="px-5 py-3.5 font-bold text-zinc-950 dark:text-white truncate">
                        {v.vehicleName}
                      </div>
                      <div className="px-5 py-3.5 font-mono tabular-nums font-semibold">
                        {v.seatingCapacity} Seats
                      </div>
                      <div className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-sm">
                          {featArray.slice(0, 3).map((feat, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#1a1e27] text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
                              {feat}
                            </span>
                          ))}
                          {featArray.length > 3 && (
                            <span className="text-[10px] font-mono text-zinc-400">+{featArray.length - 3}</span>
                          )}
                        </div>
                      </div>
                      <div className="px-5 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openEditModal(v)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 stroke-[1.75]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.75]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="vehicles-list-droppable">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="divide-y divide-zinc-100/70 dark:divide-zinc-800/40"
                    >
                      {filteredVehicles.map((v, index) => {
                        const id = v.id.toString();
                        const featArray = Array.isArray(v.features)
                          ? v.features
                          : typeof v.features === 'string'
                          ? JSON.parse(v.features || '[]')
                          : [];

                        return (
                          <Draggable key={id} draggableId={id} index={index} isDragDisabled={isFilterActive}>
                            {(providedDrag, snapshot) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                style={providedDrag.draggableProps.style}
                                className={`grid grid-cols-[144px_120px_220px_120px_minmax(0,1fr)_100px] items-center text-xs text-zinc-900 dark:text-zinc-100 transition-colors ${
                                  snapshot.isDragging
                                    ? 'bg-white dark:bg-[#13161c] shadow-2xl ring-2 ring-teal-500 rounded-xl z-50'
                                    : 'hover:bg-teal-50/40 dark:hover:bg-[#1a1e27]/80'
                                }`}
                              >
                                <div className="px-5 py-3.5 whitespace-nowrap">
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      {...providedDrag.dragHandleProps}
                                      disabled={isFilterActive}
                                      className={`p-1 rounded transition-colors ${
                                        isFilterActive
                                          ? 'opacity-30 cursor-not-allowed text-zinc-400'
                                          : 'hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing'
                                      }`}
                                      title={isFilterActive ? 'Clear filters to reorder' : 'Drag to reorder showroom position'}
                                    >
                                      <GripVertical className="w-3.5 h-3.5 stroke-[1.75]" />
                                    </button>

                                    <div className="flex flex-col -space-y-0.5">
                                      <button
                                        type="button"
                                        disabled={index === 0 || isFilterActive}
                                        onClick={() => handleMove(index, -1)}
                                        className="p-0.5 rounded hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] disabled:opacity-20 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                        title="Move Up"
                                      >
                                        <ArrowUp className="w-2.5 h-2.5 stroke-[2]" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={index === filteredVehicles.length - 1 || isFilterActive}
                                        onClick={() => handleMove(index, 1)}
                                        className="p-0.5 rounded hover:bg-[#f6f8fa] dark:hover:bg-[#1a1e27] disabled:opacity-20 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                                        title="Move Down"
                                      >
                                        <ArrowDown className="w-2.5 h-2.5 stroke-[2]" />
                                      </button>
                                    </div>

                                    <span className="font-mono text-xs tabular-nums font-semibold text-zinc-400 dark:text-zinc-500 w-5 text-center select-none">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>

                                <div className="px-5 py-3.5">
                                  <div className="relative w-20 h-12 bg-[#f6f8fa] dark:bg-[#1a1e27] rounded-lg overflow-hidden flex items-center justify-center">
                                    {v.image ? (
                                      <img src={v.image} alt={v.vehicleName} className="object-contain w-full h-full" />
                                    ) : (
                                      <CarFront className="w-5 h-5 text-zinc-400" />
                                    )}
                                  </div>
                                </div>

                                <div className="px-5 py-3.5 font-bold text-zinc-950 dark:text-white truncate">
                                  <div className="flex items-center gap-2">
                                    <span>{v.vehicleName}</span>
                                    <span className="text-[10px] font-mono font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-1.5 py-0.5 rounded">
                                      Pos {index + 1}
                                    </span>
                                  </div>
                                </div>

                                <div className="px-5 py-3.5 font-mono tabular-nums font-semibold">
                                  {v.seatingCapacity} Seats
                                </div>

                                <div className="px-5 py-3.5">
                                  <div className="flex flex-wrap gap-1 max-w-sm">
                                    {featArray.slice(0, 3).map((feat, idx) => (
                                      <span key={idx} className="px-2 py-0.5 rounded bg-[#f6f8fa] dark:bg-[#1a1e27] text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
                                        {feat}
                                      </span>
                                    ))}
                                    {featArray.length > 3 && (
                                      <span className="text-[10px] font-mono text-zinc-400">+{featArray.length - 3}</span>
                                    )}
                                  </div>
                                </div>

                                <div className="px-5 py-3.5 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(v)}
                                    className="p-1.5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors mr-1 cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4 stroke-[1.75]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(v.id)}
                                    className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors cursor-pointer"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4 stroke-[1.75]" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-[#13161c] rounded-2xl p-6 shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-5 pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                  {editingVehicle ? 'Edit Vehicle Listing' : 'Add Vehicle to Fleet'}
                </h2>
                <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                  Fill details and upload high-res photo for the showroom
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  placeholder="e.g. 12 Seater Luxury Maharaja Tempo Traveller"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(e.target.value)}
                    placeholder="12"
                    min="1"
                    max="100"
                    className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                    required
                  />
                </div>
                <div>
                  <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                    Permit / Category
                  </label>
                  <input
                    type="text"
                    disabled
                    value="All-India Tourist Permit"
                    className="w-full bg-[#f6f8fa]/60 dark:bg-[#1a1e27]/60 text-zinc-400 rounded-lg px-3.5 py-2.5 text-xs font-mono cursor-not-allowed border-0"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comfortable Maharaja 1x1 recliner seats, charging ports, and dual AC."
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                  required
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Features (Comma Separated)
                </label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Pushback Seats, Dual AC, LED Screen, USB Charging"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-medium border-0"
                />
              </div>

              <div>
                <label className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
                  Vehicle Image
                </label>
                
                {imagePreviewUrl && (
                  <div className="mb-3 p-2.5 rounded-xl bg-[#f6f8fa] dark:bg-[#1a1e27] flex items-center gap-3">
                    <div className="w-20 h-14 bg-white dark:bg-[#13161c] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                      <img src={imagePreviewUrl} alt="Preview" className="object-contain w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-teal-600 dark:text-teal-400 font-bold block">
                        Preview Active
                      </span>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {image ? image.name : imageUrl}
                      </p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2 focus:ring-1 focus:ring-teal-500 outline-none text-xs mb-2 cursor-pointer border-0"
                  accept="image/*"
                />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!image) setImagePreviewUrl(e.target.value);
                  }}
                  placeholder="Or paste Cloudinary / WebP Image URL"
                  className="w-full bg-[#f6f8fa] dark:bg-[#1a1e27] text-zinc-900 dark:text-white rounded-lg px-3.5 py-2.5 focus:ring-1 focus:ring-teal-500 outline-none text-xs font-mono border-0"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-zinc-700 dark:text-zinc-300 bg-[#f6f8fa] dark:bg-[#1a1e27] hover:bg-zinc-200/60 dark:hover:bg-zinc-800 rounded-lg font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg text-xs tracking-wide active:scale-[0.98] shadow-xs cursor-pointer transition-all"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
