import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	deleteManyCompany,
	loadAllCompanyPaginated,
} from "../../../redux/rtk/features/crm/company/companySlice";
import { loadAllCompanyType } from "../../../redux/rtk/features/crm/companyType/companyTypeSlice";
import { loadAllIndustry } from "../../../redux/rtk/features/crm/industry/industrySlice";
import { loadAllStaff } from "../../../redux/rtk/features/user/userSlice";
import ViewBtn from "../../Buttons/ViewBtn";
import UserPrivateComponent from "../../PrivateRoutes/UserPrivateComponent";
import CreateDrawer from "../CommonUi/CreateDrawer";
import CrmSearch from "../CommonUi/CrmSearch";
import TableComponent from "../CommonUi/TableComponent";
import CreateCompanyForm from "./CreateCompanyForm";

const columns = [
	{
		title: "Name",
		key: "COMPANY NAME",
		render: ({ companyName, id }) =>
			id ? <Link to={`/admin/company/${id}`}>{companyName}</Link> : "-",
		sorter: (a, b) => a.companyName.localeCompare(b.companyName),
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
	},
	{
		title: "Phone number",
		dataIndex: "phone",
		key: "phone",
	},
	{
		title: "Owner",
		dataIndex: "companyOwner",
		key: "owner",
		render: (companyOwner, item) => (
			<Link to={`/admin/setup/staffs/${item?.companyOwnerId}`}>
				{companyOwner.firstName} {companyOwner.lastName}
			</Link>
		),
	},

	{
		title: "Type",
		dataIndex: "companyType",
		render: (companyType) => companyType?.companyTypeName,
	},
	{
		title: "Size",
		dataIndex: "companySize",
		key: "companySize",
	},

	{
		title: "Annual Revenue",
		dataIndex: "annualRevenue",
		key: "annualRevenue",
	},
	{
		title: "Industry",
		dataIndex: "industry",
		render: (industry) => industry?.industryName,
	},
	{
		title: "Action",
		dataIndex: "id",
		key: "action",
		render: (id) => (
			<div className='flex justify-start'>
				<UserPrivateComponent permission='readSingle-company'>
					<ViewBtn path={`/admin/company/${id}`} />
				</UserPrivateComponent>
			</div>
		),
	},
];

const Companies = () => {
	const dispatch = useDispatch();
	const { Option } = Select;
	// Drawer state
	const [open, setOpen] = useState(false);

	const onClose = () => {
		setOpen(false);
	};
	// selector
	const { list, loading, total } = useSelector((state) => state.company);
	// filter
	const [isFilter, setFilter] = useState(false);
	const filterToggle = () => {
		setFilter((prev) => !prev);
	};
	const companyType = useSelector((state) => state.companyType.list) || [];
	const industry = useSelector((state) => state.industry.list) || [];
	const companyOwner = useSelector((state) => state.users.list) || [];

	const [form] = Form.useForm();

	const onFinish = async (values) => {
		dispatch(loadAllCompanyPaginated({ ...values }));
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	useEffect(() => {
		dispatch(
			loadAllCompanyPaginated({
				status: true,
				page: 1,
				count: 10,
			})
		);
		dispatch(loadAllCompanyType());
		dispatch(loadAllIndustry());
		dispatch(loadAllStaff({ status: true }));
	}, [dispatch]);

	return (
		<div className='container'>
			<div className='bg-white dark:bg-DTableBg flex flex-col md:flex-row justify-between items-center gap-3 p-3 px-6 border'>
				<div className='flex items-center gap-5'>
					<button
						onClick={filterToggle}
						className={`hidden md:block ${
							isFilter ? "bg-transparent border border-red-600" : "bg-blue-500"
						}  px-5 py-2 rounded cursor-pointer`}
						type='submit'>
						{isFilter ? (
							<span className='flex justify-center dark:text-white items-center gap-2'>
								<AiOutlineClose /> Close
							</span>
						) : (
							<span className='text-white'>Filter</span>
						)}
					</button>
					{!isFilter ? (
						<CrmSearch paginatedThunk={loadAllCompanyPaginated} />
					) : (
						<div className='flex text-md'>
							<Form
								className='flex flex-wrap justify-center gap-2 md:items-center'
								form={form}
								onFinish={onFinish}
								onFinishFailed={onFinishFailed}
								layout='inline'
								initialValues={{
									status: ["true"],
								}}>
								<Form.Item name='companyOwner' className='w-full md:w-[180px]'>
									<Select
										mode='multiple'
										style={{ width: "100%" }}
										placeholder='Select Company owner'
										maxTagCount={0}
										showArrow
										maxTagPlaceholder={
											<div className='w-[150px]'>Company Owner</div>
										}>
										{companyOwner?.map((item) => (
											<Option key={item.id} value={item.id}>
												{item?.firstName} {item?.lastName}
											</Option>
										))}
									</Select>
								</Form.Item>

								<Form.Item name='companyType' className='w-full md:w-[180px]'>
									<Select
										mode='multiple'
										style={{ width: "100%" }}
										placeholder='Select Type'
										maxTagCount={0}
										showArrow
										maxTagPlaceholder={<div className='w-[150px]'>Type</div>}>
										{companyType?.map((item) => (
											<Option key={item.id} value={item.id}>
												{item.companyTypeName}
											</Option>
										))}
									</Select>
								</Form.Item>
								<Form.Item name='industry' className='w-full md:w-[180px]'>
									<Select
										mode='multiple'
										style={{ width: "100%" }}
										placeholder='Select Industry'
										maxTagCount={0}
										showArrow
										maxTagPlaceholder={
											<div className='w-[150px]'>Industry</div>
										}>
										{industry?.map((item) => (
											<Option key={item.id} value={item.id}>
												{item.industryName}
											</Option>
										))}
									</Select>
								</Form.Item>
								<Form.Item name='status' className='w-full md:w-[180px]'>
									<Select
										mode='multiple'
										style={{ width: "100%" }}
										placeholder='Please select'
										defaultValue={["true"]}>
										<Option value='true'>True</Option>
										<Option value='false'>False</Option>
									</Select>
								</Form.Item>
								<Form.Item>
									<div className='w-full md:w-[180px] flex justify-start'>
										<button
											className='bg-blue-500 text-white px-5 py-2 rounded cursor-pointer'
											type='submit'>
											Filter
										</button>
										<button
											onClick={filterToggle}
											className='block md:hidden  px-5 py-2 rounded cursor-pointer ml-2 text-rose-700 transition-colors duration-150 border border-rose-500 focus:shadow-outline hover:bg-rose-500 hover:text-rose-100'>
											Cancel
										</button>
									</div>
								</Form.Item>
							</Form>
						</div>
					)}
				</div>
				{!isFilter && (
					<UserPrivateComponent permission='create-contact'>
						<button
							onClick={() => setOpen(true)}
							className='py-2 px-3 w-[163px] border bg-teal-700 hover:bg-teal-500 text-white rounded cursor-pointer flex items-center gap-2'>
							<AiOutlinePlus /> Create Company
						</button>
					</UserPrivateComponent>
				)}
			</div>
			<UserPrivateComponent permission='readAll-company'>
				<TableComponent
					list={list}
					total={total}
					loading={loading}
					columns={columns}
					paginatedThunk={loadAllCompanyPaginated}
					deleteManyThunk={deleteManyCompany}
					csvFileName={"Company-List"}
				/>
			</UserPrivateComponent>

			<UserPrivateComponent permission='create-company'>
				<CreateDrawer onClose={onClose} open={open} title={"Company"}>
					<CreateCompanyForm onClose={onClose} open={open} />
				</CreateDrawer>
			</UserPrivateComponent>
		</div>
	);
};
export default Companies;
