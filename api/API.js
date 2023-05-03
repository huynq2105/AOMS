import axios from 'axios';
import { getEnvVars } from '../Environment';
import React, {useRef, useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { apiUrl } = getEnvVars();

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, 
});

export default axiosInstance;
