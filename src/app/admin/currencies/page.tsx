"use client";
import axios from "axios";
import AdminLayout from '../AdminLayout';
import React, { useState, useEffect } from 'react';
import Modal, { Styles } from 'react-modal';

interface Currency {
  id: string;
  name: string;
  icon: string;
}

export default function Home() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');

  const customStyles: Styles = {
    content: {
      width: '480px',
      height: '330px',
      margin: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'start',
      alignItems: 'center',
      gap: '10px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
  };

  const saveCurrency = async () => {
    try {
      const response = await axios.post(`/api/currency`, { name, icon });
      const data = response.data;

      if (data) {
        setName('');
        setIcon('');
        setShowModal(false);
        setCurrencies([...currencies, data.currency]);
      }
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(`/api/currency`);
      const data = response.data;
      setCurrencies(data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const changeItems =  async (id: string, field: keyof Currency, value: string) => {
    try {
        const response = await axios.put(`/api/currency`, { id, field, value });
        const data = response.data;
    } catch (error) {
        console.error('Error saving currency:', error);
    }
    setCurrencies((prevCurrencies) =>
      prevCurrencies.map((currency) =>
        currency.id === id ? { ...currency, [field]: value } : currency
      )
    );
  };

  const deleteItems = async (id: string) => {
    try {
      const response = await axios.delete(`/api/currency/${id}`);
      const data = response.data;
  
      setCurrencies((prevCurrencies) =>
        prevCurrencies.filter((currency) => currency.id !== id)
      );
  
    } catch (error) {
      console.error('Error deleting currency:', error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <AdminLayout>
      <main className="pb-5">
        <div className="admin_dashboard">
          <div className="title">
            <h3>Currencies Page</h3>
          </div>
          <div className="form">
            {currencies && currencies.map((currency, index) => (
              <div className="items flex gap-4 items-center mb-4" key={index}>
                <div className="flex gap-4">
                  <label htmlFor="">Name</label>
                  <input
                    type="text"
                    onChange={(e) =>
                        setCurrencies((prevCurrencies) =>
                          prevCurrencies.map((curr) =>
                            curr.id === currency.id
                              ? { ...curr, name: e.target.value }
                              : curr
                          )
                        )
                      }
                    onBlur={(e) => changeItems(currency.id, 'name', e.target.value)}
                    className="flex-1 rounded-lg px-4 py-2 border border-gray-300"
                    value={currency.name}
                  />
                </div>
                <div className="flex gap-4">
                  <label htmlFor="">Icon</label>
                  <input
                    type="text"
                    onChange={(e) =>
                        setCurrencies((prevCurrencies) =>
                          prevCurrencies.map((curr) =>
                            curr.id === currency.id
                              ? { ...curr, icon: e.target.value }
                              : curr
                          )
                        )
                      }
                    onBlur={(e) => changeItems(currency.id, 'icon', e.target.value)}
                    className="flex-1 rounded-lg px-4 py-2 border border-gray-300"
                    value={currency.icon}
                  />
                </div>
                <button className="text-red-500" onClick={(e) => deleteItems(currency.id)}>x</button>
              </div>
            ))}
          </div>
          <div className="add_onditional_content_block">
            <button onClick={() => setShowModal(true)}>+ Add Currency</button>
          </div>
        </div>
      </main>
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} style={customStyles}>
        <h2 className="font-bold">Add Currency</h2>
        <label className="text-right">Name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg px-4 py-2 border border-gray-300"
        />
        <label className="text-right">Icon</label>
        <input
          onChange={(e) => setIcon(e.target.value)}
          className="flex-1 rounded-lg px-4 py-2 border border-gray-300"
        />
        <div className="mt-5 flex gap-4">
          <button className="text-white bg-sky-900 rounded-lg px-5 py-3" onClick={saveCurrency}>Save</button>
          <button className="text-white bg-red-900 rounded-lg px-5 py-3" onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
