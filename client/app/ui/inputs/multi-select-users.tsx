"use client";
import { User } from "@/app/lib/definitions";
import { useMemo, useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import useFetchUsers from "@/app/hooks/useFetchUsers";
import CircularSpinner from "../spinners/cicrular-spinner";


export default function MultiSelectUsers () {
    const [selected, setSelected] = useState<User[]>([]);
    const [query, setQuery] = useState('');

    const { users, loading } = useFetchUsers(query);

    const select = (option: User) => {
        setSelected(prev => [...prev, option]);
    }
    
    const remove = (option: User) => {
        setSelected(selected.filter(u => u.id !== option.id));
    }
    
    const filteredOptions = useMemo(() => {
        return users.filter(option => option.name.trim().toLowerCase().includes(query.trim().toLowerCase()) && !selected.map(s => s.id).includes(option.id));
    }, [query, selected, users]);

    return ( 
        <div className="relative">
            <div className="p-3 border border-gray-400 rounded-md flex flex-row gap-3">
                <ul className="flex gap-1.5">
                    {selected.map(selectedOption => 
                        <li className="flex justify-between rounded-sm gap-1.5 items-center bg-gray-500 text-sm p-2" key={selectedOption.id}>
                            <span>{selectedOption.name}</span>
                            <button type="button" className="cursor-pointer" onClick={() => remove(selectedOption)}>
                                <XMarkIcon className="w-4 cursor"/>
                            </button>
                        </li>
                    )}
                </ul>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type more..." className="outline-none!"/>
                <input type="hidden" name="selectedUsers" value={selected.map(s => s.id)} />
            </div>

            <br />
            {loading ?
                <CircularSpinner />
                :
                <>
                    {filteredOptions.length > 0 && 
                        <ul className="shadow-2xs z-10 border border-gray-600 rounded-md absolute p-0 w-full">
                            {filteredOptions.map(option => 
                                <li className="" key={option.id}>
                                    <button className="hover:bg-gray-600 cursor-pointer w-full" type="button" onClick={() => select(option)}>{option.name}</button>
                                </li>
                            )}
                        </ul>
                    }
                </>
            }
        </div>
    );
}