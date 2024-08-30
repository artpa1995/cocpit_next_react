import React, { useState, useEffect } from 'react';
import Select, { MultiValue, SingleValue, components } from 'react-select';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateSettings } from '../../../store/settingsSlice';

interface OptionType {
  value: string;
  label: string;
}

interface OptionCurrencyType {
  value: number;
  label: string;
  icon: string;
}

const dayOptions: OptionType[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

interface DecodedToken {
  user: {
    id: number;
    time_zone: string;
    start_date: string;
    end_date: string;
    week_days: string;
    currency: number;
  };
}

interface Currency {
  id: number;
  name: string;
  icon: string;
}

// Custom components for react-select
const CustomSingleValue = ({ data }: any) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span dangerouslySetInnerHTML={{ __html: data.icon }} />
    <span style={{ marginLeft: 8 }}>{data.label}</span>
  </div>
);

const CustomOption = (props: any) => {
  return (
    <components.Option {...props}>
      <CustomSingleValue data={props.data} />
    </components.Option>
  );
};

const SidebarSettings: React.FC = () => {
  const token = Cookies.get('token');
  const [time_zone, setTime_zone] = useState('');
  const [start_date, setStart_date] = useState('');
  const [end_date, setEnd_date] = useState('');
  const [selectedDays, setSelectedDays] = useState<MultiValue<OptionType>>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<SingleValue<OptionCurrencyType>>(null);
  const [currencyOptions, setCurrencyOptions] = useState<OptionCurrencyType[]>([]);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(`/api/currency`);
      const currencies: Currency[] = response.data;

      const options = currencies.map(currency => ({
        value: currency.id,
        label: currency.name,
        icon: currency.icon,
      }));

      setCurrencyOptions(options);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  useEffect(() => {
    if (currencyOptions.length === 0) {
      fetchCurrencies();
    }
  }, [currencyOptions]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);

      setTime_zone(decodedToken.user.time_zone || '');
      setStart_date(decodedToken.user.start_date || '');
      setEnd_date(decodedToken.user.end_date || '');

      if (decodedToken.user.week_days) {
        const parsedDays = decodedToken.user.week_days.split(',').map((day: string) => {
          return dayOptions.find(option => option.value === day) as OptionType;
        });
        setSelectedDays(parsedDays);
      } else {
        setSelectedDays([]);
      }
      const currencyOption = currencyOptions.find(option => option.value == decodedToken.user.currency);
      setSelectedCurrency(currencyOption || null);

      const week_days = selectedDays.map(day => day.value).join(',');
        dispatch(updateSettings({
          time_zone: decodedToken.user.time_zone ,
          start_date: decodedToken.user.start_date,
          end_date: decodedToken.user.end_date,
          week_days,
          currency: selectedCurrency ? {
            id: selectedCurrency.value.toString(),
            name: selectedCurrency.label,
            icon: selectedCurrency.icon
          } : null,
        }));
      
    }
  }, [token, currencyOptions]);

  const handleChangeDays = (selectedOptions: MultiValue<OptionType>) => {
    setSelectedDays(selectedOptions);
  };

  const handleChangeCurrency = (selectedOption: SingleValue<OptionCurrencyType>) => {
    setSelectedCurrency(selectedOption);
  };

  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const week_days = selectedDays.map(day => day.value).join(',');
    const currency = selectedCurrency ? selectedCurrency.value.toString() : '';

    try {
      const response = await axios.post('/api/user/updateSettings', {
        time_zone,
        start_date,
        end_date,
        week_days,
        currency,
      });

      if (response.status === 200) {
        alert('Settings updated successfully');
        dispatch(updateSettings({
          time_zone,
          start_date,
          end_date,
          week_days,
          currency: selectedCurrency ? {
            id: selectedCurrency.value.toString(),
            name: selectedCurrency.label,
            icon: selectedCurrency.icon
          } : null,
        }));
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };  

  return (
    <div>
      <form onSubmit={handleSubmit} className='mt-5'>
        <div>
          <Select
            isMulti
            options={dayOptions}
            value={selectedDays}
            onChange={handleChangeDays}
            placeholder="Select days of the week"
          />
        </div>
        <div>
          <label htmlFor="">Start Time</label>
          <input
            type="time"
            required
            step="3600"
            value={start_date}
            onChange={(e) => setStart_date(e.target.value)}
            className='rounded-lg px-5 py-3 border border-grey-600 mt-5'
          />
        </div>
        <div>
          <label htmlFor="">End Time</label>
          <input
            type="time"
            required
            step="3600"
            value={end_date}
            onChange={(e) => setEnd_date(e.target.value)}
            className='rounded-lg px-5 py-3 border border-grey-600 mt-5'
          />
        </div>
        <div>
          <label htmlFor="">Timezone</label>
          <input
            type="text"
            required
            placeholder='Timezone'
            value={time_zone}
            onChange={(e) => setTime_zone(e.target.value)}
            className='rounded-lg px-5 py-3 border border-grey-600 mt-5'
          />
        </div>

        <div className="mt-5">
          <label htmlFor="">Currency</label>
          <Select
            options={currencyOptions}
            value={selectedCurrency}
            onChange={handleChangeCurrency}
            components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
            placeholder="Select currency"
          />
        </div>

        <div className='mt-5'>
          <button type="submit" className='text-white bg-sky-900 rounded-lg px-5 py-3'>
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SidebarSettings;
