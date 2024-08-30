"use client";
import axios from "axios";
import AdminLayout from '../AdminLayout';
import Select from 'react-select';
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface PageData {
  id: string;
  value: string;
}

export default function AdminDashboard() {
  const [dashboardTitle, setDashboardTitle] = useState<PageData | null>(null);
  const [dashboardDescription, setDashboardDescription] = useState<PageData | null>(null);
  const [dashboardButtonText, setDashboardButtonText] = useState<PageData | null>(null);
  const [dashboardButtonLink, setDashboardButtonLink] = useState<PageData | null>(null);
  const [dashboardVideo, setDashboardVideo] = useState<PageData | null>(null);

  const [dashboardTitleValue, setDashboardTitleValue] = useState<string>('');
  const [dashboardDescriptionValue, setDashboardDescriptionValue] = useState<string>('');
  const [dashboardButtonTextValue, setDashboardButtonTextValue] = useState<string>('');
  const [dashboardButtonLinkValue, setDashboardButtonLinkValue] = useState<string>('');
  const [dashboardVideoValue, setDashboardVideoValue] = useState<string>('');

  const fetchPageData = async () => {
    try {
      const response = await axios.post(`/api/page_info/get_page_info/info`, { page_id: 1 });
      const data = response.data;

      const extractPageData = (obj: Record<string, string>): PageData => {
        const [id, value] = Object.entries(obj)[0];
        return { id, value };
      };

      setDashboardTitle(data.dashboard_title ? extractPageData(data.dashboard_title) : null);
      setDashboardDescription(data.dashboard_description ? extractPageData(data.dashboard_description) : null);
      setDashboardButtonText(data.dashboard_button_text ? extractPageData(data.dashboard_button_text) : null);
      setDashboardButtonLink(data.dashboard_button_link ? extractPageData(data.dashboard_button_link) : null);
      setDashboardVideo(data.dashboard_video ? extractPageData(data.dashboard_video) : null);

    } catch (error) {
      console.error('Error fetching page info:', error);
    }
  };

  const editor = useRef(null);

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    if (dashboardTitle) setDashboardTitleValue(dashboardTitle.value);
    if (dashboardDescription) setDashboardDescriptionValue(dashboardDescription.value);
    if (dashboardButtonText) setDashboardButtonTextValue(dashboardButtonText.value);
    if (dashboardButtonLink) setDashboardButtonLinkValue(dashboardButtonLink.value);
    if (dashboardVideo) setDashboardVideoValue(dashboardVideo.value);
  }, [dashboardTitle, dashboardDescription, dashboardButtonText, dashboardButtonLink, dashboardVideo]);

  const handleUpdateItems = async (id: string, value: string) => {
    try {
      await axios.post('/api/page_info/update_item', { id, value });
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  return (
    <AdminLayout>
      <main className="pb-5">
        <div className="admin_dashboard">
          <div className="title">
            <h3>Bookings Page</h3>
          </div>

          <div className="form">
            <div className="form_items">
              <div className="form_labels">Condition</div>
              <Select placeholder="Conditions" />
            </div>
            <div className="form_items">
              <div className="form_labels">Title</div>
              <input
                type="text"
                value={dashboardTitleValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setDashboardTitleValue(newValue);
                }}
                onBlur={(e) => {
                  const newValue = e.target.value;
                  if (dashboardTitle) {
                    handleUpdateItems(dashboardTitle.id, newValue);
                  }
                }}
                placeholder="Title"
                className='rounded-lg px-5 py-3 border border-grey-600'
              />
            </div>

            <div className="form_items">
              <div className="form_labels">Video</div>
              <input
                type="text"
                value={dashboardVideoValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setDashboardVideoValue(newValue);
                }}
                onBlur={(e) => {
                  const newValue = e.target.value;
                  if (dashboardVideo) {
                    handleUpdateItems(dashboardVideo.id, newValue);
                  }
                }}
                placeholder="Video"
                className='rounded-lg px-5 py-3 border border-grey-600'
              />
            </div>
            <div className="form_items">
              <div className="form_labels">Description</div>
              <JoditEditor
                ref={editor}
                value={dashboardDescriptionValue}
                onBlur={(newContent) => {
                  setDashboardDescriptionValue(newContent)
                  if (dashboardDescription) {
                    handleUpdateItems(dashboardDescription.id, newContent);
                  }
                }} 
                onChange={(newContent) => { 
                }}
              />
            </div>
            <div className="flex gap-6">
              <div className="form_items">
                <div className="form_labels">Button Text</div>
                <input
                  type="text"
                  value={dashboardButtonTextValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setDashboardButtonTextValue(newValue);
                  }}
                  onBlur={(e) => {
                    const newValue = e.target.value;
                    if (dashboardButtonText) {
                      handleUpdateItems(dashboardButtonText.id, newValue);
                    }
                  }}
                  placeholder="Button Text"
                  className='rounded-lg px-5 py-3 border border-grey-600'
                />
              </div>
              <div className="form_items">
                <div className="form_labels">Button Link</div>
                <input
                  type="text"
                  value={dashboardButtonLinkValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setDashboardButtonLinkValue(newValue);
                  }}
                  onBlur={(e) => {
                    const newValue = e.target.value;
                    if (dashboardButtonLink) {
                      handleUpdateItems(dashboardButtonLink.id, newValue);
                    }
                  }}
                  placeholder="Button Link"
                  className='rounded-lg px-5 py-3 border border-grey-600'
                />
              </div>
            </div>
          </div>
          
          <div className="add_onditional_content_block">
            <button>+ Add Conditional Content</button>
          </div>

        </div>
      </main>
    </AdminLayout>
  );
}
