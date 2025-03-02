"use client"

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CirclePlus, CircleX, EyeClosed, EyeIcon, PenBoxIcon, SendHorizonal, Trash } from "lucide-react";
import { useForm } from "react-hook-form"
import { decrypt, encrypt } from "@/utils";
import { toast } from "sonner";

interface RecordInput {
    id?: number
    provider: string
    username: string
    password: string
    link: string
}

export interface PropType {
    id: number
    provider: string
    username: string
    password: string
    link: string
}

const Home = ({ props }: { props: PropType[] }) => {
    const [data, setData] = React.useState(props);

    const [showData, setShowData] = React.useState(data);
    const [search, setSearch] = React.useState("");

    const {
        register,
        handleSubmit,
        reset
    } = useForm<RecordInput>()

    React.useEffect(() => {
        setShowData(data)
    }, [data])

    const addRecord = async (record: RecordInput) => {
        const newData = {
            id: data.length + 1,
            provider: record.provider,
            username: record.username,
            password: encrypt(record.password),
            link: record.link
        }

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL!, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${process.env.NEXT_PUBLIC_TOKEN!}`
                },
                body: JSON.stringify(newData)
            })

            if (!response.ok) {
                toast("Record is not added.")
                return;
            }

            setData([...data, newData])
            setShowData([...data, newData])
            reset()
            toast("Record is added.")

        } catch (e: any) {
            toast("Record is not added.")
        }
    }

    const updateRecord = async (record: PropType) => {
        setData(data.map((item) => {
            if (item.id === record.id) {
                return record;
            }
            return item;
        }))
    }

    const deleteRecord = async (record: PropType) => {
        setData(data.filter((item) => item.id !== record.id))
    }

    return <section className={'flex items-center justify-center'}>
        <div className={'absolute top-0 p-3 bg-accent w-full z-20 flex items-center justify-between'}>
            <div className={'flex items-center justify-center gap-4 mx-auto container'}>
                <div className={'flex items-center gap-2 w-full'}>
                    <Input type={'text'} name={'search'}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowData(data.filter((item) => {
                                if (item.provider.toLowerCase().includes(e.target.value.toLowerCase()) || item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
                                    return item;
                                }
                            }));
                        }}
                        className={'rounded-sm focus-visible:ring-0 focus-visible:border-input'} placeholder={'Search...'} />
                    {
                        search !== "" && <Button className={'cursor-pointer rounded-sm'} variant={'outline'} size={'icon'}
                            onClick={() => {
                                setSearch("");
                                setShowData(data);
                            }}>
                            <CircleX className={'w-4 h-4'} />
                        </Button>
                    }
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className={'cursor-pointer rounded-sm'}>
                            <CirclePlus className={'w-4 h-4'} />
                            Add Password
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>
                                Add Password
                            </DialogTitle>
                        </DialogHeader>
                        <form className="grid gap-4" onSubmit={handleSubmit(addRecord)}>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="provider" className="text-right">
                                    Provider
                                </Label>
                                <Input id="provider" {...register("provider")} className="col-span-3 focus-visible:border-input focus-visible:ring-0" defaultValue={"Pedro Duarte"} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Username
                                </Label>
                                <Input id="username" {...register("username")} className="col-span-3 focus-visible:border-input focus-visible:ring-0" defaultValue={"Pedro Duarte"} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input id="password" type={'password'} {...register("password")} className="col-span-3 focus-visible:border-input focus-visible:ring-0" defaultValue={"Pedro Duarte"} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="link" className="text-right">
                                    Link
                                </Label>
                                <Input id="link" {...register("link")} defaultValue="@peduarte" className="col-span-3 focus-visible:border-input focus-visible:ring-0" />
                            </div>
                            <Button className={'cursor-pointer'} type={'submit'}>
                                <SendHorizonal className={'w-4 h-4'} />
                                Save
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        <div className={'w-full container mx-auto h-full pt-20'}>
            <Table className={'border rounded-sm mb-10'}>
                <TableHeader className={'bg-gray-100'}>
                    <TableRow>
                        <TableHead className="">Provider</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead className="text-right">Link</TableHead>
                        <TableHead className={'text-center'}>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        showData.length === 0 ? <TableRow>
                            <TableCell colSpan={4} className={'text-center'}>{"No such records found."}</TableCell>
                        </TableRow> :
                            showData.map((item, index) => {
                                return <TableRow key={index}>
                                    <TableCell className="font-medium">{item.provider}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <PasswordColumn password={item.password} />
                                    <TableCell className="text-right">{item.link}</TableCell>
                                    <TableCell className={'flex items-center justify-center gap-4'}>
                                        <EditModalForm record={item} updateRecord={updateRecord} />
                                        <DeleteModalForm record={item} deleteRecord={deleteRecord} />
                                    </TableCell>
                                </TableRow>
                            })
                    }
                </TableBody>
            </Table>
        </div>
    </section>
};

const EditModalForm = ({ record, updateRecord }: { record: PropType, updateRecord: (record: PropType) => void }) => {
    const {
        register,
        handleSubmit,
        reset
    } = useForm<PropType>({
        defaultValues: {
            id: record.id,
            provider: record.provider,
            username: record.username,
            password: decrypt(record.password),
            link: record.link
        }
    })
    const [isOpen, setIsOpen] = React.useState(false);

    const editRecord = async (record: PropType) => {
        const newData = {
            id: record.id,
            provider: record.provider,
            username: record.username,
            password: encrypt(record.password),
            link: record.link
        }

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL!, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${process.env.NEXT_PUBLIC_TOKEN!}`
                },
                body: JSON.stringify(newData)
            })

            if (!response.ok) {
                toast("Record is not updated.")
                return;
            }

            updateRecord(newData)
            reset({ id: record.id, provider: record.provider, username: record.username, password: decrypt(record.password), link: record.link })
            toast("Record is updated.")
            setIsOpen(false)
        } catch (e: any) {
            toast("Record is not updated.")
        }
    }

    return <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant={'outline'} size={'icon'} className={'cursor-pointer'}>
                <PenBoxIcon className={'w-4 h-4'} />
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    Edit Password
                </DialogTitle>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={handleSubmit(editRecord)}>
                <Input type={'hidden'} defaultValue={record.id} {...register("id")} />
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="provider" className="text-right">
                        Provider
                    </Label>
                    <Input id="provider" {...register("provider")} className="col-span-3 focus-visible:border-input focus-visible:ring-0" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Username
                    </Label>
                    <Input id="username" {...register("username")} className="col-span-3 focus-visible:border-input focus-visible:ring-0" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                        Password
                    </Label>
                    <Input id="password" type={'password'} {...register("password")} className="col-span-3 focus-visible:border-input focus-visible:ring-0" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="link" className="text-right">
                        Link
                    </Label>
                    <Input id="link" {...register("link")} className="col-span-3 focus-visible:border-input focus-visible:ring-0" />
                </div>
                <Button className={'cursor-pointer'} type={'submit'}>
                    <SendHorizonal className={'w-4 h-4'} />
                    Update
                </Button>
            </form>
        </DialogContent>
    </Dialog>
}

const DeleteModalForm = ({ record, deleteRecord }: { record: PropType, deleteRecord: (record: PropType) => void }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const editRecord = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL!, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${process.env.NEXT_PUBLIC_TOKEN!}`
                },
                body: JSON.stringify({ id: record.id })
            })

            if (!response.ok) {
                toast("Record is not deleted.")
                return;
            }

            deleteRecord(record)
            toast("Record is deleted.")
            setIsOpen(false)
        } catch (e: any) {
            toast("Record is not deleted.")
        }
    }

    return <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant={'destructive'} size={'icon'} className={'cursor-pointer'}>
                <Trash className={'w-4 h-4'} />
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    Delete Password
                </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
                <p>Are you sure, you want to delete the password ?</p>
                <div className={'flex items-center justify-between gap-4'}>
                    <Button variant={'outline'} className={'cursor-pointer'} onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant={'destructive'} className={'cursor-pointer'} onClick={editRecord}>
                        Delete
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}

const PasswordColumn = ({ password }: { password: string }) => {
    const [show, setShow] = React.useState(false);

    return <TableCell className={'flex items-center justify-between'}>
        {show ? decrypt(password) : "****************"}
        {show ? <EyeClosed className={'w-4 h-4 cursor-pointer'} onClick={() => {
            setShow(!show)
        }} /> : <EyeIcon className={'w-4 h-4 cursor-pointer'} onClick={() => {
            setShow(!show)
        }} />}
    </TableCell>
}

export default Home;