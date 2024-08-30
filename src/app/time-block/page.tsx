"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Box, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import CoachLayout from '../coach/CoachLayout';

const TimeBlock: React.FC = () => {

  return (
    <CoachLayout>
      <div className='flex h-full w-full flex-col justify-between'>
        <h1 className="font-bold">Time Block</h1>
      </div>
  
    </CoachLayout>
  );
};

export default TimeBlock;
