"use client";
import { DataOutage } from "@/components/data-outage";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <DataOutage retry={reset}/>}
