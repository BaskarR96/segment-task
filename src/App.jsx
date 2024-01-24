import React, { useState } from "react";
import { Drawer, Input, Select } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "./components/baseComponents/Button";
import LeftArrowIcon from "./icons/LeftArrowIcon";
import MinusIcon from "./icons/MinusIcon";
import ErrorElement from "./components/baseComponents/ErrorElement";
import { schema } from "./utilis/schema.json";

function App() {

    const initialValue = {
        add_schema: "",
        segment_name: "",
        schema: []
    }

    const [formValue, setFormValue] = useState(initialValue)
    const [isOpen, setIsOpen] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    const footerContent = [
        {
            type: "submit",
            name: "save-the-segment",
            id: "saveTheSegment",
            className: "px-6 py-2 ml-4 font-[500] md:font-[600] bg-[#39aebc] hover:bg-[rgba(57,174,188,0.5)] text-[#fff]",
            label: "Save the segment",
            onClick: async () => {
                if (!formValue?.segment_name) {
                    setErrMsg('Segment name cannot be empty')
                } else if (!formValue?.schema.length >= 1) {
                    setErrMsg('Add atleast one schema to build the query')
                } else {
                    let body = {
                        segment_name: formValue?.segment_name,
                        schema: []
                    };
                    formValue?.schema?.forEach(schemaItem => {
                        const value = schemaItem?.fieldName
                            ?.split('_')
                            ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            ?.join(' ');
                        const keyName = schemaItem?.fieldName;
                        body.schema.push({ [keyName]: value });
                    });

                    try {
                        const result = await axios.post("https://webhook.site/website", body);
                        if (result?.status === 200) {
                            toast.success("Segment saved successfully.")
                            setIsOpen(false)
                            resetState()
                        }
                    } catch (error) {
                        toast.error(`${error}.`);
                    }
                }
            }
        },
        {
            type: "button",
            name: "cancel",
            id: "cancel",
            className: "px-6 py-2 ml-4 font-[500] md:font-[600] text-[#d34975] bg-[#fff] hover:bg-[rgba(0,0,0,0.2)]",
            label: "Cancel",
            onClick: () => {
                setIsOpen(!isOpen)
                resetState()
            }
        },
    ]

    const addSchema = () => {
        if (formValue?.add_schema) {
            setFormValue({
                ...formValue,
                add_schema: "",
                schema: [...formValue.schema, { ["fieldName"]: formValue.add_schema }]
            })
        }
    }
    const removeHandler = (index) => {
        formValue.schema.splice(index, 1)
        setFormValue({ ...formValue, schema: [...formValue.schema] })
    }
    const resetState = () => {
        setFormValue(initialValue)
        setErrMsg("")
    }

    return (
        <>
            <ToastContainer />
            <header className="header-wrapper flex justify-start items-center fixed top-0 z-10 w-full bg-[rgb(57,174,188)] text-[#fff] h-[60px]">
                <h1 className="header-wrapper-logo cursor-pointer hidden md:block text-[16px] sm:text-[18px] ml-4">Customer Labs</h1>
            </header>
            <div className="page pt-14 md:pt-20 ml-4">
                <Button
                    type={"button"}
                    name={"save-segment"}
                    id={"saveSegment"}
                    className={"border border-[#000] px-6 py-2 ml-4 font-[500] md:font-[600] hover:bg-[rgba(0,0,0,0.2)]"}
                    onClick={() => setIsOpen(true)}
                >
                    Save segment
                </Button>
            </div>
            <Drawer
                title={<h2>Saving Segment</h2>}
                className="saving-segment-drawer"
                width={500}
                onClose={() => {
                    setIsOpen(!isOpen)
                    resetState()
                }}
                open={isOpen}
                closeIcon={<LeftArrowIcon className={"pt-1"} />}
                footer={
                    <div className="footer-wrapper">
                        {
                            Array.isArray(footerContent) && footerContent.length > 0 ?
                                footerContent.map((data, index) => {
                                    const {
                                        type,
                                        name,
                                        id,
                                        className,
                                        label,
                                        onClick
                                    } = data
                                    return (
                                        <Button
                                            key={index}
                                            type={type}
                                            name={name}
                                            id={id}
                                            className={className}
                                            onClick={onClick}
                                        >
                                            {label}
                                        </Button>
                                    )
                                }) : ""
                        }
                    </div>
                }
            >
                <div className="body-wrapper">
                    <div className={"mb-5"} >
                        <label htmlFor={"segmentName"} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            Enter name of the segment
                        </label>
                        <Input
                            name={"segment_name"}
                            id={"segmentName"}
                            className={"block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm placeholder:text-[#000] sm:text-sm sm:leading-6 h-11 outline-none"}
                            placeholder="Name of the segment"
                            onChange={(e) => {
                                setFormValue({ ...formValue, segment_name: e.target.value })
                                setErrMsg("")
                            }}
                            value={formValue["segment_name"]}
                        />
                    </div>
                    <div className={"mb-5"} >
                        <label htmlFor={"segmentName"} className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            To save your segement, you need to add the schemas to build the query
                        </label>
                        {
                            Array.isArray(formValue.schema) && formValue.schema.length > 0 ?
                                formValue.schema.map((data, index) => {
                                    return (
                                        <div key={index} className="flex justify-between mb-4">
                                            <Select
                                                name={`fieldName`}
                                                placeholder={"Add schema to segment"}
                                                className={"w-full block rounded-md border py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 min-h-11 h-fit mr-2"}
                                                onChange={(value) => {
                                                    let updatedValue = [...formValue.schema]
                                                    updatedValue[index]['fieldName'] = value
                                                    setFormValue({
                                                        ...formValue,
                                                        schema: updatedValue
                                                    })
                                                    setErrMsg("")
                                                }}
                                                value={data.fieldName}
                                            >
                                                <Select.Option key={data.fieldName} value={data.fieldName}>
                                                    {
                                                        data.fieldName?.split('_')?.map(word => word.charAt(0).toUpperCase() + word.slice(1))?.join(' ')
                                                    }
                                                </Select.Option>
                                                {
                                                    schema.map((option, index) => {
                                                        const isSelected = formValue?.schema?.some(data => data.fieldName === option.value);
                                                        if (!isSelected) {
                                                            return (
                                                                <Select.Option key={index} value={option.value}>{option.label}</Select.Option>
                                                            )
                                                        }
                                                    })
                                                }
                                            </Select>
                                            <Button
                                                type={"button"}
                                                className="p-4 bg-[#f2fbf9]"
                                                onClick={() => removeHandler(index)}
                                            >
                                                <MinusIcon />
                                            </Button>
                                        </div>
                                    )
                                }) : ""
                        }
                        {
                            formValue?.schema.length !== schema.length ?
                                <>
                                    <div className="flex justify-between">
                                        <Select
                                            name={"add_schema"}
                                            className={"w-full block rounded-md border py-1.5 text-gray-900 shadow-sm sm:text-sm sm:leading-6 min-h-11 h-fit mr-2"}
                                            onChange={(value) => {
                                                setFormValue({ ...formValue, ['add_schema']: value })
                                                setErrMsg("")
                                            }}
                                            value={formValue["add_schema"]}
                                        >
                                            <Select.Option className="text-gray-400" value="">Add schema to segment</Select.Option>
                                            {
                                                schema.map((option, index) => {
                                                    const isSelected = formValue?.schema?.some(data => data.fieldName === option.value);
                                                    if (!isSelected) {
                                                        return (
                                                            <Select.Option key={index} value={option.value}>{option.label}</Select.Option>
                                                        )
                                                    }
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <Button
                                        type={"button"}
                                        name={"add-schema"}
                                        id={"addSchema"}
                                        className={"border border-t-0 border-l-0 border-r-0 border-b-[rgb(57,174,188)] py-2 font-[500] md:font-[600] text-[rgb(57,174,188)] mt-5"}
                                        onClick={addSchema}
                                    >
                                        + Add new schema
                                    </Button>
                                </> : ''
                        }
                    </div>
                    {
                        errMsg ? <ErrorElement>{errMsg}</ErrorElement> : ""
                    }
                </div>
            </Drawer>
        </>
    )

}

export default App
