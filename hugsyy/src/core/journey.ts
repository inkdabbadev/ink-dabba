import {createContext,useContext} from 'react';
import type {Scene} from './types';
export const JourneyContext=createContext<{go:(s:Scene)=>void}>({go:()=>{}});
export const useJourney=()=>useContext(JourneyContext);
