import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Tiplenmiş useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Tiplenmiş useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;