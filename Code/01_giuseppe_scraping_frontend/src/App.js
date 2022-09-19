import './App.css';
import {useEffect, useState} from "react";
import {Button, Typography} from "@mui/material";
import districts from "./data/districts.json";
import axios from "axios";
import AppRouter from "./components/Router";

export default function AppRoot(props){
    return (
        <div>
            <AppRouter></AppRouter>
        </div>
    )
}
